import SolType from "./_SolType";

interface IInput {
	value: any;
	type: SolType;
}

export default function encode(input: IInput | Array<IInput>): string;
