import BigNumber from 'bignumber.js';

import PublicKey from "../crypto/public-key";
import { string } from "../../src/serializer/basic-types";
import transaction from "../../src/serializer/transaction-type";
interface Transaction {
	ref_block_num: number,
    ref_block_prefix: number,
    expiration: string,
    operations: Array.<any>,
    extensions: Array<any>,
    signatures: Array.<string>,
    operation_results: Array<Array<any>>;
}

interface BlockHeader {
    previous: string,
    timestamp: string,
    account: string,
    transaction_merkle_root: string,
    state_root_hash: string,
    result_root_hash: string,
    extensions: Array<any>
}

interface Block {
    previous: string,
    timestamp: string,
    account: string,
    transaction_merkle_root: string,
    state_root_hash: string,
    result_root_hash:string ,
    extensions: array,
    ed_signature: string,
    round: number,
    rand: string,
    cert: Object,
    transactions: Array<Transaction>
}

interface Committee {
    id: string,
    committee_member_account: string,
    vote_id: string,
    total_votes: number,
    url: string
}

interface Vote {
	id: string,
    committee_member_account: (string | undefined),
    vote_id: string,
    total_votes: number,
    url: string,
    last_aslot: (number | undefined),
    signing_key: (string | undefined),
    pay_vb: (string | undefined),
    total_missed: (number | undefined),
    last_confirmed_block_num: (number | undefined),
    ed_signing_key: (string | undefined)
}

interface ContractLogs {
    address: string,
    log: Array<string>,
    data: string
}

interface AccountHistory {
    id:String,
    op:Array,
    result:Array,
    block_num:Number,
    trx_in_block:Number,
    op_in_block:Number,
    virtual_op:Number
}

interface FullAccount {
	id: string,
    membership_expiration_date: string,
    registrar: string,
    referrer: string,
    lifetime_referrer: string,
    network_fee_percentage: number,
    lifetime_referrer_fee_percentage: number,
    referrer_rewards_percentage: number,
    name: string,
    owner: Object,
    active: Object,
    ed_key: string,
    options: Object,
    statistics: string,
    whitelisting_accounts: Array<any>,
    blacklisting_accounts: Array<any>,
    whitelisted_accounts: Array<any>,
    blacklisted_accounts: Array<any>,
    owner_special_authority: Array<any>,
    active_special_authority: Array<any>,
    top_n_control_flags: number,
    history: Array<AccountHistory>,
    balances: Object,
    limit_orders: Object,
    call_orders: Object,
    proposals: Object
}

interface ChainProperties {
    id: string,
    chain_id: string,
    immutable_parameters:{
        min_committee_member_count: number,
        num_special_accounts: number,
        num_special_assets: number
    }
}

