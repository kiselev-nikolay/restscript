import { Parser, Grammar } from "nearley"
import grammar from "./grammar.ne"


// const data = new URLSearchParams(window.location.search);
// const code: string = data.get("code");
const gram = Grammar.fromCompiled(grammar);

let el = window.document.getElementById("code");
let input = el as HTMLInputElement;

input.oninput = () => {
    const code = input.value;
    let result: string = null;
    try {
        let parser = new Parser(gram);
        result = JSON.stringify(parser.feed(code).results[0]);
    } catch {
        // Syntax error.
    }
    if (result === null || result === undefined) {
        result = "Syntax error."
    }
    document.getElementById("result").textContent = result;
}

input.focus()