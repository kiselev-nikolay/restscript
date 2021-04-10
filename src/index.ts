import { Parser, Grammar } from 'nearley'
import grammar from './grammar.ne'


// const data = new URLSearchParams(window.location.search);
// const code: string = data.get('code');
const GRAMMAR: Grammar = Grammar.fromCompiled(grammar);

interface Link {
    protocol: string
    url: string
}

interface Command {
    action: string
    link: Link
}

interface Token {
    cmd: Command
    next: Token
}

const CODE_VALUE: string = `ping http://google.com/ping?r=1&g=3
post http://google.com/ping
get http://google.com
head http://go{}ogle.com/
ping http://google.com/ping?r=1&g=3
post http://google.com/ping?r=1&g=3
`;

let el: HTMLElement = window.document.getElementById('code');
el.innerText = CODE_VALUE

let update = () => {
    const code: string = el.innerText;
    let result: Token = null;
    let okLast: number = 0;
    try {
        let parser: Parser = new Parser(GRAMMAR);
        for (let i = 0; i < code.length; i++) {
            let state: Array<any> = parser.feed(code[i]).results;
            if (state[0] !== null || state[0] !== undefined) {
                okLast = i;
            }
        }
        result = parser.finish()[0];
    } catch {
        // Syntax error.
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
    let c = (token: Token, start: number) => {
        start = b(token.cmd.action, 'chr', start)
        start = b(token.cmd.link.protocol, 'chb', start)
        start = b(token.cmd.link.url, 'chp', start)
        if (token.next !== undefined) {
            c(token.next, start)
        }
    }
    c(result, 0)
    document.getElementById('code-bg').innerHTML = highlightedCode
    document.getElementById('result').innerHTML = JSON.stringify(result, null, 2);
}

el.addEventListener('input', update)

el.focus()
update()