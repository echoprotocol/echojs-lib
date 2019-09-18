export type AbiStateMutability = 'view' | 'nonpayable' | 'payable' | 'pure';

export type AbiMethodType = 'constructor' | 'function' | 'event' | 'fallback';

export interface AbiArgument {
	name: string;
	type: string;
}

export interface AbiMethod {
	constant: boolean;
	inputs: AbiArgument[];
	name: string;
	outputs: AbiArgument[];
	payable: boolean;
	stateMutability: AbiStateMutability;
	type: AbiMethodType;
}

export type Abi = AbiMethod[];
