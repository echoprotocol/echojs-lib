/** @typedef {"" | "eth" | "btc"} SidechainType */

class DatabaseAPI {

	/**
	 *  @constructor
	 *
	 *  @param {EchoApi} db
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 *  @method getObjects
	 *  @param  {Array<String>} objectIds
	 *  @return {Promise}
	 */
	getObjects(objectIds) {
		return this.db.exec('get_objects', [objectIds]);
	}

	/**
	 * @param {string} contractId
	 * @returns {Promise<boolean>}
	 */
	checkERC20Token(contractId) {
		return this.db.exec('check_erc20_token', [contractId]);
	}

	/**
	 *  @method setSubscribeCallback
	 *  @param  {Function} callback
	 *  @param  {Boolean} notifyRemoveCreate
	 *
	 *  @return {Promise}
	 */
	setSubscribeCallback(callback, notifyRemoveCreate) {
		return this.db.exec('set_subscribe_callback', [callback, notifyRemoveCreate]);
	}

	/**
	 *  @method setPendingTransactionCallback
	 *  @param  {Function} callback
	 *
	 *  @return {Promise}
	 */
	setPendingTransactionCallback(callback) {
		return this.db.exec('set_pending_transaction_callback', [callback]);
	}

	/**
	 *  @method setBlockAppliedCallback
	 *  @param  {Function} callback
	 *
	 *  @return {Promise}
	 */
	setBlockAppliedCallback(callback) {
		return this.db.exec('set_block_applied_callback', [callback]);
	}

	/**
	 *  @method cancelAllSubscriptions
	 *
	 *  @return {Promise}
	 */
	cancelAllSubscriptions() {
		return this.db.exec('cancel_all_subscriptions', []);
	}

	/**
	 *  @method getBlockHeader
	 *  @param  {Number} blockNum
	 *
	 *  @return {Promise}
	 */
	getBlockHeader(blockNum) {
		return this.db.exec('get_block_header', [blockNum]);
	}

	/**
	 *  @method getBlock
	 *  @param  {Number} blockNum
	 *
	 *  @return {Promise}
	 */
	getBlock(blockNum) {
		return this.db.exec('get_block', [blockNum]);
	}

	/**
	 *  @method getTransaction
	 *  @param  {Number} blockNum
	 *  @param  {Number} transactionIndex
	 *
	 *  @return {Promise}
	 */
	getTransaction(blockNum, transactionIndex) {
		return this.db.exec('get_transaction', [blockNum, transactionIndex]);
	}

	/**
	 *  @method getChainProperties
	 *
	 *  @return {Promise}
	 */
	getChainProperties() {
		return this.db.exec('get_chain_properties', []);
	}

	/**
	 *  @method getGlobalProperties
	 *
	 *  @return {Promise}
	 */
	getGlobalProperties() {
		return this.db.exec('get_global_properties', []);
	}

	/**
	 *  @method getConfig
	 *
	 *  @return {Promise}
	 */
	getConfig() {
		return this.db.exec('get_config', []);
	}

	/**
	 *  @method getChainId
	 *
	 *  @return {Promise}
	 */
	getChainId() {
		return this.db.exec('get_chain_id', []);
	}

	/**
	 *  @method getDynamicGlobalProperties
	 *
	 *  @return {Promise}
	 */
	getDynamicGlobalProperties() {
		return this.db.exec('get_dynamic_global_properties', []);
	}

	/**
	 *  @method getKeyReferences
	 *  @param  {Array<String>} keys [public keys]
	 *
	 *  @return {Promise}
	 */
	getKeyReferences(keys) {
		return this.db.exec('get_key_references', [keys]);
	}

	/**
	 *  @method getAccounts
	 *  @param  {Array<String>} accountIds
	 *
	 *  @return {Promise}
	 */
	getAccounts(accountIds) {
		return this.db.exec('get_accounts', [accountIds]);
	}

	/**
	 *  @method getFullAccounts
	 *  @param  {Array<String>} accountNamesOrIds
	 *  @param  {Boolean} subscribe
	 *
	 *  @return {Promise}
	 */
	getFullAccounts(accountNamesOrIds, subscribe) {
		return this.db.exec('get_full_accounts', [accountNamesOrIds, subscribe]);
	}

	/**
	 *  @method getAccountByName
	 *  @param  {String} accountName
	 *
	 *  @return {Promise}
	 */
	getAccountByName(accountName) {
		return this.db.exec('get_account_by_name', [accountName]);
	}

