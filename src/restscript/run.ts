interface Header {
  k: string;
  v: string;
}

export function runParsedCode(parsedCode: Token) {
  let h: Array<Header> = [];
  let state: Map<string, string> = new Map<string, string>()
  let runCmd = (token: Token) => {
    switch (token.cmd.action) {
      case "get":
        fetch("//" + token.cmd.link.url)
          .then(r => r.json())
          .then(r => {
            // TODO: read response and save to state
            console.log(r);
            runCmd(token.next);
          });
        return;
      case "post":
        // TODO: post state data encoded as define-keyword from defined variables
        console.log("post", token.cmd.link);
        return;
      case "set header":
        h.push({ k: token.cmd.key, v: token.cmd.value });
    }
    if (token.next !== undefined) {
      runCmd(token.next);
    }
  };
  runCmd(parsedCode);
}