interface GlobalProperties {
	id: string,
	parameters: Object,
	next_available_vote_id: number,
	active_committee_members: Array<string>,
 }
 
 interface Config {
	ECHO_SYMBOL: string,
    ECHO_ADDRESS_PREFIX: string,
    ECHO_ED_PREFIX: string,
    ECHO_MIN_ACCOUNT_NAME_LENGTH: number,
    ECHO_MAX_ACCOUNT_NAME_LENGTH: number,
    ECHO_MIN_ASSET_SYMBOL_LENGTH: number,
    ECHO_MAX_ASSET_SYMBOL_LENGTH: number,
    ECHO_MAX_SHARE_SUPPLY: string,
    ECHO_MAX_PAY_RATE: number,
    ECHO_MAX_SIG_CHECK_DEPTH: number,
    ECHO_MIN_TRANSACTION_SIZE_LIMIT: number,
    ECHO_MIN_BLOCK_INTERVAL: number,
    ECHO_MAX_BLOCK_INTERVAL: number,
    ECHO_DEFAULT_BLOCK_INTERVAL: number,
    ECHO_DEFAULT_MAX_TRANSACTION_SIZE: number,
    ECHO_DEFAULT_MAX_BLOCK_SIZE: number,
    ECHO_DEFAULT_MAX_TIME_UNTIL_EXPIRATION: number,
    ECHO_DEFAULT_MAINTENANCE_INTERVAL: number,
    ECHO_DEFAULT_MAINTENANCE_SKIP_SLOTS: number,
    ECHO_MIN_UNDO_HISTORY: number,
    ECHO_MAX_UNDO_HISTORY: number,
    ECHO_MIN_BLOCK_SIZE_LIMIT: number,
    ECHO_MIN_TRANSACTION_EXPIRATION_LIMIT: number,
    ECHO_BLOCKCHAIN_PRECISION: number,
    ECHO_BLOCKCHAIN_PRECISION_DIGITS: number,
    ECHO_DEFAULT_TRANSFER_FEE: number,
    ECHO_MAX_INSTANCE_ID: string,
    ECHO_100_PERCENT: number,
    ECHO_1_PERCENT: number,
    ECHO_MAX_MARKET_FEE_PERCENT: number,
    ECHO_DEFAULT_FORCE_SETTLEMENT_DELAY: number,
    ECHO_DEFAULT_FORCE_SETTLEMENT_OFFSET: number,
    ECHO_DEFAULT_FORCE_SETTLEMENT_MAX_VOLUME: number,
    ECHO_DEFAULT_PRICE_FEED_LIFETIME: number,
    ECHO_MAX_FEED_PRODUCERS: number,
    ECHO_DEFAULT_MAX_AUTHORITY_MEMBERSHIP: number,
    ECHO_DEFAULT_MAX_ASSET_WHITELIST_AUTHORITIES: number,
    ECHO_DEFAULT_MAX_ASSET_FEED_PUBLISHERS: number,
    ECHO_COLLATERAL_RATIO_DENOM: number,
    ECHO_MIN_COLLATERAL_RATIO: number,
    ECHO_MAX_COLLATERAL_RATIO: number,
    ECHO_DEFAULT_MAINTENANCE_COLLATERAL_RATIO: number,
    ECHO_DEFAULT_MAX_SHORT_SQUEEZE_RATIO: number,
    ECHO_DEFAULT_MARGIN_PERIOD_SEC: number,
    ECHO_DEFAULT_MAX_COMMITTEE: number,
    ECHO_DEFAULT_MAX_PROPOSAL_LIFETIME_SEC: number,
    ECHO_DEFAULT_COMMITTEE_PROPOSAL_REVIEW_PERIOD_SEC: number,
    ECHO_DEFAULT_NETWORK_PERCENT_OF_FEE: number,
    ECHO_DEFAULT_LIFETIME_REFERRER_PERCENT_OF_FEE: number,
    ECHO_DEFAULT_MAX_BULK_DISCOUNT_PERCENT: number,
    ECHO_DEFAULT_BULK_DISCOUNT_THRESHOLD_MIN: number,
    ECHO_DEFAULT_BULK_DISCOUNT_THRESHOLD_MAX: string,
    ECHO_DEFAULT_CASHBACK_VESTING_PERIOD_SEC: number,
    ECHO_DEFAULT_CASHBACK_VESTING_THRESHOLD: number,
    ECHO_DEFAULT_BURN_PERCENT_OF_FEE: number,
    ECHO_DEFAULT_MAX_ASSERT_OPCODE: number,
    ECHO_DEFAULT_FEE_LIQUIDATION_THRESHOLD: number,
    ECHO_DEFAULT_ACCOUNTS_PER_FEE_SCALE: number,
    ECHO_DEFAULT_ACCOUNT_FEE_SCALE_BITSHIFTS: number,
    ECHO_MAX_URL_LENGTH: number,
    ECHO_NEAR_SCHEDULE_CTR_IV: string,
    ECHO_FAR_SCHEDULE_CTR_IV: string,
    ECHO_CORE_ASSET_CYCLE_RATE: number,
    ECHO_CORE_ASSET_CYCLE_RATE_BITS: number,
    ECHO_MAX_INTEREST_APR: number,
    ECHO_COMMITTEE_ACCOUNT: string,
    ECHO_RELAXED_COMMITTEE_ACCOUNT: string,
    ECHO_NULL_ACCOUNT: string,
    ECHO_TEMP_ACCOUNT: string
 }

 interface DynamicGlobalProperties {
	id: string,
    head_block_number: number,
    head_block_id: string,
    time: string,
    next_maintenance_time: string,
    last_budget_time: string,
    committee_budget: number,
    accounts_registered_this_interval: number,
    recently_missed_count: number,
    current_aslot: number,
    recent_slots_filled: string,
    dynamic_flags: number,
    last_irreversible_block_num: number
 }

interface Asset {
    id: string,
    symbol: string,
    precision:Number,
    issuer: string,
    options: Object,
    dynamic_asset_data_id: string,
    dynamic: Object,
    bitasset: (Object | undefined)
}

