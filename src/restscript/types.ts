interface Link {
  protocol: string;
  url: string;
}

interface VariableTransform {
  key: string;
  from: string;
  next: VariableTransform;
}

interface Definition {
  keyword: string;
  variables: VariableTransform;
}

interface Command {
  action: string;
  link: Link;
  define: Definition;

  key: string;
  value: string;
}

interface Token {
  cmd: Command;
  next: Token;
}