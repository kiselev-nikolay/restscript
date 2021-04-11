import { RestScriptEditor } from './restscript/editor';

let codeEl = window.document.getElementById('code');
let rse = new RestScriptEditor(codeEl);

eval("window.RunRseCode = () => rse.run()");