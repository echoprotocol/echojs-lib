
declare module 'echojs-lib' {

	export { Apis } from 'echojs-ws';

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
        resetCache(): void;
        unsubscribe(callback: () => any): any;
	}

	export const ChainStore: ChainStore_interface;

    export interface ChainValidation_interface {
        is_object_id(key: any): boolean;
    }

	export const ChainValidation: ChainValidation_interface;

	export class ContractFrame {
		deployContract(params: { accountId: string, bytecode: string }, privateKey: PrivateKey): Promise<[{
			trx: {
				operation_results: [[any, string]],
			},
		}]>;
	}

	export class TransactionBuilder {

		add_type_operation(name: 'create_contract' | 'call_contract' | 'transfer', opts: {
			registrar?: string,
			receiver?: string,
			asset_id?: string,
			value?: { amount: number | string, asset_id: string },
			code?: string,
			callee?: string,
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
