import { Parser, Grammar } from 'nearley';
import grammar from './grammar.ne';
import { highlight } from './highlight';

// const data = new URLSearchParams(window.location.search);
// const code: string = data.get('code');
const GRAMMAR: Grammar = Grammar.fromCompiled(grammar);

const CODE_VALUE: string = `set header "Authorization" "fergs3mrow3mfo"
get http://google.com/ping
post form a=rer,f=future http://google.com/ping
get as a=key1,b=key2,c=key3 http://google.com
post json a,b,c http://google.com/new-user
post params a=cat,b,c http://google.com/new-user
`;

let el: HTMLElement = window.document.getElementById('code');
el.innerText = CODE_VALUE;

let update = () => {
    console.time("Total ⏳");
    let code: string = el.innerText;
    code += "\n";
    let result: Token = null;
    let okLast: number = 0;
    try {
        console.time("Parser 🥽");
        let parser: Parser = new Parser(GRAMMAR);
        for (let i = 0; i < code.length; i++) {
            let state: Array<any> = parser.feed(code[i]).results;
            if (state[0] !== null || state[0] !== undefined) {
                okLast = i;
            }
        }
        console.timeEnd("Parser 🥽");
        result = parser.finish()[0];
    } catch {
        // Syntax error.
        console.timeEnd("Parser 🥽");
    }
    console.time("Highlight 🎨");
    if (result === null || result === undefined) {
        let errorText: string = '<span class="error-text">' + code.slice(
            1 + code.lastIndexOf('\n', okLast),
            okLast
        ) + '</span>';
        errorText += '<span class="error-text error-position">' + code.slice(
            okLast,
            1 + okLast
        ) + '</span>';
        errorText += '<span class="error-text">' + code.slice(
            1 + okLast,
            1 + code.indexOf('\n', okLast)
        ) + '</span>';
        document.getElementById('code-bg').innerHTML = code;
        document.getElementById('result').innerHTML = '';
        document.getElementById('syntax-error').innerHTML = 'Syntax error. ' + errorText;
        console.timeEnd("Highlight 🎨");
        console.timeEnd("Total ⏳");
        return;
    }
    let highlightedCode = highlight(code, result);
    console.timeEnd("Highlight 🎨");
    document.getElementById('code-bg').innerHTML = highlightedCode;
    document.getElementById('result').innerHTML = JSON.stringify(result, null, 2);
    document.getElementById('syntax-error').innerHTML = '';
    console.timeEnd("Total ⏳");
};

el.addEventListener('input', update);

el.focus();
update();