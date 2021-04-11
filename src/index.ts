import { Parser, Grammar } from 'nearley'
import grammar from './grammar.ne'


// const data = new URLSearchParams(window.location.search);
// const code: string = data.get('code');
const GRAMMAR: Grammar = Grammar.fromCompiled(grammar);

interface Link {
    protocol: string
    url: string
}

interface VariableTransform {
    key: string
    from: string
    next: VariableTransform
}

interface Definition {
    keyword: string
    variables: VariableTransform
}

interface Command {
    action: string
    link: Link
    define: Definition

    key: string
    value: string
}

interface Token {
    cmd: Command
    next: Token
}

const CODE_VALUE: string = `
set header "Authorization" "fergs3mrow3mfo"
get http://google.com/ping
post form a=rer,f=future http://google.com/ping
get as a=key1,b=key2,c=key3 http://google.com
post json a,b,c http://google.com/new-user
post params a=cat,b,c http://google.com/new-user
`;

let el: HTMLElement = window.document.getElementById('code');
el.innerText = CODE_VALUE

let update = () => {
    const code: string = el.innerText;
    let result: Token = null;
    let okLast: number = 0;
    try {
        console.time("parser 🥽")
        let parser: Parser = new Parser(GRAMMAR);
        for (let i = 0; i < code.length; i++) {
            let state: Array<any> = parser.feed(code[i]).results;
            if (state[0] !== null || state[0] !== undefined) {
                okLast = i;
            }
        }
        console.timeEnd("parser 🥽")
        result = parser.finish()[0];
    } catch (e) {
        // Syntax error.
        console.log(e);
    }
    if (result === null || result === undefined) {
        let errorText: string = '<span class="error-text">' + code.slice(
            1 + code.lastIndexOf('\n', okLast),
            okLast
        ) + '</span>'
        errorText += '<span class="error-text error-position">' + code.slice(
            okLast,
            1 + okLast
        ) + '</span>'
        errorText += '<span class="error-text">' + code.slice(
            1 + okLast,
            1 + code.indexOf('\n', okLast)
        ) + '</span>'
        document.getElementById('result').innerHTML = 'Syntax error. ' + errorText;
        document.getElementById('code-bg').innerHTML = code
        return
    }
    let highlightedCode: string = ''
    let b = (x: string, tagClass: string, start: number) => {
        let tokenStart: number = code.indexOf(x, start)
        let tokenEnd: number = start + x.length
        let pre: string = code.slice(start, tokenStart)
        highlightedCode = highlightedCode
            + pre
            + '<span class="' + tagClass + '">'
            + x
            + '</span>'
        return tokenEnd + pre.length
    }
    let d = (variable: VariableTransform, start: number) => {
        start = b(variable.key, 'chy', start)
        if (variable.from !== undefined) {
            start = b(variable.from, 'chy', start)
        }
        if (variable.next !== undefined) {
            start = d(variable.next, start)
        }
        return start
    }
    let c = (token: Token, start: number) => {
        start = b(token.cmd.action, 'chr', start)
        if (token.cmd.key !== undefined) {
            start = b(`"${token.cmd.key}"`, 'chg', start)
            start = b(`"${token.cmd.value}"`, 'chg', start)
        } else {
            if (token.cmd.define !== undefined) {
                start = b(token.cmd.define.keyword, 'chr', start)
                start = d(token.cmd.define.variables, start)
            }
            start = b(token.cmd.link.protocol, 'chb', start)
            start = b(token.cmd.link.url, 'chp', start)
        }
        if (token.next !== undefined) {
            c(token.next, start)
        }
    }
    console.log(result)
    c(result, 0)
    document.getElementById('code-bg').innerHTML = highlightedCode
    document.getElementById('result').innerHTML = JSON.stringify(result, null, 2);
}

el.addEventListener('input', update)

el.focus()
update()