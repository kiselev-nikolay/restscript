import { Parser, Grammar } from 'nearley';
import grammar from './grammar.ne';
import { highlight } from './highlight';
import { runParsedCode } from './run';

const GRAMMAR: Grammar = Grammar.fromCompiled(grammar);

class Parsed {
  result: Token;
  okLast: number;
  code: string;
}

export class RestScriptEditor {
  el: HTMLElement;
  logTime: boolean;
  constructor(el: HTMLElement, logTime?: boolean) {
    this.el = el;
    this.logTime = logTime === true;
    el.addEventListener('input', () => this.update());
    this.update();
  }
  parse(): Parsed {
    let parsed = new Parsed();
    parsed.result = null;
    parsed.okLast = 0;
    parsed.code = this.el.innerText;
    parsed.code += "\n";
    try {
      if (this.logTime) { console.time("Parser 🥽"); }
      let parser: Parser = new Parser(GRAMMAR);
      for (let i = 0; i < parsed.code.length; i++) {
        let state: Array<any> = parser.feed(parsed.code[i]).results;
        if (state[0] !== null || state[0] !== undefined) {
          parsed.okLast = i;
        }
      }
      parsed.result = parser.finish()[0];
    } catch {
      // Syntax error.
    }
    return parsed;
  }
  update() {
    if (this.logTime) { console.time("Total ⏳"); }
    let parsed = this.parse();
    if (this.logTime) { console.timeEnd("Parser 🥽"); }
    if (this.logTime) { console.time("Highlight 🎨"); }
    if (parsed.result === null || parsed.result === undefined) {
      let errorText: string = '<span class="error-text">' + parsed.code.slice(
        1 + parsed.code.lastIndexOf('\n', parsed.okLast),
        parsed.okLast
      ) + '</span>';
      errorText += '<span class="error-text error-position">' + parsed.code.slice(
        parsed.okLast,
        1 + parsed.okLast
      ) + '</span>';
      errorText += '<span class="error-text">' + parsed.code.slice(
        1 + parsed.okLast,
        1 + parsed.code.indexOf('\n', parsed.okLast)
      ) + '</span>';
      if (this.logTime) { console.timeEnd("Highlight 🎨"); }
      document.getElementById('code-bg').innerHTML = parsed.code;
      document.getElementById('result').innerHTML = '';
      document.getElementById('syntax-error').innerHTML = 'Syntax error. ' + errorText;
      if (this.logTime) { console.timeEnd("Total ⏳"); }
      return;
    }
    let highlightedCode = highlight(parsed.code, parsed.result);
    if (this.logTime) { console.timeEnd("Highlight 🎨"); }
    document.getElementById('code-bg').innerHTML = highlightedCode;
    document.getElementById('result').innerHTML = JSON.stringify(parsed.result, null, 2);
    document.getElementById('syntax-error').innerHTML = '';
    if (this.logTime) { console.timeEnd("Total ⏳"); }
    return;
  }
  run() {
    let parsed = this.parse();
    runParsedCode(parsed.result);
  }
}