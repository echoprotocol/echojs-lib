import PublicKey from "../crypto/public-key";

export default class Api {
	broadcastBlock(block: Object): Primise<any>;
	broadcastTransaction(tr: Object): Promise<any>;
	broadcastTransactionWithCallback(signedTransactionObject: Object, wasBroadcastedCallback: Function): Promise<any>;
	get24Volume(baseAssetName: string, quoteAssetName: string): Promise<any>;
	getAccounts(accountIds: Array<string>, force?: boolean): Promise<Array<Object>>;
	getAccountBalances(accountId: string, assetIds: Array<string>, force?: boolean): Promise<Object>;
	getAccountByName(accountName: string, force?: boolean): Promise<Object>;
	getAccountCount(): Promise<number>;
	getAccountHistory(accountId: string, stop: string, limit: number, start: string): Promise<Array<Object>>;
	getAccountHistoryOperations(accountId: string, operationId: string, start: number, stop: number, limit: number): Promise<Array<Object>>;
	getAccountReferences(accountId: string, force?: boolean): Promise<Object>;
	getAllAssetHolders(): Promise<Array<Object>>;
	getAssetHolders(assetId: string, start: number, limit: number): Promise<Array<Object>>;
	getAssetHoldersCount(assetId: string): Promise<number>;
	getAssets(assetIds: Array<string>, force?: boolean);
	getBalanceObjects(keys: Object): any;
	getBitAssetData(bitAssetId: string, force?: boolean): Promise<Object>;
	getBlock(blockNum: number): Promise<Object>;
	getBlockHeader(blockNum: number): Promise<Object>;
	getBlockVirtualOperations(blockNum: number): any;
	getCallOrders(assetId: string, limit: number): Promise<any>;
	getChainId(force?: boolean): Promise<string>
	getChainProperties(force?: boolean): Promise<Object>;
	getCommitteeMembers(committeeMemberIds: Array<string>, force?: boolean): Promise<Array<Object>>;
	getCommitteeMemberByAccount(accountId: string, force?: boolean): Promise<Array<Object>>;
	getConfig(force?: boolean): Promise<Object>;
	getContract(contractId: string): Promise<Array<any>>;
	getContractBalances(contractId: string, force?)
	getContractHistory(operationId: string, stop: number, limit: number, start: number);
	getContracts(contractIds: Array<string>, force?: boolean): Promise<Array<Object>>;
	getContractLogs(ontractId: string, fromBlock: number, toBlock: number): Promise<Array<Object>>;
	getContractResult(resultContractId: string, force: boolean): Promise<Object>;
	getDynamicAssetData(dynamicAssetDataId: string, force?: boolean): Promise<Object>;
	getDynamicGlobalProperties(force?: boolean): Promise<Object>;
	getFeePool(assetId: string): Promise<any>;
	getFullAccounts(accountNamesOrIds: Array<string>, subscribe?: boolean, force?: boolean): Promise<any>;
	getFullContract(contractId: string, force?: boolean): Promise<Object>;
	getGlobalProperties(force?: boolean): Promise<Object>;
	getKeyReferences(keys: Array<string|PublicKey>, force?: boolean): Promise<Array<any>>;
	getLimitOrders(baseAssetId: string, quoteAssetId: string, limit: number): Promise<any>;
	getMarginPositions(accountId: string): Promise<any>;
	getNamedAccountBalances(accountName: string, assetIds: Array<string>, force?: boolean): Promise<Object>;
	getObject(objectId: string, force?: boolean): Promise<Object>;
	getObjects(objectIds: string, force?: boolean): Promis<Array<Object>>;
	getOrderBook(baseAssetName: string, quoteAssetName: string, depth: number): Promise<any>;
	getPotentialSignatures(tr: Object): Promise<any>;
	getProposedTransactions(accountNameOrId: string): Promise<any>;
	getRecentTransactionById(transactionId: string): Promise<any>;
	getRelativeAccountHistory(accountId: string, stop: number, limit: number, start: number): Promise<Array<Object>>;
	getRequiredFees(operations: Array<Object>, assetId: string): Promise<Array<Object>>;
	getRequiredSignatures(tr: Object, availableKey: Array<string>): Promise<any>;
	getSettleOrders(assetId: string, limit: number): Promise<any>;
	getSidechainTransfers(receiver: string): Promise<Array<Object>>;
	getTicker(baseAssetName: string, quoteAssetName: string): Promise<any>;
	getTradeHistory(baseAssetName: string, quoteAssetName: number, start: number, stop: number, limit: number): Promise<any>;
	getTransaction(blockNum: number, transactionIndex: number): Promise<Object>;
	getTransactionHex(tr: Object): Promise<any>;
	getVestedBalances(balanceIds: Array<string>): Promise<any>;
	getVestingBalances(balanceIds: Array<string>): Promise<any>;
	callContractNoChangingState(contractId: string, accountId: string, assetId: string, bytecode: string): Promise<string>;
	listAssets(lowerBoundSymbol: string, limit: number): Promise<Array<string>>;
	lookupAccounts(lowerBoundName: string, limit: number): Promise<Array<string>>;
	lookupAccountNames(accountNames: Array<string>, force?: boolean): Promise<Array<Object>>;
	lookupAssetSymbols(symbolsOrIds: Array<string>, force?: boolean): Promise<Array<string>>;
	lookupCommitteeMemberAccounts(lowerBoundName: string, limit: number): Promise<any>;
	lookupVoteIds(votes: Array<string>, force?: boolean): Promise<Object>;
	registerAccount(name: string, activeKey: string, echoRandKey: string, wasBroadcastedCallback: Function): Promise<null>
	validateTransaction(tr: Object): Promise<any>;
	verifyAuthority(tr: Object): Promise<any>;
	verifyAccountAuthority(accountNameOrId: Object, signers: Array<string>): Promise<any>;

}
