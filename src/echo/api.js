import {
	isArray,
	isObjectId,
	isFunction,
	isBoolean,
	isValidAssetName,
	isNumber,
} from '../utils/validator';

class API {

	constructor(cache, api, options) {
		this.cache = cache;
		this.wsApi = api;
		this.options = options;
	}

	/**
     *  @method getObjects
     *  @param  {Array<String>} objectIds
     *  @return {Promise}
     */
	getObjects(objectIds) {

		if (!isArray(objectIds)) return Promise.reject(new Error('ObjectIds should be a array'));
		if (objectIds.some((id) => !isObjectId(id))) return Promise.reject(new Error('ObjectIds should contain object ids'));

		const objects = objectIds.map((id) => {
			this.wsApi.database.getObjects(objectIds);
		});

		return Promise.all(objects);
	}

	/**
     *  @method setSubscribeCallback
     *  @param  {Function} callback
     *  @param  {Boolean} notifyRemoveCreate
     *
     *  @return {Promise}
     */
	setSubscribeCallback(callback, notifyRemoveCreate) {
		if (!isFunction(callback)) return Promise.reject(new Error('Callback should be a function'));
		if (!isBoolean(notifyRemoveCreate)) return Promise.reject(new Error('notifyRemoveCreate should be a boolean'));

		return this.wsApi.database.setSubscribeCallback(callback, notifyRemoveCreate);
	}

	/**
     *  @method setPendingTransactionCallback
     *  @param  {Function} callback
     *
     *  @return {Promise}
     */
	setPendingTransactionCallback(callback) {
		if (!isFunction(callback)) return Promise.reject(new Error('Callback should be a function'));
		return this.wsApi.database.setPendingTransactionCallback(callback);
	}

	/**
     *  @method setBlockAppliedCallback
     *  @param  {Function} callback
     *
     *  @return {Promise}
     */
	setBlockAppliedCallback(callback) {
		if (!isFunction(callback)) return Promise.reject(new Error('Callback should be a function'));
		return this.wsApi.database.setBlockAppliedCallback(callback);
	}

	/**
     *  @method cancelAllSubscriptions
     *
     *  @return {Promise}
     */
	cancelAllSubscriptions() {
		return this.wsApi.database.cancelAllSubscriptions();
	}

	/**
     *  @method getBlockHeader
     *  @param  {Number} blockNum
     *
     *  @return {Promise}
     */
	async getBlockHeader(blockNum) {
		if (!isNumber(blockNum)) return Promise.reject(new Error('BlockNumber should be a number'));

		const cache = this.cache.blocks.get(blockNum);

		if (cache) return Promise.resolve(cache);

		try {

		} catch (e) {
			throw e;
		}
		const

		return cache ? Promise.resolve(cache) : this.wsApi.database.getBlockHeader(blockNum);
	}

	/**
     *  @method getBlock
     *  @param  {Number} blockNum
     *
     *  @return {Promise}
     */
	getBlock(blockNum) {
		this.wsApi.database.getBlock(blockNum);
	}

	/**
     *  @method getTransaction
     *  @param  {Number} blockNum
     *  @param  {Number} transactionIndex
     *
     *  @return {Promise}
     */
	getTransaction(blockNum, transactionIndex) {
		this.wsApi.database.getTransaction(blockNum, transactionIndex);
	}

	/**
     *  @method getChainProperties
     *
     *  @return {Promise}
     */
	getChainProperties() {
		this.wsApi.database.getChainProperties();
	}

	/**
     *  @method getGlobalProperties
     *
     *  @return {Promise}
     */
	getGlobalProperties() {
		this.wsApi.database.getGlobalProperties();
	}

	/**
     *  @method getConfig
     *
     *  @return {Promise}
     */
	getConfig() {
		this.wsApi.database.getConfig();
	}

	/**
     *  @method getChainId
     *
     *  @return {Promise}
     */
	getChainId() {
		this.wsApi.database.getChainId();
	}

	/**
     *  @method getDynamicGlobalProperties
     *
     *  @return {Promise}
     */
	getDynamicGlobalProperties() {
		this.wsApi.database.getDynamicGlobalProperties();
	}

	/**
     *  @method getKeyReferences
     *  @param  {Array<String>} keys [public keys]
     *
     *  @return {Promise}
     */
	getKeyReferences(keys) {
		this.wsApi.database.getKeyReferences(keys);
	}

	/**
     *  @method getAccounts
     *  @param  {Array<String>} accountIds
     *
     *  @return {Promise}
     */
	getAccounts(accountIds) {
		this.wsApi.database.getAccounts(accountIds);
	}

	/**
     *  @method getFullAccounts
     *  @param  {Array<String>} accountNameOrIds
     *  @param  {Boolean} subscribe
     *
     *  @return {Promise}
     */
	getFullAccounts(accountNameOrIds, subscribe) {
		this.wsApi.database.getFullAccounts(accountNameOrIds, subscribe);
	}

