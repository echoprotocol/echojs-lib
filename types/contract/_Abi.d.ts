import SolType from "./_SolType";

export { SolType };

export type AbiStateMutability = 'view' | 'nonpayable' | 'payable' | 'pure';

export type AbiMethodType = 'constructor' | 'function' | 'event' | 'fallback';

export interface AbiArgument {
	name: string;
	type: SolType;
}

export interface AbiMethod {
	constant: boolean;
	inputs: Array<AbiArgument>;
	name: string;
	outputs: Array<AbiArgument>;
	payable: boolean;
	stateMutability: AbiStateMutability;
	type: AbiMethodType;
}

export type Abi = Array<AbiMethod>;
