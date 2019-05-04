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
	 *  @method getAccountReferences
	 *  @param  {String} accountId
	 *
	 *  @return {Promise}
	 */
	getAccountReferences(accountId) {
		return this.db.exec('get_account_references', [accountId]);
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
	 *  @method getOrderBook
	 *  @param  {String} baseAssetName
	 *  @param  {String} quoteAssetName
	 *  @param  {Number} depth
	 *
	 *  @return {Promise}
	 */
	getOrderBook(baseAssetName, quoteAssetName, depth = 50) {
		return this.db.exec('get_order_book', [baseAssetName, quoteAssetName, depth]);
	}

	/**
	 *  @method getLimitOrders
	 *  @param  {String} baseAssetId
	 *  @param  {String} quoteAssetId
	 *  @param  {Number} limit
	 *
	 *  @return {Promise}
	 */
	getLimitOrders(baseAssetId, quoteAssetId, limit) {
		return this.db.exec('get_limit_orders', [baseAssetId, quoteAssetId, limit]);
	}

	/**
	 *  @method getCallOrders
	 *  @param  {String} assetId
	 *  @param  {Number} limit
	 *
	 *  @return {Promise}
	 */
	getCallOrders(assetId, limit) {
		return this.db.exec('get_call_orders', [assetId, limit]);
	}

	/**
	 *  @method getSettleOrders
	 *  @param  {String} assetId
	 *  @param  {Number} limit
	 *
	 *  @return {Promise}
	 */
	getSettleOrders(assetId, limit) {
		return this.db.exec('get_settle_orders', [assetId, limit]);
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
	 *  @method subscribeToMarket
	 *  @param  {Function} callback
	 *  @param  {String} baseAssetId
	 *  @param  {String} quoteAssetId
	 *
	 *  @return {Promise}
	 */
	subscribeToMarket(callback, baseAssetId, quoteAssetId) {
		return this.db.exec('subscribe_to_market', [callback, baseAssetId, quoteAssetId]);
	}

	/**
	 *  @method unsubscribeFromMarket
	 *
	 *  @param  {String} baseAssetId
	 *  @param  {String} quoteAssetId
	 *
	 *  @return {Promise}
	 */
	unsubscribeFromMarket(baseAssetId, quoteAssetId) {
		return this.db.exec('unsubscribe_to_market', [baseAssetId, quoteAssetId]);
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
	 *  @method lookupVoteIds
	 *
	 *  @param  {Array<Strings>} votes
	 *
	 *  @return {Promise}
	 */
	lookupVoteIds(votes) {
		return this.db.exec('lookup_vote_ids', [votes]);
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
	 *  @method getContractLogs
	 *
	 *  @param  {String} contractId
	 *  @param  {Number} fromBlock
	 *  @param  {Number} toBlock
	 *
	 *  @return {Promise}
	 */
	getContractLogs(contractId, fromBlock, toBlock) {
		return this.db.exec('get_contract_logs', [contractId, fromBlock, toBlock]);
	}

	/**
	 *  @method subscribeContractLogs
	 *
	 *  @param  {Function} callback
	 *  @param  {String} contractId
	 *  @param  {Number} fromBlock
	 *  @param  {Number} toBlock
	 *
	 *  @return {Promise}
	 */
	subscribeContractLogs(callback, contractId, fromBlock, toBlock) {
		return this.db.exec('subscribe_contract_logs', [callback, contractId, fromBlock, toBlock]);
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
	 *  @method callContractNoChangingState
	 *
	 *  @param  {String} contractId
	 *  @param  {String} accountId
	 *  @param  {String} assetId
	 *  @param  {String} bytecode
	 *
	 *  @return {Promise}
	 */
	callContractNoChangingState(contractId, accountId, assetId, bytecode) {
		return this.db.exec('call_contract_no_changing_state', [contractId, accountId, assetId, bytecode]);
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
	 *  @method getRecentTransactionById
	 *
	 * 	@param  {String} receiver
	 *
	 * 	@return {Promise}
	 */
	getSidechainTransfers(receiver) {
		return this.db.exec('get_sidechain_transfers', [receiver]);
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

}

export default DatabaseAPI;
