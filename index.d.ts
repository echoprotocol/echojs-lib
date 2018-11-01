
declare module 'echojs-lib' {

	export class PublicKey {
		toString(): string;
	}

	export class PrivateKey {
		toPublicKey(): PublicKey;
		static fromWif(wif: string): PrivateKey;
	}

	export interface ChainStore_interface {
		FetchChain(method: string, arg: any): Promise<{ toJS(): [any] }>;
		FetchChain(method: 'getAccountRefsOfKey', arg: string): Promise<{ toJS(): [string] }>;
		FetchChain(method: 'getAsset', arg: '2.1.0'): Promise<{ toJS(): { head_block_number: number } }>
		init(): Promise<void>;
	}
	export const ChainStore: ChainStore_interface;

	export class ContractFrame {
		deployContract(params: { accountId: string, gas: number, bytecode: string }, privateKey: PrivateKey): Promise<[{
			trx: {
				operation_results: [[any, string]],
			},
		}]>;
	}

	export class TransactionBuilder {

		add_type_operation(name: 'contract' | 'transfer', opts: {
			registrar: string,
			receiver: string,
			asset_id: string,
			value: number,
			gasPrice: number,
			gas: number,
			code: string,
		}): void;

		set_required_fees(assetId: string): Promise<void>;

		add_signer(privateKey: PrivateKey): void;

		broadcast(): Promise<[{
			trx: {
				operation_results: [[any, string]]
			}
		}]>;

	}

}
