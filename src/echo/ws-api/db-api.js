class DatabaseAPI {

	constructor(db) {
		this.db = db;
	}

	getObjects(objectIds) {
		return this.db.exec('get_objects', [objectIds]);
	}

	setSubscribeCallback(callback, notifyRemoveCreate) {
		return this.db.exec('set_subscribe_callback', [callback, notifyRemoveCreate]);
	}

	setPendingTransactionCallback(callback) {
		return this.db.exec('set_pending_transaction_callback', [callback]);
	}

	setBlockAppliedCallback(callback) {
		return this.db.exec('set_block_applied_callback', [callback]);
	}

	cancelAllSubscriptions() {
		return this.db.exec('cancel_all_subscriptions', []);
	}

	getBlockHeader(blockNum) {
		return this.db.exec('get_block_header', [blockNum]);
	}

	getBlock(blockNum) {
		return this.db.exec('get_block', [blockNum]);
	}

	getTransaction(blockNum, transactionIndex) {
		return this.db.exec('get_transaction', [blockNum, transactionIndex]);
	}

	getChainProperties() {
		return this.db.exec('get_chain_properties', []);
	}

	getGlobalProperties() {
		return this.db.exec('get_global_properties', []);
	}

	getConfig() {
		return this.db.exec('get_config', []);
	}

	getChainId() {
		return this.db.exec('get_chain_id', []);
	}

	getDynamicGlobalProperties() {
		return this.db.exec('get_dynamic_global_properties', []);
	}

	getKeyReferences(keys) {
		return this.db.exec('get_key_references', [keys]);
	}

	getAccounts(accountIds) {
		return this.db.exec('get_accounts', [accountIds]);
	}

	getFullAccounts(accountNameOrIds, subscribe) {
		return this.db.exec('get_full_accounts', [accountNameOrIds, subscribe]);
	}

	getAccountByName(accountName) {
		return this.db.exec('get_account_by_name', [accountName]);
	}

	getAccountReferences(accountId) {
		return this.db.exec('get_account_references', [accountId]);
	}

	lookupAccountNames(accountNames) {
		return this.db.exec('lookup_account_names', [accountNames]);
	}

	lookupAccounts(lowerBoundName, limit) {
		return this.db.exec('lookup_accounts', [lowerBoundName, limit]);
	}

	getAccountCount() {
		return this.db.exec('get_account_count', []);
	}

	getAccountBalances(accountId, assetIds) {
		return this.db.exec('get_account_balances', [accountId, assetIds]);
	}

	getNamedAccountBalances(accountId, assetIds) {
		return this.db.exec('get_named_account_balances', [accountId, assetIds]);
	}

	getVestedBalances(objectIds) {
		return this.db.exec('get_vested_balances', [objectIds]);
	}

	getVestingBalances(accountId) {
		return this.db.exec('get_vesting_balances', [accountId]);
	}

	getAssets(assetIds) {
		return this.db.exec('get_assets', [assetIds]);
	}

	listAssets(lowerBoundSymbol, limit) {
		return this.db.exec('list_assets', [lowerBoundSymbol, limit]);
	}

	lookupAssetsymbols(symbolsOrIds) {
		return this.db.exec('lookup_asset_symbols', [symbolsOrIds]);
	}

	getOrderBook(baseAssetId, quoteAssetId, depth = 50) {
		return this.db.exec('get_order_book', [baseAssetId, quoteAssetId, depth]);
	}

	getLimitOrders(baseAssetId, quoteAssetId, limit) {
		return this.db.exec('get_limit_orders', [baseAssetId, quoteAssetId, limit]);
	}

	getCallOrders(assetId, limit) {
		return this.db.exec('get_call_orders', [assetId, limit]);
	}

	getSettleOrders(assetId, limit) {
		return this.db.exec('get_settle_orders', [assetId, limit]);
	}

	getMarginPositions(accountId) {
		return this.db.exec('get_margin_positions', [accountId]);
	}

	subscribeToMarket(callback, baseAssetId, quoteAssetId) {
		return this.db.exec('subscribe_to_market', [callback, baseAssetId, quoteAssetId]);
	}

	unsubscribeFromMarket(baseAssetName, quoteAssetName) {
		return this.db.exec('subscribe_to_market', [baseAssetName, quoteAssetName]);
	}

	getTicker(baseAssetName, quoteAssetName) {
		return this.db.exec('get_ticker', [baseAssetName, quoteAssetName]);
	}

	get24Volume(baseAssetName, quoteAssetName) {
		return this.db.exec('get_24_volume', [baseAssetName, quoteAssetName]);
	}

	getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit = 100) {
		return this.db.exec('get_trade_history', [baseAssetName, quoteAssetName, start, stop, limit]);
	}

	getWitnesses(witnessIds) {
		return this.db.exec('get_witnesses', [witnessIds]);
	}

	getWitnessByAccount(accountId) {
		return this.db.exec('get_witness_by_account', [accountId]);
	}

	lookupWitnessAccounts(lowerBoundName, limit) {
		return this.db.exec('lookup_witness_accounts', [lowerBoundName, limit]);
	}

	getWitnessCount() {
		return this.db.exec('get_witness_count', []);
	}

	getCommitteeMembers(сommitteeMemberIds) {
		return this.db.exec('get_committee_members', [сommitteeMemberIds]);
	}

	getCommitteeMemberByAccount(accountId) {
		return this.db.exec('get_committee_member_by_account', [accountId]);
	}

	lookupCommitteeMemberAccounts(lowerBoundName, limit) {
		return this.db.exec('lookup_committee_member_accounts', [lowerBoundName, limit]);
	}

	getWorkersByAccount(accountId) {
		return this.db.exec('get_workers_by_account', [accountId]);
	}

	lookupVoteIds(votes) {
		return this.db.exec('lookup_vote_ids', [votes]);
	}

	getTransactionHex(transaction) {
		// transaction is signed
		return this.db.exec('get_transaction_hex', [transaction]);
	}

	getRequiredSignatures(transaction, availableKeys) {
		return this.db.exec('get_required_signatures', [transaction, availableKeys]);
	}

	getPotentialSignatures(transaction) {
		return this.db.exec('get_potential_signatures', [transaction]);
	}

	verifyAuthority(transaction) {
		return this.db.exec('verify_authority', [transaction]);
	}

	verifyAccountAuthority(accountNameOrId, signers) {
		// signers - set of public keys
		return this.db.exec('verify_account_authority', [accountNameOrId, signers]);
	}

	validateTransaction(transaction) {
		// signed transaction
		return this.db.exec('validate_transaction', [transaction]);
	}

	getRequiredFees(operations, assetId) {
		return this.db.exec('get_required_fees', [operations, assetId]);
	}

	getProposedTransactions(accountNameOrId) {
		return this.db.exec('get_proposed_transactions', [accountNameOrId]);
	}

	getAllContracts() {
		return this.db.exec('get_all_contracts', []);
	}

	getContractLogs(contractId, fromBlock, toBlock) {
		return this.db.exec('get_contract_logs', [contractId, fromBlock, toBlock]);
	}

	subscribeContractLogs(callback, contractId, fromBlock, toBlock) {
		return this.db.exec('subscribe_contract_logs', [callback, contractId, fromBlock, toBlock]);
	}

	getContractResult(resultContractId) {
		return this.db.exec('get_contract_result', [resultContractId]);
	}

	getContract(contractId) {
		return this.db.exec('get_contract', [contractId]);
	}

	callContractNoChangingState(contractId, accountId, assetId, bytecode) {
		return this.db.exec('call_contract_no_changing_state', [contractId, accountId, assetId, bytecode]);
	}

	getContracts(contractIds) {
		return this.db.exec('get_contracts', [contractIds]);
	}

	getContractBalances(contractId) {
		return this.db.exec('get_contract_balances', [contractId]);
	}

	getRecentTransactionById(transactionId) {
		return this.db.exec('get_recent_transaction_by_id', [transactionId]);
	}

}

export default DatabaseAPI;
