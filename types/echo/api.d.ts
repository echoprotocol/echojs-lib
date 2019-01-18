import PublicKey from "../crypto/public-key";
import { OBJECTS_TYPES } from "../constants";

type OBJECT = {
	[OBJECTS_TYPES.DEPLOY_RESULT]: {
		id: string,
		contracts_id: Array<string>,
	}
}

export default class Api {
	getFullAccounts(accountNamesOrIds: Array<string>, subscribe: boolean = true, force: boolean = false): Promise<any>;
	getKeyReferences(keys: Array<string|PublicKey>, force: boolean = false): Promise<Array<any>>;
	getObject<T extends OBJECTS_TYPES>(objectId: string, force: boolean = false): Promise<OBJECT[T]>;
	callContractNoChangingState(contractId: string, accountId: string, assetId: string, bytecode: string): Promise<string>;
}
