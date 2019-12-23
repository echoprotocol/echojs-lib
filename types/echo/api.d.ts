import BigNumber from 'bignumber.js';

import PublicKey from "../crypto/public-key";

import AccountAddress from '../interfaces/AccountAddress';
import AccountEthAddress from '../interfaces/AccountEthAddress';
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
import { OperationHistoryObject } from '../interfaces/chain';
import { PotentialPeerRecord } from '../interfaces/net/peer-database';
import RegistrationTask from '../interfaces/RegistrationTask';
import PeerDetails from '../interfaces/PeerDetails';
import { Log } from '../interfaces/vm/types';
import { asset } from '../serializers/chain';
import { signedTransaction } from '../serializers';
import { StringSerializer } from '../serializers/basic';
import { uint32, uint64, int32 } from '../serializers/basic/integers';
import { committeeMemberId, contractId } from '../serializers/chain/id/protocol';
import { VectorSerializer, SetSerializer } from '../serializers/collections';

type SidechainType = "" | "eth" | "btc";

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
	getAccountByAddress(address: string): Promise<string>;
	getAccountCount(): Promise<number>;
	getAccountDeposits(account: string, type: SidechainType): Promise<unknown>;
	getAccountHistory(accountId: string, stop: string, limit: number, start: string): Promise<Array<AccountHistory>>;

	getAccountHistoryOperations(
		accountId: string,
		operationId: string,
		start: number,
		stop: number,
		limit: number,
	): Promise<AccountHistory[]>;

	getAccountReferences(accountId: string, force?: boolean): Promise<Account>;
	getAccountWithdrawals(account: string, type: SidechainType): Promise<unknown>;
	getAllAssetHolders(): Promise<Array<{asset_id: string, count: number}>>;

	getAssetHolders(assetId: string, start: number, limit: number): Promise<Array<{
		name: string,
		account_id: string,
		amount: string,
	}>>;

	getAssetHoldersCount(assetId: string): Promise<number>;
	getAssets(assetIds: Array<string>, force?: boolean): Promise<Array<Asset>>;
	getBalanceObjects(keys: Object): any;
	getBitAssetData(bitAssetId: string, force?: boolean): Promise<Object>;
	getBlock(blockNum: number): Promise<Block>;
	getBlockHeader(blockNum: number): Promise<BlockHeader>;
	getBlockVirtualOperations(blockNum: number): any;
	getBtcAddress(accountId: string): Promise<Array<BtcAddress>>;
	getAccountAddresses(accountId: string, from: number, limit: number): Promise<Array<AccountAddress>>;
	getEthAddress(accountId: string): Promise<AccountEthAddress>;
	getBtcDepositScript(btcDepositId: string): Promise<String>;
	getChainId(force?: boolean): Promise<string>
	getChainProperties(force?: boolean): Promise<ChainProperties>;
	getCommitteeFrozenBalance(committeeMemberId: string): Promise<Object>;
	getCommitteeMembers(committeeMemberIds: Array<string>, force?: boolean): Promise<Array<Committee>>;
	getCommitteeMemberByAccount(accountId: string, force?: boolean): Promise<Committee>;
	getConfig(force?: boolean): Promise<Config>;
	getContract(contractId: string): Promise<Array<any>>;
	getContractBalances(contractId: string, force?: boolean): Promise<unknown>;
	getContractPoolWhitelist(contractId: string): Promise<unknown>;

	getContractHistory(
		operationId: string,
		stop: number,
		limit: number,
		start: number,
	): Promise<ContractHistory[]>;

	/**
	 * Get operations relevant to the specified contract referenced by an event numbering specific to the contract.
	 * The current number of operations for the contract can be found in the contract statistics (or use 0 for start).
	 * @param contract the contract whose history should be queried
	 * @param options.stop
	 * Sequence number of earliest operation. 0 is default and will query `limit` number of operations.
	 * @param options.limit Maximum number of operations to retrive (must not exceed 100)
	 * @param options.start Sequence number of the most recent operation to retrive.
	 * 0 is default, which will start querying from the most recent operation.
	 * @returns A list of operations performed by contract, ordered from most recent to oldest
	 */
	getRelativeContractHistory(contract: typeof contractId["__TInput__"], options?: {
		stop?: typeof uint64["__TInput__"],
		limit?: typeof uint64["__TInput__"],
		start?: typeof uint64["__TInput__"],
	}): Promise<OperationHistoryObject[]>;

	getContracts(contractIds: Array<string>, force?: boolean): Promise<Array<{
		id: string,
		statistics: string,
		suicided: boolean,
	}>>;

	/**
	 * Get logs of specified contract logs filter options
	 * @param contracts IDs of the contract
	 * @param topics Filters by certain events if any provided
	 * @param blocks Contract logs filter options
	 * @param blocks.from Number of block to start retrive from
	 * @param blocks.to Number of block to end to retrive
	 * @returns The contracts logs from specified blocks interval
	 */
	getContractLogs(
		contracts: SetSerializer<typeof contractId>["__TInput__"],
		topics: VectorSerializer<SetSerializer<StringSerializer>>["__TInput__"],
		blocks?: { from?: typeof int32["__TInput__"], to?: typeof int32["__TInput__"] },
	): Promise<Log[]>;

	getContractLogs1(opts: {
		contracts?: string[],
		topics?: Array<null | string | Buffer | Array<string | Buffer>>,
		fromBlock?: number | BigNumber,
		toBlock?: number | BigNumber,
	}): Promise<unknown[]>;

	getContractPoolBalance(resultContractId: string, force?: boolean): Promise<{asset_id: string, amount: number}>;
	getContractResult(resultContractId: string, force?: boolean): Promise<ContractResult>;
	getDynamicAssetData(dynamicAssetDataId: string, force?: boolean): Promise<Object>;
	getDynamicGlobalProperties(force?: boolean): Promise<DynamicGlobalProperties>;
	getFeePool(assetId: string): Promise<BigNumber>;
	getFrozenBalances(accountId: string): Promise<Array<FrozenBalance>>;

	getFullAccounts(
		accountNamesOrIds: string[],
		subscribe?: boolean,
		force?: boolean,
	): Promise<FullAccount[]>;

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
	getRelativeAccountHistory(accountId: string, stop: number, limit: number, start: number): Promise<AccountHistory[]>;
	getRequiredFees(operations: Array<Object>, assetId: string): Promise<Array<{asset_id: string, amount: number}>>;
	getRequiredSignatures(tr: Object, availableKey: Array<string>): Promise<any>;
	getTicker(baseAssetName: string, quoteAssetName: string): Promise<any>;

	getTradeHistory(
		baseAssetName: string,
		quoteAssetName: number,
		start: number,
		stop: number,
		limit: number,
	): Promise<unknown>;

	getTransaction(blockNum: number, transactionIndex: number): Promise<TransactionObject>;
	getTransactionHex(tr: Object): Promise<any>;
	getVestedBalances(balanceIds: Array<string>): Promise<any>;
	getVestingBalances(balanceIds: Array<string>): Promise<any>;

	callContractNoChangingState(
		contractId: string,
		caller: string,
		asset: { asset_id: string, amount: number | string },
		code: string,
	): Promise<string>;

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

	getConnectedPeers(): Promise<Array<{ version: number, host: string, info: PeerDetails }>>;
	getPotentialPeers(): Promise<PotentialPeerRecord[]>;

}
