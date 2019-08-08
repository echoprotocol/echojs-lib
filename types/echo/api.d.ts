import PublicKey from "../crypto/public-key";

export default class Api {
	getBlock(number: number): Promise<unknown>;
	getFullAccounts(accountNamesOrIds: Array<string>, subscribe?: boolean, force?: boolean): Promise<any>;
	getKeyReferences(keys: Array<string|PublicKey>, force?: boolean): Promise<Array<any>>;
	getObject(objectId: string, force?: boolean): Promise<unknown>;
	getContractResult(resultContractId: string, force: boolean): Promise<Object>;

	callContractNoChangingState(
		contractId: string,
		accountId: string,
		assetId: string,
		bytecode: string,
	): Promise<string>;

	registerAccount(
		name: string,
		activeKey: string,
		echoRandKey: string,
		wasBroadcastedCallback?: () => any,
	): Promise<unknown>;
}
