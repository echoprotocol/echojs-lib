import BigNumber from 'bignumber.js';

import PublicKey from "../crypto/public-key";

import AccountAddress from '../interfaces/AccountAddress';
import AccountEthAddress from '../interfaces/AccountEthAddress';
import BlockHeader from '../interfaces/BlockHeader';
import TransactionObject from '../interfaces/TransactionObject';
import Block from '../interfaces/Block';
import Committee from '../interfaces/Committee';
import ContractLogs from '../interfaces/ContractLogs';
import AccountHistory from '../interfaces/AccountHistory';
import FullAccount from '../interfaces/FullAccount';
import ChainProperties from '../interfaces/ChainProperties';
import GlobalProperties from '../interfaces/GlobalProperties';
import Config from '../interfaces/Config';
import DynamicGlobalProperties from '../interfaces/DynamicGlobalProperties';
import ContractHistory from '../interfaces/ContractHistory';
import ContractResult from '../interfaces/ContractResult';
import FrozenBalance from '../interfaces/FrozenBalance';
import BtcAddress from '../interfaces/BtcAddress';
import { OperationHistoryObject } from '../interfaces/chain';
import { PotentialPeerRecord } from '../interfaces/net/peer-database';

import {
	IObject,
	IAssetObject,
	IAccountObject,
	ERC20DepositTokenObject,
	ERC20WithdrawTokenObject,
} from '../interfaces/objects';

import RegistrationTask from '../interfaces/RegistrationTask';
import PeerDetails from '../interfaces/PeerDetails';
import { Log } from '../interfaces/vm/types';
import { asset } from '../serializers/chain';
import { signedTransaction } from '../serializers';
import { StringSerializer } from '../serializers/basic';
import { uint32, uint64, int32 } from '../serializers/basic/integers';
import { committeeMemberId, contractId } from '../serializers/chain/id/protocol';
import { VectorSerializer, SetSerializer } from '../serializers/collections';
import { Contract } from '../interfaces/Contract';

type SidechainType = "" | "eth" | "btc";

interface ContractLogsFilterOptions {
	/** IDs of the contract */
	contracts?: SetSerializer<typeof contractId>["__TInput__"],
	/** Filters by certain events if any provided */
	topics?: VectorSerializer<SetSerializer<StringSerializer>>["__TInput__"],
	/** Number of block to start retrieve from */
	fromBlock?: typeof int32["__TInput__"],
	/** Number of block to end to retrieve */
	toBlock?: typeof int32["__TInput__"],
}

export default class Api {
	broadcastTransaction(tr: object): Promise<any>;
	broadcastTransactionWithCallback(signedTransactionObject: object, wasBroadcastedCallback?: () => any): Promise<any>;
	checkERC20Token(contractId: string): Promise<boolean>;
	get24Volume(baseAssetName: string, quoteAssetName: string): Promise<any>;
	getAccounts(accountIds: Array<string>, force?: boolean): Promise<IAccountObject[]>;

	getAccountBalances(
		accountId: string,
		assetIds: Array<string>,
		force?: boolean,
	): Promise<VectorSerializer<typeof asset>['__TOutput__']>;

	getAccountByName(accountName: string, force?: boolean): Promise<IAccountObject>;
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

	getAccountReferences(accountId: string, force?: boolean): Promise<IAccountObject>;
	getAccountWithdrawals(account: string, type: SidechainType): Promise<unknown>;
	getAllAssetHolders(): Promise<Array<{asset_id: string, count: number}>>;

	getAssetHolders(assetId: string, start: number, limit: number): Promise<Array<{
		name: string,
		account_id: string,
		amount: string,
	}>>;

	getAssetHoldersCount(assetId: string): Promise<number>;
	getAssets(assetIds: Array<string>, force?: boolean): Promise<Array<IAssetObject>>;
	getBalanceObjects(keys: Object): any;
	getBitAssetData(bitAssetId: string, force?: boolean): Promise<Object>;
	getBlock(blockNum: number): Promise<Block>;
	getBlockHeader(blockNum: number): Promise<BlockHeader>;
	getBlockVirtualOperations(blockNum: number): any;

	/**
	 * Returns all deposits, for the given account id
	 * @param account the id of the account to provide information about
	 * @returns the all public erc20 deposits data stored in the blockchain
	 */
	getErc20AccountDeposits(account: string): Promise<ERC20DepositTokenObject[]>;

	/**
	 * Returns all withdrawals, for the given account id
	 * @param account the id of the account to provide information about
	 * @returns the all public erc20 deposits data stored in the blockchain
	 */
	getERC20AccountWithdrawals(account: string): Promise<ERC20WithdrawTokenObject[]>;

