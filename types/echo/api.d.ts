import BigNumber from 'bignumber.js';

import PublicKey from "../crypto/public-key";

import BlockHeader from '../interfaces/BlockHeader';
import TransactionObject from '../interfaces/TransactionObject';
import Block from '../interfaces/Block';
import Committee from '../interfaces/Committee';
import Vote from '../interfaces/Vote';
import CommitteeFrozenBalance from '../interfaces/CommitteeFrozenBalance'
import ContractLogs from '../interfaces/ContractLogs';
import AccountHistory from '../interfaces/AccountHistory';
import FullAccount from '../interfaces/FullAccount';
import ChainProperties from '../interfaces/ChainProperties';
import GlobalProperties from '../interfaces/GlobalProperties';
import Config from '../interfaces/Config';
import DynamicGlobalProperties from '../interfaces/DynamicGlobalProperties';
import Asset from '../interfaces/Asset';
import ContractHistory from '../interfaces/ContractHistory';
import ContractResult from '../interfaces/ContractResult';
import FrozenBalance from '../interfaces/FrozenBalance';
import BtcAddress from '../interfaces/BtcAddress';
import RegistrationTask from '../interfaces/RegistrationTask';
import { asset } from '../serializers/chain';
import { VectorSerializer } from '../serializers/collections';
import { signedTransaction } from '../serializers';
import { committeeMemberId } from '../serializers/chain/id/protocol';

export default class Api {
	broadcastTransaction(tr: Object): Promise<any>;
	broadcastTransactionWithCallback(signedTransactionObject: Object, wasBroadcastedCallback?: () => any): Promise<any>;
	checkERC20Token(contractId: string): Promise<boolean>;
	get24Volume(baseAssetName: string, quoteAssetName: string): Promise<any>;
	getAccounts(accountIds: Array<string>, force?: boolean): Promise<Array<Account>>;

	getAccountBalances(
		accountId: string,
		assetIds: Array<string>,
		force?: boolean,
	): Promise<VectorSerializer<typeof asset>['__TOutput__']>;

	getAccountByName(accountName: string, force?: boolean): Promise<Account>;
	getAccountCount(): Promise<number>;
	getAccountHistory(accountId: string, stop: string, limit: number, start: string): Promise<Array<AccountHistory>>;
	getAccountHistoryOperations(accountId: string, operationId: string, start: number, stop: number, limit: number): Promise<Array<AccountHistory>>;
	getAccountReferences(accountId: string, force?: boolean): Promise<Account>;
	getAllAssetHolders(): Promise<Array<{asset_id: string, count: number}>>;
	getAssetHolders(assetId: string, start: number, limit: number): Promise<Array<{name: string, account_id: string, amount: string}>>;
	getAssetHoldersCount(assetId: string): Promise<number>;
	getAssets(assetIds: Array<string>, force?: boolean): Promise<Array<Asset>>;
	getBalanceObjects(keys: Object): any;
	getBitAssetData(bitAssetId: string, force?: boolean): Promise<Object>;
	getBlock(blockNum: number): Promise<Block>;
	getBlockHeader(blockNum: number): Promise<BlockHeader>;
	getBlockVirtualOperations(blockNum: number): any;
	getBtcAddresses(accountId: string): Promise<Array<BtcAddress>>;
	getBtcDepositScript(btcDepositId: string): Promise<String>;
	getChainId(force?: boolean): Promise<string>
	getChainProperties(force?: boolean): Promise<ChainProperties>;
	getCommitteeFrozenBalance(committeeMemberId: string): Promise<Object>;
	getCommitteeMembers(committeeMemberIds: Array<string>, force?: boolean): Promise<Array<Committee>>;
	getCommitteeMemberByAccount(accountId: string, force?: boolean): Promise<Committee>;
	getConfig(force?: boolean): Promise<Config>;
	getContract(contractId: string): Promise<Array<any>>;
	getContractBalances(contractId: string, force?: boolean): Promise<unknown>;
	getContractHistory(operationId: string, stop: number, limit: number, start: number): Promise<Array<ContractHistory>>;
	getContracts(contractIds: Array<string>, force?: boolean): Promise<Array<{id: string, statistics: string, suicided: boolean}>>;
	getContractLogs(ontractId: string, topics: Array<string>, fromBlock: number, toBlock: number): Promise<Array<ContractLogs>>;

