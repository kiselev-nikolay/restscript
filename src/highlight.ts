export function highlight(code: string, result: Token) : string {
    let highlightedCode: string = ''
    let b = (x: string, tagClass: string, start: number) => {
        let tokenStart: number = code.indexOf(x, start)
        let tokenEnd: number = start + x.length
        let pre: string = code.slice(start, tokenStart)
        highlightedCode = highlightedCode
            + pre
            + '<span class="' + tagClass + '">'
            + x
            + '</span>'
        return tokenEnd + pre.length
    }
    let d = (variable: VariableTransform, start: number) => {
        start = b(variable.key, 'chy', start)
        if (variable.from !== undefined) {
            start = b(variable.from, 'chy', start)
        }
        if (variable.next !== undefined) {
            start = d(variable.next, start)
        }
        return start
    }
    let c = (token: Token, start: number) => {
        start = b(token.cmd.action, 'chr', start)
        if (token.cmd.key !== undefined) {
            start = b(`"${token.cmd.key}"`, 'chg', start)
            start = b(`"${token.cmd.value}"`, 'chg', start)
        } else {
            if (token.cmd.define !== undefined) {
                start = b(token.cmd.define.keyword, 'chr', start)
                start = d(token.cmd.define.variables, start)
            }
            start = b(token.cmd.link.protocol, 'chb', start)
            start = b(token.cmd.link.url, 'chp', start)
        }
        if (token.next !== undefined) {
            c(token.next, start)
        }
    }
    c(result, 0)
    return highlightedCode
}