	/**
     *  @method getAccountByName
     *  @param  {String} accountName
     *
     *  @return {Promise}
     */
	getAccountByName(accountName) {
		this.wsApi.database.getAccountByName(accountName);
	}

	/**
     *  @method getAccountReferences
     *  @param  {String} accountId
     *
     *  @return {Promise}
     */
	getAccountReferences(accountId) {
		this.wsApi.database.getAccountReferences(accountId);
	}

	/**
     *  @method lookupAccountNames
     *  @param  {Array<String>} accountNames
     *
     *  @return {Promise}
     */
	lookupAccountNames(accountNames) {
		this.wsApi.database.lookupAccountNames(accountNames);
	}

	/**
     *  @method lookupAccounts
     *  @param  {String} lowerBoundName
     *  @param  {Number} limit
     *
     *  @return {Promise}
     */
	lookupAccounts(lowerBoundName, limit) {
		this.wsApi.database.lookupAccounts(lowerBoundName, limit);
	}

	/**
     *  @method getAccountCount
     *
     *  @return {Promise}
     */
	getAccountCount() {
		this.wsApi.database.getAccountCount();
	}

	/**
     *  @method getAccountBalances
     *  @param  {String} accountId
     *  @param  {Array<String>} assetIds
     *
     *  @return {Promise}
     */
	getAccountBalances(accountId, assetIds) {
		this.wsApi.database.getAccountBalances(accountId, assetIds);
	}

	/**
     *  @method getNamedAccountBalances
     *  @param  {String} accountId
     *  @param  {Array<String>} assetIds
     *
     *  @return {Promise}
     */
	getNamedAccountBalances(accountId, assetIds) {
		this.wsApi.database.getNamedAccountBalances(accountId, assetIds);
	}

	/**
     *  @method getVestedBalances
     *  @param  {Array<String>} objectIds
     *
     *  @return {Promise}
     */
	getVestedBalances(objectIds) {
		this.wsApi.database.getVestedBalances(objectIds);
	}

	/**
     *  @method getVestingBalances
     *  @param  {String} accountId
     *
     *  @return {Promise}
     */
	getVestingBalances(accountId) {
		this.wsApi.database.getVestingBalances(accountId);
	}

	/**
     *  @method getAssets
     *  @param  {Array<String>} assetIds
     *
     *  @return {Promise}
     */
	getAssets(assetIds) {
		this.wsApi.database.getAssets(assetIds);
	}

	/**
     *  @method listAssets
     *  @param  {String} lowerBoundSymbol
     *  @param  {Number} limit
     *
     *  @return {Promise}
     */
	listAssets(lowerBoundSymbol, limit) {
		this.wsApi.database.listAssets(lowerBoundSymbol, limit);
	}

	/**
     *  @method lookupAssetSymbols
     *  @param  {Array<String>} symbolsOrIds
     *
     *  @return {Promise}
     */
	lookupAssetSymbols(symbolsOrIds) {
		this.wsApi.database.lookupAssetSymbols(symbolsOrIds);
	}

	/**
     *  @method getOrderBook
     *  @param  {String} baseAssetId
     *  @param  {String} quoteAssetId
     *  @param  {Number} depth
     *
     *  @return {Promise}
     */
	getOrderBook(baseAssetId, quoteAssetId, depth = 50) {
		this.wsApi.database.getOrderBook(baseAssetId, quoteAssetId, depth);
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
		this.wsApi.database.getLimitOrders(baseAssetId, quoteAssetId, limit);
	}

	/**
     *  @method getCallOrders
     *  @param  {String} assetId
     *  @param  {Number} limit
     *
     *  @return {Promise}
     */
	getCallOrders(assetId, limit) {
		this.wsApi.database.getCallOrders(assetId, limit);
	}

	/**
     *  @method getSettleOrders
     *  @param  {String} assetId
     *  @param  {Number} limit
     *
     *  @return {Promise}
     */
	getSettleOrders(assetId, limit) {
		this.wsApi.database.getSettleOrders(assetId, limit);
	}

	/**
     *  @method getMarginPositions
     *  @param  {String} accountId
     *
     *  @return {Promise}
     */
	getMarginPositions(accountId) {
		this.wsApi.database.getMarginPositions(accountId);
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
		if (!isFunction(callback)) return Promise.reject(new Error('Callback parameter should be a function'));
		this.wsApi.database.subscribeToMarket(callback, baseAssetId, quoteAssetId);
	}

