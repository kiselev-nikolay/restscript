import { Parser, Grammar } from "nearley"
import grammar from "./grammar.ne"


const data = new URLSearchParams(window.location.search)
const code: string = data.get("code")

const parser = new Parser(Grammar.fromCompiled(grammar))
let result = JSON.stringify(parser.feed(code).results[0])

document.getElementById("result").textContent = result
