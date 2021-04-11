@builtin "whitespace.ne"

@{%
const plain = d => d[0];
const inner = d => d[1];
const solid = d => d[0].join("");
const flatten = d => d.flat()
%}

main -> _ code _ {% inner %}
code -> line {% d => {return {cmd: d[0]}} %}
      | line code {% d => {return {cmd: d[0], next: d[1]}} %}
line -> _ statement _ "\n" {% inner %}
statement -> method _ link {% d => {return {action: d[0], link: d[2]}} %}
           | method _ define _ args _ link {% d => {return {action: d[0], define: {keyword: d[2], variables: d[4]}, link: d[6]}} %}
           | method _ define _ escapedString _ escapedString {% d => {return {action: "set header", key: d[4][1].join(""), value: d[6][1].join("")}} %}

method -> "get" {% plain %}
        | "post" {% plain %}
        | "set" {% plain %}
define -> "json" {% plain %}
        | "form" {% plain %}
        | "params" {% plain %}
        | "header" {% plain %}
        | "as" {% plain %}
args -> arg {% d => {return {key: d[0][0], from: d[0][1]}} %}
      | arg "," args {% d => {return {key: d[0][0], from: d[0][1], next: d[2]}} %}
      | arg "," _ args {% d => {return {key: d[0][0], from: d[0][1], next: d[3]}} %}
arg -> str
     | str "=" str {% d => [d[0], d[2]] %}
str -> [\w]:+ {% solid %}
protocol -> "http://" {% plain %}
          | "https://" {% plain %}
url -> [\S]:+ {% solid %}
link -> protocol url {% d => {return {protocol: d[0], url: d[1]}} %}

escapedString -> "\"" [^"]:+ "\""