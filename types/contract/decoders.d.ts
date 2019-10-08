declare type ParsedTypes = number | string | boolean;

export default function decode(rawCode: string, types: string[]): null | ParsedTypes | Array<ParsedTypes>;
