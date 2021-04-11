export function highlight(code: string, result: Token): string {
  let coloredCoded: string = '';
  let insertColoredToken = (x: string, tagClass: string, start: number) => {
    let tokenStart: number = code.indexOf(x, start);
    let tokenEnd: number = start + x.length;
    let pre: string = code.slice(start, tokenStart);
    coloredCoded = coloredCoded
      + pre
      + '<span class="' + tagClass + '">'
      + x
      + '</span>';
    return tokenEnd + pre.length;
  };
  let insertColoredArg = (variable: VariableTransform, start: number) => {
    start = insertColoredToken(variable.key, 'chy', start);
    if (variable.from !== undefined) {
      start = insertColoredToken(variable.from, 'chy', start);
    }
    if (variable.next !== undefined) {
      start = insertColoredArg(variable.next, start);
    }
    return start;
  };
  let colorCode = (token: Token, start: number) => {
    start = insertColoredToken(token.cmd.action, 'chr', start);
    if (token.cmd.key !== undefined) {
      start = insertColoredToken(`"${token.cmd.key}"`, 'chg', start);
      start = insertColoredToken(`"${token.cmd.value}"`, 'chg', start);
    } else {
      if (token.cmd.define !== undefined) {
        start = insertColoredToken(token.cmd.define.keyword, 'chr', start);
        start = insertColoredArg(token.cmd.define.variables, start);
      }
      start = insertColoredToken(token.cmd.link.protocol, 'chb', start);
      start = insertColoredToken(token.cmd.link.url, 'chp', start);
    }
    if (token.next !== undefined) {
      colorCode(token.next, start);
    }
  };
  colorCode(result, 0);
  console.log(JSON.stringify(result))
  return coloredCoded;
}