interface ContractHistory {
    block_num: number,
    id: string,
    op: Array<any>,
    op_in_trx: number,
    result: [0, {}],
    trx_in_block: number,
    virtual_op: number,
}

export default class Api {
	broadcastTransaction(tr: Object): Promise<any>;
	broadcastTransactionWithCallback(signedTransactionObject: Object, wasBroadcastedCallback: Function): Promise<any>;
	get24Volume(baseAssetName: string, quoteAssetName: string): Promise<any>;
	getAccounts(accountIds: Array<string>, force?: boolean): Promise<Array<Account>>;
	getAccountBalances(accountId: string, assetIds: Array<string>, force?: boolean): Promise<Object>;
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
	getCallOrders(assetId: string, limit: number): Promise<any>;
	getChainId(force?: boolean): Promise<string>
	getChainProperties(force?: boolean): Promise<ChainProperties>;
	getCommitteeMembers(committeeMemberIds: Array<string>, force?: boolean): Promise<Array<Committee>>;
	getCommitteeMemberByAccount(accountId: string, force?: boolean): Promise<Committee>;
	getConfig(force?: boolean): Promise<Config>;
	getContract(contractId: string): Promise<Array<any>>;
	getContractBalances(contractId: string, force?)
	getContractHistory(operationId: string, stop: number, limit: number, start: number): Promise<Array<ContractHistory>>;
	getContracts(contractIds: Array<string>, force?: boolean): Promise<Array<{id: string, statistics: string, suicided: boolean}>>;
	getContractLogs(ontractId: string, fromBlock: number, toBlock: number): Promise<Array<ContractLogs>>;
	getContractResult(resultContractId: string, force: boolean): Promise<Array<any>>;
	getDynamicAssetData(dynamicAssetDataId: string, force?: boolean): Promise<Object>;
	getDynamicGlobalProperties(force?: boolean): Promise<DynamicGlobalProperties>;
	getFeePool(assetId: string): Promise<BigNumber>;
	getFullAccounts(accountNamesOrIds: Array<string>, subscribe?: boolean, force?: boolean): Promise<Array<FullAccount>>;
	getFullContract(contractId: string, force?: boolean): Promise<Object>;
	getGlobalProperties(force?: boolean): Promise<GlobalProperties>;
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
	getRelativeAccountHistory(accountId: string, stop: number, limit: number, start: number): Promise<Array<AccountHistory>>;
	getRequiredFees(operations: Array<Object>, assetId: string): Promise<Array<{asset_id: string, amount: number}>>;
	getRequiredSignatures(tr: Object, availableKey: Array<string>): Promise<any>;
	getSettleOrders(assetId: string, limit: number): Promise<any>;
	getSidechainTransfers(receiver: string): Promise<Array<{transfer_id: number, receiver: string, amount: number, signatures: string, withdraw_code: string}>>;
	getTicker(baseAssetName: string, quoteAssetName: string): Promise<any>;
	getTradeHistory(baseAssetName: string, quoteAssetName: number, start: number, stop: number, limit: number): Promise<any>;
	getTransaction(blockNum: number, transactionIndex: number): Promise<Transaction>;
	getTransactionHex(tr: Object): Promise<any>;
	getVestedBalances(balanceIds: Array<string>): Promise<any>;
	getVestingBalances(balanceIds: Array<string>): Promise<any>;
	callContractNoChangingState(contractId: string, accountId: string, assetId: string, bytecode: string): Promise<string>;
	listAssets(lowerBoundSymbol: string, limit: number): Promise<Array<Asset>>;
	lookupAccounts(lowerBoundName: string, limit: number): Promise<Array<string>>;
	lookupAccountNames(accountNames: Array<string>, force?: boolean): Promise<Array<Account>>;
	lookupAssetSymbols(symbolsOrIds: Array<string>, force?: boolean): Promise<Array<Asset>>;
	lookupCommitteeMemberAccounts(lowerBoundName: string, limit: number): Promise<any>;
	lookupVoteIds(votes: Array<string>, force?: boolean): Promise<Array<Vote>>;
	registerAccount(name: string, activeKey: string, echoRandKey: string, wasBroadcastedCallback: Function): Promise<null>
	validateTransaction(tr: Object): Promise<any>;
	verifyAuthority(tr: Object): Promise<any>;
	verifyAccountAuthority(accountNameOrId: Object, signers: Array<string>): Promise<any>;
}
