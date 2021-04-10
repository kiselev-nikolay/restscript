@builtin "whitespace.ne"

@{%
const plain = (d) => d[0];
const inner = (d) => d[1];
const solid = (d) => d[0].join("");
const nullToken = (d) => null
%}

main -> _ code _ {% inner %}
code -> codeLine {% d => {return {cmd: d[0]}} %}
      | codeLine "\n" code {% d => {return {cmd: d[0], next: d[2]}} %}
codeLine -> _ keyword _ link {% d => {return {action: d[1], link: d[3]}} %}
keyword -> "ping" {% plain %}
         | "post" {% plain %}
         | "get" {% plain %}
         | "head" {% plain %}
protocol -> "http://" {% plain %}
          | "https://" {% plain %}
url -> [\S]:+ {% solid %}
trailingWhitespace -> [\s]:+ {% nullToken %}
link -> protocol url {% d => {return {protocol: d[0], url: d[1]}} %}
      | protocol url trailingWhitespace {% d => {return {protocol: d[0], url: d[1]}} %}