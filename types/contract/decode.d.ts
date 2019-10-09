import SolType from "./_SolType";

declare type ParsedTypes = number | string | boolean;

export default function decode(rawCode: string, types: Array<SolType>): null | ParsedTypes | Array<ParsedTypes>;
