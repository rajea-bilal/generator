declare module 'fast-xml-parser' {
  export class XMLParser { constructor(opts?: any); parse(input: string): any }
  export class XMLBuilder { constructor(opts?: any); build(input: any): string }
}

declare module 'svgo' {
  export function optimize(svg: string, opts?: any): { data: string; error?: string };
}

