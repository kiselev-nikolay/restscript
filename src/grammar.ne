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
protocol -> "http://" {% ()=>false %}
          | "https://" {% ()=>true %}
uri -> [\S]:+ {% solid %}
trailingWhitespace -> [\s]:+ {% nullToken %}
link -> protocol uri {% d => {return {secure: d[0], uri: d[1]}} %}
      | protocol uri trailingWhitespace {% d => {return {secure: d[0], uri: d[1]}} %}