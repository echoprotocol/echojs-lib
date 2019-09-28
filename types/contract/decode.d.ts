declare type ParsedTypes = number | string | boolean;

export default function decode(rawCode: string, types: Array<string>): null | ParsedTypes | Array<ParsedTypes>;