	/**
     *  @method unsubscribeFromMarket
     *
     *  @param  {String} baseAssetName
     *  @param  {String} quoteAssetName
     *
     *  @return {Promise}
     */
	unsubscribeFromMarket(baseAssetName, quoteAssetName) {
		this.wsApi.database.unsubscribeFromMarket(baseAssetName, quoteAssetName);
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
		this.wsApi.database.getTicker(baseAssetName, quoteAssetName);
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
		this.wsApi.database.get24Volume(baseAssetName, quoteAssetName);
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
	getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit) {
		this.wsApi.database.getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit);
	}

	/**
     *  @method getWitnesses
     *
     *  @param  {Array<String>} witnessIds
     *
     *  @return {Promise}
     */
	getWitnesses(witnessIds) {
		this.wsApi.database.getWitnesses(witnessIds);
	}

	/**
     *  @method getWitnessByAccount
     *
     *  @param  {String} accountId
     *
     *  @return {Promise}
     */
	getWitnessByAccount(accountId) {
		this.wsApi.database.getWitnessByAccount(accountId);
	}

	/**
     *  @method lookupWitnessAccounts
     *
     *  @param  {String} lowerBoundName
     *  @param  {Number} limit
     *
     *  @return {Promise}
     */
	lookupWitnessAccounts(lowerBoundName, limit) {
		this.wsApi.database.lookupWitnessAccounts(lowerBoundName, limit);
	}

	/**
     *  @method getWitnessCount
     *
     *  @return {Promise}
     */
	getWitnessCount() {
		this.wsApi.database.getWitnessCount();
	}

	/**
     *  @method getCommitteeMembers
     *
     *  @param  {Array<String>} committeeMemberIds
     *
     *  @return {Promise}
     */
	getCommitteeMembers(committeeMemberIds) {
		this.wsApi.database.getCommitteeMembers(committeeMemberIds);
	}

	/**
     *  @method getCommitteeMemberByAccount
     *
     *  @param  {String} accountId
     *
     *  @return {Promise}
     */
	getCommitteeMemberByAccount(accountId) {
		this.wsApi.database.getCommitteeMemberByAccount(accountId);
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
		this.wsApi.database.lookupCommitteeMemberAccounts(lowerBoundName, limit);
	}

	/**
     *  @method getWorkersByAccount
     *
     *  @param  {String} accountId
     *
     *  @return {Promise}
     */
	getWorkersByAccount(accountId) {
		this.wsApi.database.getWorkersByAccount(accountId);
	}

	/**
     *  @method lookupVoteIds
     *
     *  @param  {Array<Strings>} votes
     *
     *  @return {Promise}
     */
	lookupVoteIds(votes) {
		this.wsApi.database.lookupVoteIds(votes);
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
		this.wsApi.database.getTransactionHex(transaction);
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
		this.wsApi.database.getRequiredSignatures(transaction, availableKeys);
	}

	/**
     *  @method getPotentialSignatures
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise}
     */
	getPotentialSignatures(transaction) {
		this.wsApi.database.getPotentialSignatures(transaction);
	}

	/**
     *  @method verifyAuthority
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise}
     */
	verifyAuthority(transaction) {
		this.wsApi.database.verifyAuthority(transaction);
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
		this.wsApi.database.verifyAccountAuthority(accountNameOrId, signers);
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
		this.wsApi.database.validateTransaction(transaction);
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
		this.wsApi.database.getRequiredFees(operations, assetId);
	}

	/**
     *  @method getProposedTransactions
     *
     *  @param  {String} accountNameOrId
     *
     *  @return {Promise}
     */
	getProposedTransactions(accountNameOrId) {
		this.wsApi.database.getProposedTransactions(accountNameOrId);
	}

	/**
     *  @method getAllContracts
     *
     *  @return {Promise}
     */
	getAllContracts() {
		this.wsApi.database.getAllContracts();
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
		this.wsApi.database.getContractLogs(contractId, fromBlock, toBlock);
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
		this.wsApi.database.subscribeContractLogs(callback, contractId, fromBlock, toBlock);
	}

	/**
     *  @method getContractResult
     *
     *  @param  {String} resultContractId
     *
     *  @return {Promise}
     */
	getContractResult(resultContractId) {
		this.wsApi.database.getContractResult(resultContractId);
	}

	/**
     *  @method getContract
     *
     *  @param  {String} contractId
     *
     *  @return {Promise}
     */
	getContract(contractId) {
		this.wsApi.database.getContract(contractId);
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
		this.wsApi.database.callContractNoChangingState(contractId, accountId, assetId, bytecode);
	}

	/**
     *  @method getContracts
     *
     *  @param  {Array<String>} contractIds
     *
     *  @return {Promise}
     */
	getContracts(contractIds) {
		this.wsApi.database.getContracts(contractIds);
	}

	/**
     *  @method getContractBalances
     *
     *  @param  {String} contractId
     *
     *  @return {Promise}
     */
	getContractBalances(contractId) {
		this.wsApi.database.getContractBalances(contractId);
	}

	/**
     *  @method getRecentTransactionById
     *
     *  @param  {String} transactionId
     *
     *  @return {Promise}
     */
	getRecentTransactionById(transactionId) {
		this.wsApi.database.getRecentTransactionById(transactionId);
	}

	reset() {
		// TODO reset
	}

}

export default API;