	getBtcAddress(accountId: string): Promise<Array<BtcAddress>>;
	getAccountAddresses(accountId: string, from: number, limit: number): Promise<Array<AccountAddress>>;
	getEthAddress(accountId: string): Promise<AccountEthAddress>;
	getBtcDepositScript(btcDepositId: string): Promise<string>;
	getChainId(force?: boolean): Promise<string>
	getChainProperties(force?: boolean): Promise<ChainProperties>;
	getCommitteeFrozenBalance(committeeMemberId: string): Promise<object>;
	getCommitteeMembers(committeeMemberIds: Array<string>, force?: boolean): Promise<Array<Committee>>;
	getCommitteeMemberByAccount(accountId: string, force?: boolean): Promise<Committee>;
	getConfig(force?: boolean): Promise<Config>;
	getContract(contractId: string): Promise<Contract | null>;
	getContractBalances(contractId: string, force?: boolean): Promise<unknown>;
	getContractPoolWhitelist(contractId: string): Promise<unknown>;
	getDidObject(id: string): Promise<unknown>;
	getKey(idString: string): Promise<unknown>;
	getKeys(idString: string): Promise<unknown>;

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
	 * @param opts Contract logs filter options (see {@link ContractLogsFilterOptions})
	 * @returns The contracts logs from specified blocks interval
	 */
	getContractLogs(opts?: ContractLogsFilterOptions): Promise<Log[]>;
	getContractPoolBalance(resultContractId: string, force?: boolean): Promise<{asset_id: string, amount: number}>;
	getContractResult(resultContractId: string, force?: boolean): Promise<ContractResult>;
	getDynamicAssetData(dynamicAssetDataId: string, force?: boolean): Promise<object>;
	getDynamicGlobalProperties(force?: boolean): Promise<DynamicGlobalProperties>;

	/** Retrieve the current info about git revision of the project */
	getGitRevision(): Promise<{ [key: string]: unknown }>;

	/** Retrieve the incentives info */
	getIncentivesInfo(blockStart: number, blockEnd: number): Promise<{ [key: string]: unknown }>;
	getCurrentIncentivesInfo(): Promise<{ [key: string]: unknown }>;

	getAccountAddressByLabel(accountNameOrId: string, label: string): Promise<{ [key: string]: unknown }>;
	getAccountAddressHistory(address: string, options?: {
		stop?: string,
		limit?: typeof uint64["__TInput__"],
		start?: string,
	}): Promise<{ [key: string]: unknown }>;
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
	getObject<T extends IObject = IObject>(objectId: string, force?: boolean): Promise<T>;
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
	getTransactionHex(tr: object): Promise<any>;
	getVestedBalances(balanceIds: Array<string>): Promise<any>;
	getVestingBalances(balanceIds: Array<string>): Promise<any>;

	callContractNoChangingState(
		contractId: string,
		caller: string,
		asset: { asset_id: string, amount: number | string },
		code: string,
	): Promise<string>;

	listAssets(lowerBoundSymbol: string, limit: number): Promise<IAssetObject[]>;
	lookupAccounts(lowerBoundName: string, limit: number): Promise<Array<string>>;
	lookupAccountNames(accountNames: Array<string>, force?: boolean): Promise<IAccountObject[]>;
	lookupAssetSymbols(symbolsOrIds: Array<string>, force?: boolean): Promise<IAssetObject[]>;
	lookupCommitteeMemberAccounts(lowerBoundName: string, limit: number): Promise<any>;

	registerAccount(
		name: string,
		activeKey: string,
		echoRandKey: string,
		evmAddress: string,
		wasBroadcastedCallback?: () => any,
	): Promise<[{ block_num: number, tx_id: string }]>;

	requestRegistrationTask(): Promise<RegistrationTask>

	/**
	 * @param cb
	 * @param options Contract logs filter options (see `ContractLogsFilterOptions` method)
	 * @returns Callback id which should be referenced in `unsubscribeContractLogs`
	 */
	subscribeContractLogs(cb: (result: Log[]) => any, options?: ContractLogsFilterOptions): Promise<number|string>;

	/**
	 * Unsubscribe from contract log subscription
	 * @param subscribeId Subscribe id (returns by `subscribeContractLogs`)
	 */
	unsubscribeContractLogs(subscribeId: typeof uint64["__TInput__"]): Promise<void>;

	validateTransaction(tr: Object): Promise<any>;
	verifyAuthority(tr: Object): Promise<any>;
	verifyAccountAuthority(accountNameOrId: Object, signers: Array<string>): Promise<any>;

	getConnectedPeers(): Promise<Array<{ version: number, host: string, info: PeerDetails }>>;
	getPotentialPeers(): Promise<PotentialPeerRecord[]>;

}