	getContractLogs2(opts: {
		contracts?: string[],
		topics?: Array<null | string | Buffer | Array<string | Buffer>>,
		from_block?: number | BigNumber,
		to_block?: number | BigNumber,
	}): Promise<unknown[]>;

	getContractResult(resultContractId: string, force?: boolean): Promise<ContractResult>;
	getDynamicAssetData(dynamicAssetDataId: string, force?: boolean): Promise<Object>;
	getDynamicGlobalProperties(force?: boolean): Promise<DynamicGlobalProperties>;
	getFeePool(assetId: string): Promise<BigNumber>;
	getFrozenBalances(accountId: string): Promise<Array<FrozenBalance>>;
	getFullAccounts(accountNamesOrIds: Array<string>, subscribe?: boolean, force?: boolean): Promise<Array<FullAccount>>;
	getFullContract(contractId: string, force?: boolean): Promise<Object>;
	getGlobalProperties(force?: boolean): Promise<GlobalProperties>;
	getKeyReferences(keys: Array<string | PublicKey>, force?: boolean): Promise<string[][]>;
	getMarginPositions(accountId: string): Promise<any>;
	getNamedAccountBalances(accountName: string, assetIds: Array<string>, force?: boolean): Promise<Object>;
	getObject(objectId: string, force?: boolean): Promise<Object>;
	getObjects(objectIds: string, force?: boolean): Promise<Array<Object>>;
	getPotentialSignatures(tr: Object): Promise<any>;
	getProposedTransactions(accountNameOrId: string): Promise<any>;
	getRecentTransactionById(transactionId: string): Promise<any>;
	getRelativeAccountHistory(accountId: string, stop: number, limit: number, start: number): Promise<Array<AccountHistory>>;
	getRequiredFees(operations: Array<Object>, assetId: string): Promise<Array<{asset_id: string, amount: number}>>;
	getRequiredSignatures(tr: Object, availableKey: Array<string>): Promise<any>;
	getTicker(baseAssetName: string, quoteAssetName: string): Promise<any>;
	getTradeHistory(baseAssetName: string, quoteAssetName: number, start: number, stop: number, limit: number): Promise<any>;
	getTransaction(blockNum: number, transactionIndex: number): Promise<TransactionObject>;
	getTransactionHex(tr: Object): Promise<any>;
	getVestedBalances(balanceIds: Array<string>): Promise<any>;
	getVestingBalances(balanceIds: Array<string>): Promise<any>;
	callContractNoChangingState(contractId: string, accountId: string, assetId: string, bytecode: string): Promise<string>;
	listAssets(lowerBoundSymbol: string, limit: number): Promise<Array<Asset>>;
	lookupAccounts(lowerBoundName: string, limit: number): Promise<Array<string>>;
	lookupAccountNames(accountNames: Array<string>, force?: boolean): Promise<Array<Account>>;
	lookupAssetSymbols(symbolsOrIds: Array<string>, force?: boolean): Promise<Array<Asset>>;
	lookupCommitteeMemberAccounts(lowerBoundName: string, limit: number): Promise<any>;

	registerAccount(
		name: string,
		activeKey: string,
		echoRandKey: string,
		wasBroadcastedCallback?: () => any,
	): Promise<[{ block_num: number, tx_id: string }]>;

	requestRegistrationTask(): Promise<RegistrationTask>
	validateTransaction(tr: Object): Promise<any>;
	verifyAuthority(tr: Object): Promise<any>;
	verifyAccountAuthority(accountNameOrId: Object, signers: Array<string>): Promise<any>;
}
