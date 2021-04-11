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
line -> statement {% plain %}
      | statement "\n" {% plain %}
statement -> _ method _ link {% d => {return {action: d[1], link: d[3]}} %}
           | _ method _ define _ args _ link {% d => {return {action: d[1], define: {keyword: d[3], variables: d[5]}, link: d[7]}} %}
           | _ method _ define _ escapedString _ escapedString _ {% d => {return {action: "set header", key: d[5][1].join(""), value: d[7][1].join("")}} %}

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
trailingWhitespace -> [\s]:+
link -> protocol url {% d => {return {protocol: d[0], url: d[1]}} %}
      | protocol url trailingWhitespace {% d => {return {protocol: d[0], url: d[1]}} %}

escapedString -> "\"" [^"]:+ "\""