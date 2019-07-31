import BigNumber from 'bignumber.js';

import PublicKey from "../crypto/public-key";
import { string } from "../../src/serializer/basic-types";
import transaction from "../../src/serializer/transaction-type";
interface Block {
	previous: number,
	timestamp: number,
	transaction_merkle_root: string,
	state_root_hash: string,
	ed_signature: string,
	round: number,
	rand: number,
	cert: string,
	transaction: Array
}
export default class Api {
	broadcastTransaction(tr: Block): Promise<any>;
	broadcastTransactionWithCallback(signedTransactionObject: Object, wasBroadcastedCallback: Function): Promise<any>;
	get24Volume(baseAssetName: string, quoteAssetName: string): Promise<any>;
	getAccounts(accountIds: Array<string>, force?: boolean): Promise<Array<Account>>;
	getAccountBalances(accountId: string, assetIds: Array<string>, force?: boolean): Promise<Object>;
	getAccountByName(accountName: string, force?: boolean): Promise<Account>;
	getAccountCount(): Promise<number>;
	getAccountHistory(accountId: string, stop: string, limit: number, start: string): Promise<Array<Object>>;
	getAccountHistoryOperations(accountId: string, operationId: string, start: number, stop: number, limit: number): Promise<Array<Object>>;
	getAccountReferences(accountId: string, force?: boolean): Promise<Object>;
	getAllAssetHolders(): Promise<Array<{asset_id: string, count: number}>>;
	getAssetHolders(assetId: string, start: number, limit: number): Promise<Array<{name: string, account_id: string, amount: string}>>;
	getAssetHoldersCount(assetId: string): Promise<number>;
	getAssets(assetIds: Array<string>, force?: boolean): Promise<Array<Object>>;
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
	getContracts(contractIds: Array<string>, force?: boolean): Promise<Array<{id: string, statistics: string, suicided: boolean}>>;
	getContractLogs(ontractId: string, fromBlock: number, toBlock: number): Promise<Array<Object>>;
	getContractResult(resultContractId: string, force: boolean): Promise<Object>;
	getDynamicAssetData(dynamicAssetDataId: string, force?: boolean): Promise<Object>;
	getDynamicGlobalProperties(force?: boolean): Promise<Object>;
	getFeePool(assetId: string): Promise<BigNumber>;
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
	getSidechainTransfers(receiver: string): Promise<Array<{transfer_id: number, receiver: string, amount: number, signatures: string, withdraw_code: string}>>;
	getTicker(baseAssetName: string, quoteAssetName: string): Promise<any>;
	getTradeHistory(baseAssetName: string, quoteAssetName: number, start: number, stop: number, limit: number): Promise<any>;
	getTransaction(blockNum: number, transactionIndex: number): Promise<Object>;
	getTransactionHex(tr: Object): Promise<any>;
	getVestedBalances(balanceIds: Array<string>): Promise<any>;
	getVestingBalances(balanceIds: Array<string>): Promise<any>;
	callContractNoChangingState(contractId: string, accountId: string, assetId: string, bytecode: string): Promise<string>;
	listAssets(lowerBoundSymbol: string, limit: number): Promise<Array<Object>>;
	lookupAccounts(lowerBoundName: string, limit: number): Promise<Array<string>>;
	lookupAccountNames(accountNames: Array<string>, force?: boolean): Promise<Array<Account>>;
	lookupAssetSymbols(symbolsOrIds: Array<string>, force?: boolean): Promise<Array<Object>>;
	lookupCommitteeMemberAccounts(lowerBoundName: string, limit: number): Promise<any>;
	lookupVoteIds(votes: Array<string>, force?: boolean): Promise<Object>;
	registerAccount(name: string, activeKey: string, echoRandKey: string, wasBroadcastedCallback: Function): Promise<null>
	validateTransaction(tr: Object): Promise<any>;
	verifyAuthority(tr: Object): Promise<any>;
	verifyAccountAuthority(accountNameOrId: Object, signers: Array<string>): Promise<any>;
}