	/**
	 * @method getAccountDeposits
	 * @param {string} account
	 * @param {SidechainType} type
	 * @returns {Promise<unknown>}
	 */
	getAccountDeposits(account, type) {
		return this.db.exec('get_account_deposits', [account, type]);
	}

	/**
	 *  @method getAccountReferences
	 *  @param  {String} accountId
	 *
	 *  @return {Promise}
	 */
	getAccountReferences(accountId) {
		return this.db.exec('get_account_references', [accountId]);
	}

	/**
	 * @method getAccountWithdrawals
	 * @param {string} account
	 * @param {SidechainType} type
	 * @returns {Promise<unknown>}
	 */
	getAccountWithdrawals(account, type) {
		return this.db.exec('get_account_withdrawals', [account, type]);
	}

	/**
	 *  @method lookupAccountNames
	 *  @param  {Array<String>} accountNames
	 *
	 *  @return {Promise}
	 */
	lookupAccountNames(accountNames) {
		return this.db.exec('lookup_account_names', [accountNames]);
	}

	/**
	 *  @method lookupAccounts
	 *  @param  {String} lowerBoundName
	 *  @param  {Number} limit
	 *
	 *  @return {Promise}
	 */
	lookupAccounts(lowerBoundName, limit) {
		return this.db.exec('lookup_accounts', [lowerBoundName, limit]);
	}

	/**
	 *  @method getAccountCount
	 *
	 *  @return {Promise}
	 */
	getAccountCount() {
		return this.db.exec('get_account_count', []);
	}

	/**
	 *  @method getAccountBalances
	 *  @param  {String} accountId
	 *  @param  {Array<String>} assetIds
	 *
	 *  @return {Promise}
	 */
	getAccountBalances(accountId, assetIds) {
		return this.db.exec('get_account_balances', [accountId, assetIds]);
	}

	/**
	 *  @method getNamedAccountBalances
	 *  @param  {String} accountName
	 *  @param  {Array<String>} assetIds
	 *
	 *  @return {Promise}
	 */
	getNamedAccountBalances(accountName, assetIds) {
		return this.db.exec('get_named_account_balances', [accountName, assetIds]);
	}

	/**
	 *  @method getVestedBalances
	 *  @param  {Array<String>} objectIds
	 *
	 *  @return {Promise}
	 */
	getVestedBalances(objectIds) {
		return this.db.exec('get_vested_balances', [objectIds]);
	}

	/**
	 *  @method getVestingBalances
	 *  @param  {String} accountId
	 *
	 *  @return {Promise}
	 */
	getVestingBalances(accountId) {
		return this.db.exec('get_vesting_balances', [accountId]);
	}

	/**
	 *  @method getAssets
	 *  @param  {Array<String>} assetIds
	 *
	 *  @return {Promise}
	 */
	getAssets(assetIds) {
		return this.db.exec('get_assets', [assetIds]);
	}

	/**
	 *  @method listAssets
	 *  @param  {String} lowerBoundSymbol
	 *  @param  {Number} limit
	 *
	 *  @return {Promise}
	 */
	listAssets(lowerBoundSymbol, limit) {
		return this.db.exec('list_assets', [lowerBoundSymbol, limit]);
	}

	/**
	 *  @method lookupAssetSymbols
	 *  @param  {Array<String>} symbolsOrIds
	 *
	 *  @return {Promise}
	 */
	lookupAssetSymbols(symbolsOrIds) {
		return this.db.exec('lookup_asset_symbols', [symbolsOrIds]);
	}

	/**
	 *  @method getMarginPositions
	 *  @param  {String} accountId
	 *
	 *  @return {Promise}
	 */
	getMarginPositions(accountId) {
		return this.db.exec('get_margin_positions', [accountId]);
	}

	/**
	 *  @method getTicker
	 *
	 *  @param  {String} baseAssetName
	 *  @param  {String} quoteAssetName
	 *
	 *  @return {Promise}
	 */
	getTicker(baseAssetName, quoteAssetName) {
		return this.db.exec('get_ticker', [baseAssetName, quoteAssetName]);
	}

	/**
	 *  @method get24Volume
	 *
	 *  @param  {String} baseAssetName
	 *  @param  {String} quoteAssetName
	 *
	 *  @return {Promise}
	 */
	get24Volume(baseAssetName, quoteAssetName) {
		return this.db.exec('get_24_volume', [baseAssetName, quoteAssetName]);
	}

