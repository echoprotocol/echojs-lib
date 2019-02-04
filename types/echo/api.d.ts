import GetFullAccountInfoResult from "./_GetFullAccountInfoResult";
import { RESERVED_SPACE, PROTOCOL_OBJECT, IMPLEMENTATION_OBJECT } from "../constants/chain-types";
import { OBJECT_TYPE, OBJECT } from "./_objects";

interface ContractResult {
	exec_res: {
		excepted: string, // FIXME: enum
		new_address: string,
		output: string,
		code_deposit: string, // FIXME: enum
		gas_refunded: number,
		gas_for_deposit: number,
		deposit_size: number,
	},
	tr_receipt: {
		status_code: number,
		gas_used: number,
		bloom: string,
		log: Array<any>, // FIXME: type
	},
}

export default class Api {

	getFullAccounts(
		accountNamesOrIds: Array<string>,
		subscribe?: boolean,
		force?: boolean,
	): Promise<GetFullAccountInfoResult>;

	getObject<
		TReservedSpace extends RESERVED_SPACE,
		TObjectType extends OBJECT_TYPE[TReservedSpace],
	>(objectId: string, force?: boolean): Promise<OBJECT[TReservedSpace][TObjectType]>;

	getObject(
		objectId: '2.1.0',
		force?: boolean,
	): Promise<OBJECT[RESERVED_SPACE.IMPLEMENTATION][IMPLEMENTATION_OBJECT.DYNAMIC_GLOBAL_PROPERTY]>;

	getChainProperties(force?: boolean): Promise<{
		id: string,
		chain_id: string,
		immutable_parameters: {
			min_committee_member_count: number,
			min_witness_count: number,
			num_special_accounts: number,
			num_special_assets: number
		}
	}>;

	callContractNoChangingState(
		contractId: string,
		accountId: string,
		assetId: string,
		bytecode: string,
	): Promise<string>;

	getKeyReferences(keys: Array<string | PublicKey>, force?: boolean): Promise<Array<Array<string>>>;
	getAccountBalances(accountId: string, assetsIds: Array<string>, force?: boolean): Promise<any>;
	getContractResult(resultId: string, force?: boolean): Promise<[0, ContractResult]>;

	getContractBalances(contractId: string, force?: boolean): Promise<Array<{
		amount: number | string,
		asset_id: string,
	}>>;

	registerAccount(
		name: string,
		ownerKey: string,
		activeKey: string,
		memoKey: string,
		echoRandKey: string,
	): Promise<any>;

}