	/**
	 *  @method getTradeHistory
	 *
	 *  @param  {String} baseAssetName
	 *  @param  {String} quoteAssetName
	 *  @param  {Number} start
	 *  @param  {Number} stop
	 *  @param  {Number} limit
	 *
	 *  @return {Promise}
	 */
	getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit = 100) {
		return this.db.exec('get_trade_history', [baseAssetName, quoteAssetName, start, stop, limit]);
	}

	/**
	 *  @method getCommitteeMembers
	 *
	 *  @param  {Array<String>} committeeMemberIds
	 *
	 *  @return {Promise}
	 */
	getCommitteeMembers(committeeMemberIds) {
		return this.db.exec('get_committee_members', [committeeMemberIds]);
	}

	/**
	 *  @method getCommitteeMemberByAccount
	 *
	 *  @param  {String} accountId
	 *
	 *  @return {Promise}
	 */
	getCommitteeMemberByAccount(accountId) {
		return this.db.exec('get_committee_member_by_account', [accountId]);
	}

	/**
	 *  @method lookupCommitteeMemberAccounts
	 *
	 *  @param  {String} lowerBoundName
	 *  @param  {Number} limit
	 *
	 *  @return {Promise}
	 */
	lookupCommitteeMemberAccounts(lowerBoundName, limit) {
		return this.db.exec('lookup_committee_member_accounts', [lowerBoundName, limit]);
	}

	/**
	 *  @method getTransactionHex
	 *
	 *  @param  {Object} transaction
	 *
	 *  @return {Promise}
	 */
	getTransactionHex(transaction) {
		// transaction is signed
		return this.db.exec('get_transaction_hex', [transaction]);
	}

	/**
	 *  @method getRequiredSignatures
	 *
	 *  @param  {Object} transaction
	 *  @param  {Array<String>} availableKeys [public keys]
	 *
	 *  @return {Promise}
	 */
	getRequiredSignatures(transaction, availableKeys) {
		return this.db.exec('get_required_signatures', [transaction, availableKeys]);
	}

	/**
	 *  @method getPotentialSignatures
	 *
	 *  @param  {Object} transaction
	 *
	 *  @return {Promise}
	 */
	getPotentialSignatures(transaction) {
		return this.db.exec('get_potential_signatures', [transaction]);
	}

	/**
	 *  @method verifyAuthority
	 *
	 *  @param  {Object} transaction
	 *
	 *  @return {Promise}
	 */
	verifyAuthority(transaction) {
		return this.db.exec('verify_authority', [transaction]);
	}

	/**
	 *  @method verifyAccountAuthority
	 *
	 *  @param  {Object} accountNameOrId
	 *  @param  {Array<String>} signers [public keys]
	 *
	 *  @return {Promise}
	 */
	verifyAccountAuthority(accountNameOrId, signers) {
		// signers - set of public keys
		return this.db.exec('verify_account_authority', [accountNameOrId, signers]);
	}

	/**
	 *  @method validateTransaction
	 *
	 *  @param  {Object} transaction
	 *
	 *  @return {Promise}
	 */
	validateTransaction(transaction) {
		// signed transaction
		return this.db.exec('validate_transaction', [transaction]);
	}

	/**
	 *  @method getRequiredFees
	 *
	 *  @param  {Array<Object>} operations
	 *  @param  {String} assetId
	 *
	 *  @return {Promise}
	 */
	getRequiredFees(operations, assetId) {
		return this.db.exec('get_required_fees', [operations, assetId]);
	}

	/**
	 *  @method getProposedTransactions
	 *
	 *  @param  {String} accountNameOrId
	 *
	 *  @return {Promise}
	 */
	getProposedTransactions(accountNameOrId) {
		return this.db.exec('get_proposed_transactions', [accountNameOrId]);
	}

	/**
	 * @method getContractLogs
	 * @param {Object} opts
	 * @param {string[]} [opts.contracts]
	 * @param {(string | string[])[]} [opts.topics]
	 * @param {number} [opts.from_block]
	 * @param {number} [opts.to_block]
	 * @returns {Promise<unknown[]>}
	 */
	getContractLogs(opts) {
		return this.db.exec('get_contract_logs', [opts]);
	}

	/**
	 *  @method subscribeContractLogs
	 *
	 *  @param  {Function} callback
	 *  @param  {Array<Array<String, Array<String>>} contractTopicsMap
	 *
	 *  @return {Promise}
	 */
	subscribeContractLogs(callback, contractTopicsMap) {
		return this.db.exec('subscribe_contract_logs', [callback, contractTopicsMap]);
	}

	/**
	 *  @method getContractResult
	 *
	 *  @param  {String} resultContractId
	 *
	 *  @return {Promise}
	 */
	getContractResult(resultContractId) {
		return this.db.exec('get_contract_result', [resultContractId]);
	}

	/**
	 *  @method getContract
	 *
	 *  @param  {String} contractId
	 *
	 *  @return {Promise}
	 */
	getContract(contractId) {
		return this.db.exec('get_contract', [contractId]);
	}

	/**
	 * @method callContractNoChangingState
	 * @param {string} contractId
	 * @param {string} accountId
	 * @param {string} asset
	 * @param {string} code
	 * @return {Promise<string>}
	 */
	callContractNoChangingState(contractId, caller, asset, code) {
		return this.db.exec('call_contract_no_changing_state', [contractId, caller, asset, code]);
	}

	/**
	 *  @method getContracts
	 *
	 *  @param  {Array<String>} contractIds
	 *
	 *  @return {Promise}
	 */
	getContracts(contractIds) {
		return this.db.exec('get_contracts', [contractIds]);
	}

	/**
	 *  @method getContractBalances
	 *
	 *  @param  {String} contractId
	 *
	 *  @return {Promise}
	 */
	getContractBalances(contractId) {
		return this.db.exec('get_contract_balances', [contractId]);
	}

	/**
	 *  @method subscribeContracts
	 *
	 *  @param  {Array<String>} contractIds
	 *
	 *  @return {Promise}
	 */
	subscribeContracts(contractIds) {
		return this.db.exec('subscribe_contracts', [contractIds]);
	}

	/**
	 *  @method getRecentTransactionById
	 *
	 *  @param  {String} transactionId
	 *
	 *  @return {Promise}
	 */
	getRecentTransactionById(transactionId) {
		return this.db.exec('get_recent_transaction_by_id', [transactionId]);
	}

	/**
	 *  @method getBalanceObjects
	 *
	 *  @param  {Array<String>} keys [public keys]
	 *
	 * 	@return {Promise}
	 */
	getBalanceObjects(keys) {
		return this.db.exec('get_balance_objects', [keys]);
	}

	/**
	 * @method getBlockRewards
	 * @param {number} blockNum
	 * @returns {Promise<unknown>}
	 */
	getBlockRewards(blockNum) {
		return this.db.exec('get_block_rewards', [blockNum]);
	}

	/**
	 *  @method getBlockVirtualOperations
	 *
	 *  @param  {Number} blockNum
	 *
	 * 	@return {Promise}
	 */
	getBlockVirtualOperations(blockNum) {
		return this.db.exec('get_block_virtual_ops', [blockNum]);
	}

	/**
	 *  @method getFrozenBalances
	 *  @param  {String} accountId
	 *
	 *  @return {Promise}
	 */
	getFrozenBalances(accountId) {
		return this.db.exec('get_frozen_balances', [accountId]);
	}

	/**
	 *  @method getBtcAddress
	 *  @param  {String} accountId
	 *
	 *  @return {Promise}
	 */
	getBtcAddress(accountId) {
		return this.db.exec('get_btc_address', [accountId]);
	}

	/**
	 *  @method getBtcDepositScript
	 *  @param  {String} btcDepositId
	 *
	 *  @return {Promise}
	 */
	getBtcDepositScript(btcDepositId) {
		return this.db.exec('get_btc_deposit_script', [btcDepositId]);
	}

	/**
	 *  @method getCommitteeFrozenBalance
	 *  @param  {String} committeeMemberId
	 *
	 *  @return {Promise}
	 */
	getCommitteeFrozenBalance(committeeMemberId) {
		return this.db.exec('get_committee_frozen_balance', [committeeMemberId]);
	}

	/**
	 *  @method getAccountAddresses
	 *  @param  {String} id
	 *  @param {Number} from
	 *  @param {Number} limit
	 *
	 *  @return {Promise}
	 */
	getAccountAddresses(id, from, limit) {
		return this.db.exec('get_account_addresses', [id, from, limit]);
	}

	/**
	 *  @method getEthAddress
	 *  @param  {String} id
	 *
	 *  @return {Promise}
	 */
	getEthAddress(id) {
		return this.db.exec('get_eth_address', [id]);
	}

}

export default DatabaseAPI;
