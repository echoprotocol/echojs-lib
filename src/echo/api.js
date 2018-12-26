import {
	isArray,
	isObjectId,
	isBoolean,
	isValidAssetName,
	isNumber,
	isAccountId,
	isNonNegativeInteger,
	isAccountName,
	isString,
	isAssetId,
	isBalanceId,
	isStringSymbol,
	isPublicKey,
} from '../utils/validator';

class API {

	constructor(cache, wsApi, options) {
		this.cache = cache;
		this.wsApi = wsApi;
		this.options = options;
	}

	reset() {
		// TODO reset
	}

	setOptions() {}

	/**
	 *
	 * @param {String} cacheName
	 * @param {String} methodName
	 * @returns {Promise.<*>}
	 * @private
	 */
	async _getConfigurations(cacheName, methodName) {
		const cacheValue = this.cache[cacheName];

		if (cacheValue) return cacheValue;

		try {
			const requestedObject = await this.wsApi.database[methodName]();

			this.cache[cacheName] = requestedObject;

			return requestedObject;
		} catch (error) {
			throw error;
		}
	}

	/**
	 *
	 * @param {Array} array
	 * @param {String} cacheName
	 * @param {String} methodName
	 * @returns {Promise.<Array.<*>>}
	 * @private
	 */
	async _getArrayData(array, cacheName, methodName) {
		const { length } = array;

		const resultArray = new Array(length).fill(null);
		let requestedObjects = [];

		for (let i = 0; i < length; i += 1) {
			const id = array[i];
			const cacheValue = this.cache[cacheName].get(id);

			if (cacheValue) resultArray[i] = cacheValue;
			else requestedObjects.push(id);
		}

		try {
			requestedObjects = await Promise.all(this.wsApi.database[methodName](requestedObjects));
		} catch (error) {
			throw error;
		}

		for (let i = 0; i < length; i += 1) {
			if (!resultArray[i]) {

				const id = array[i];
				const requestedObject = requestedObjects.shift();

				this.cache[cacheName] = this.cache[cacheName].set(id, requestedObject);

				resultArray[i] = requestedObject;
			}
		}

		return resultArray;
	}

	/**
	 *
	 * @param {*} value
	 * @param {String} cacheName
	 * @param {String} methodName
	 * @returns {Promise.<*>}
	 * @private
	 */
	async _getSingleData(value, cacheName, methodName) {
		const cacheValue = this.cache[cacheName].get(value);

		if (cacheValue) return cacheValue;

		try {
			const requestedObject = await this.wsApi.database[methodName](value);

			this.cache[cacheName] = this.cache[cacheName].set(value, requestedObject);

			return requestedObject;
		} catch (error) {
			throw error;
		}
	}

	/**
	 *  @method getObjects
	 *  @param  {Array<String>} objectIds
	 *  @return {Promise}
	 */
	getObjects(objectIds) {
		if (!isArray(objectIds)) return Promise.reject(new Error('ObjectIds should be a array'));
		if (objectIds.some((id) => !isObjectId(id))) return Promise.reject(new Error('ObjectIds should contain valid valid object ids'));

		return this._getArrayData(objectIds, 'objectsById', 'getObjects');
	}


	/**
	 *  @method getBlockHeader
	 *  @param  {Number} blockNum
	 *
	 *  @return {Promise}
	 */
	getBlockHeader(blockNum) {
		if (!isNonNegativeInteger(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));

		return this._getSingleData(blockNum, 'blockHeadersByBlockNumber', 'getBlockHeader');
	}

	/**
	 *  @method getBlock
	 *  @param  {Number} blockNum
	 *
	 *  @return {Promise}
	 */
	getBlock(blockNum) {
		if (!isNonNegativeInteger(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));

		return this._getSingleData(blockNum, 'blocks', 'getBlock');
	}

	/**
	 *  @method getTransaction
	 *  @param  {Number} blockNum
	 *  @param  {Number} transactionIndex
	 *
	 *  @return {Promise}
	 */
	async getTransaction(blockNum, transactionIndex) {
		// TODO
		this.wsApi.database.getTransaction(blockNum, transactionIndex);
	}

	/**
	 *  @method getChainProperties
	 *
	 *  @return {Promise}
	 */
	getChainProperties() {
		return this._getConfigurations('chainProperties', 'getChainProperties');
	}

	/**
	 *  @method getGlobalProperties
	 *
	 *  @return {Promise}
	 */
	getGlobalProperties() {
		return this._getConfigurations('globalProperties', 'getGlobalProperties');
	}

	/**
	 *  @method getConfig
	 *
	 *  @return {Promise}
	 */
	async getConfig() {
		return this._getConfigurations('config', 'getConfig');
	}

	/**
	 *  @method getChainId
	 *
	 *  @return {Promise}
	 */
	async getChainId() {
		return this._getConfigurations('chainId', 'getChainId');
	}

	/**
	 *  @method getDynamicGlobalProperties
	 *
	 *  @return {Promise}
	 */
	async getDynamicGlobalProperties() {
		return this._getConfigurations('dynamicGlobalProperties', 'getDynamicGlobalProperties');
	}

	/**
	 *  @method getKeyReferences
	 *  @param  {Array<String>} keys [public keys]
	 *
	 *  @return {Promise}
	 */
	getKeyReferences(keys) {
		if (!isArray(keys)) return Promise.reject(new Error('Keys should be a array'));
		if (keys.some((key) => !isPublicKey(key))) {
			return Promise.reject(new Error('Keys should contain valid public keys'));
		}

		return this._getArrayData(keys, 'accountIdsByKey', 'getKeyReferences');
	}

	/**
	 *  @method getAccounts
	 *  @param  {Array<String>} accountIds
	 *
	 *  @return {Promise}
	 */
	getAccounts(accountIds) {
		if (!isArray(accountIds)) return Promise.reject(new Error('Account ids should be an array'));
		if (accountIds.some((id) => !isAccountId(id))) return Promise.reject(new Error('Accounts should contain valid account ids'));

		return this._getArrayData(accountIds, 'accountsById', 'getKeyReferences');
	}

	/**
	 *  @method getFullAccounts
	 *  @param  {Array<String>} accountNamesOrIds
	 *  @param  {Boolean} subscribe
	 *
	 *  @return {Promise}
	 */
	async getFullAccounts(accountNamesOrIds, subscribe = true) {
		// TODO allow user to subscribe or not
		if (!isArray(accountNamesOrIds)) {
			return Promise.reject(new Error('Account names or ids should be an array'));
		}

		if (!accountNamesOrIds.evey((key) => isAccountId(key) || isAccountName(key))) {
			return Promise.reject(new Error('Accounts should contain valid account ids or names'));
		}

		if (!isBoolean(subscribe)) {
			return Promise.reject(new Error('Subscribe should be a boolean'));
		}

		const { length } = accountNamesOrIds;

		const resultArray = new Array(length).fill(null);
		let requestedObjects = [];

		for (let i = 0; i < length; i += 1) {

			const key = accountNamesOrIds[i];
			let cacheValue = null;

			if (isAccountId(key)) {
				cacheValue = this.cache.objectsById.get(key);
			} else {
				cacheValue = this.cache.accountsByName.get(key);
			}

			if (cacheValue) resultArray[i] = cacheValue;
			else requestedObjects.push(key);
		}

		try {
			requestedObjects = await Promise.all(this.wsApi.database.getFullAccounts(
				requestedObjects,
				subscribe,
			));
		} catch (error) {
			throw error;
		}

		for (let i = 0; i < length; i += 1) {
			if (!resultArray[i]) {
				const requestedObject = requestedObjects.shift();

				const key = accountNamesOrIds[i];

				if (isAccountId(key)) {
					this.cache.objectsById = this.cache.objectsById.set(key, requestedObject);
				} else {
					this.cache.accountsByName = this.cache.accountsByName.set(key, requestedObject);
				}

				resultArray[i] = requestedObject;
			}

		}

		return resultArray;
	}

	/**
	 *  @method getAccountByName
	 *  @param  {String} accountName
	 *
	 *  @return {Promise}
	 */
	getAccountByName(accountName) {
		if (!isAccountName(accountName)) return Promise.reject(new Error('Account name is invalid'));

		return this._getSingleData(accountName, 'accountsByName', 'getAccountByName');
	}

	/**
	 *  @method getAccountReferences
	 *  @param  {String} accountId
	 *
	 *  @return {Promise}
	 */
	getAccountReferences(accountId) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		// TODO
		return this.wsApi.database.getAccountReferences(accountId);
	}

	/**
	 *  @method lookupAccountNames
	 *  @param  {Array<String>} accountNames
	 *
	 *  @return {Promise}
	 */
	lookupAccountNames(accountNames) {
		if (!isArray(accountNames)) return Promise.reject(new Error('Account names should be an array'));
		if (accountNames.some((id) => !isAccountName(id))) return Promise.reject(new Error('Accounts should contain valid account names'));

		return this._getArrayData(accountNames, 'accountsByName', 'lookupAccountNames');
	}

	/**
	 *  @method lookupAccounts
	 *  @param  {String} lowerBoundName
	 *  @param  {Number} limit
	 *
	 *  @return {Promise}
	 */
	lookupAccounts(lowerBoundName, limit = 1000) {
		if (!isString(lowerBoundName)) return Promise.reject(new Error('Lower bound name should be a string'));
		if (!isNonNegativeInteger(limit) || limit > 1000) return Promise.reject(new Error('Limit should be a integer and must not exceed 1000'));

		return this.wsApi.database.lookupAccounts(lowerBoundName, limit);
	}

	/**
	 *  @method getAccountCount
	 *
	 *  @return {Promise}
	 */
	getAccountCount() {
		return this.wsApi.database.getAccountCount();
	}

	/**
	 *  @method getAccountBalances
	 *  @param  {String} accountId
	 *  @param  {Array<String>} assetIds
	 *
	 *  @return {Promise}
	 */
	getAccountBalances(accountId, assetIds) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isArray(assetIds)) return Promise.reject(new Error('Asset ids should be an array'));
		if (assetIds.some((id) => !isAssetId(id))) return Promise.reject(new Error('Asset ids contain valid asset ids'));
		// TODO
		return this.wsApi.database.getAccountBalances(accountId, assetIds);
	}

	/**
	 *  @method getNamedAccountBalances
	 *  @param  {String} accountName
	 *  @param  {Array<String>} assetIds
	 *
	 *  @return {Promise}
	 */
	getNamedAccountBalances(accountName, assetIds) {
		if (!isAccountName(accountName)) return Promise.reject(new Error('Account name is invalid'));
		if (!isArray(assetIds)) return Promise.reject(new Error('Asset ids should be an array'));
		if (assetIds.some((id) => !isAssetId(id))) return Promise.reject(new Error('Asset ids should contain valid asset ids'));

		return this.wsApi.database.getNamedAccountBalances(accountName, assetIds);
	}

	/**
	 *  @method getVestedBalances
	 *  @param  {Array<String>} balanceIds
	 *
	 *  @return {Promise}
	 */
	getVestedBalances(balanceIds) {
		if (!isArray(balanceIds)) return Promise.reject(new Error('Balance ids should be an array'));
		if (balanceIds.some((id) => !isBalanceId(id))) return Promise.reject(new Error('Balance ids should contain valid balance ids'));

		return this.wsApi.database.getVestedBalances(balanceIds);
	}

	/**
	 *  @method getVestingBalances
	 *  @param  {String} accountId
	 *
	 *  @return {Promise}
	 */
	getVestingBalances(accountId) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));

		return this.wsApi.database.getVestingBalances(accountId);
	}

	/**
	 *  @method getAssets
	 *  @param  {Array<String>} assetIds
	 *
	 *  @return {Promise}
	 */
	getAssets(assetIds) {
		if (!isArray(assetIds)) return Promise.reject(new Error('Asset ids should be an array'));
		if (assetIds.some((id) => !isAssetId(id))) return Promise.reject(new Error('Assets ids should contain valid asset ids'));

		return this._getArrayData(assetIds, 'assetByAssetId', 'getAssets');
	}

	/**
	 *  @method listAssets
	 *  @param  {String} lowerBoundSymbol
	 *  @param  {Number} limit
	 *
	 *  @return {Promise}
	 */
	listAssets(lowerBoundSymbol, limit = 100) {
		if (!isStringSymbol(lowerBoundSymbol)) return Promise.reject(new Error('Lower bound symbol should be a one length string'));
		if (!isNonNegativeInteger(limit) || limit > 100) return Promise.reject(new Error('Limit should be a integer and must not exceed 100'));

		return this.wsApi.database.listAssets(lowerBoundSymbol, limit);
	}

	/**
	 *  @method lookupAssetSymbols
	 *  @param  {Array<String>} symbolsOrIds
	 *
	 *  @return {Promise}
	 */
	lookupAssetSymbols(symbolsOrIds) { // TODO rework
		if (!isArray(symbolsOrIds)) return Promise.reject(new Error('Symbols or ids should be an array'));

		if (symbolsOrIds.every((id) => isAssetId(id))) {
			return this._getArrayData(symbolsOrIds, 'assetByAssetId', 'lookupAssetSymbols');
		} else if (symbolsOrIds.every((symbol) => isStringSymbol(symbol))) {
			return this.wsApi.database.lookupAssetSymbols(symbolsOrIds);
		}

		return Promise.reject(new Error('Symbols or ids should contain valid asset ids or string symbol'));
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
		if (!isValidAssetName(baseAssetName)) return Promise.reject(new Error('Base asset name is invalid'));
		if (!isValidAssetName(quoteAssetName)) return Promise.reject(new Error('Quote asset name is invalid'));
		if (!isNonNegativeInteger(depth) || depth > 50) return Promise.reject(new Error('Depth should be a integer and must not exceed 50'));

		return this.wsApi.database.getOrderBook(baseAssetName, quoteAssetName, depth);
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
		if (!isAssetId(baseAssetId)) return Promise.reject(new Error('Base asset id is invalid'));
		if (!isAssetId(quoteAssetId)) return Promise.reject(new Error('Quote asset id is invalid'));
		if (!isNonNegativeInteger(limit)) return Promise.reject(new Error('Limit should be a integer'));

		return this.wsApi.database.getLimitOrders(baseAssetId, quoteAssetId, limit);
	}

	/**
	 *  @method getCallOrders
	 *  @param  {String} assetId
	 *  @param  {Number} limit
	 *
	 *  @return {Promise}
	 */
	getCallOrders(assetId, limit) {
		if (!isAssetId(assetId)) return Promise.reject(new Error('Asset id is invalid'));
		if (!isNonNegativeInteger(limit)) return Promise.reject(new Error('Limit should be a integer'));

		return this.wsApi.database.getCallOrders(assetId, limit);
	}

	/**
	 *  @method getSettleOrders
	 *  @param  {String} assetId
	 *  @param  {Number} limit
	 *
	 *  @return {Promise}
	 */
	getSettleOrders(assetId, limit) {
		if (!isAssetId(assetId)) return Promise.reject(new Error('Asset id is invalid'));
		if (!isNonNegativeInteger(limit)) return Promise.reject(new Error('Limit should be a integer'));

		return this.wsApi.database.getSettleOrders(assetId, limit);
	}

	/**
	 *  @method getMarginPositions
	 *  @param  {String} accountId
	 *
	 *  @return {Promise}
	 */
	getMarginPositions(accountId) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));

		return this.wsApi.database.getMarginPositions(accountId);
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
		if (!isValidAssetName(baseAssetName)) return Promise.reject(new Error('Base asset name is invalid'));
		if (!isValidAssetName(quoteAssetName)) return Promise.reject(new Error('Quote asset name is invalid'));

		return this.wsApi.database.getTicker(baseAssetName, quoteAssetName);
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
		if (!isValidAssetName(baseAssetName)) return Promise.reject(new Error('Base asset name is invalid'));
		if (!isValidAssetName(quoteAssetName)) return Promise.reject(new Error('Quote asset name is invalid'));

		return this.wsApi.database.get24Volume(baseAssetName, quoteAssetName);
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
		if (!isValidAssetName(baseAssetName)) return Promise.reject(new Error('Base asset name is invalid'));
		if (!isValidAssetName(quoteAssetName)) return Promise.reject(new Error('Quote asset name is invalid'));
		if (!isNonNegativeInteger(start)) return Promise.reject(new Error('Start should be UNIX timestamp'));
		if (!isNonNegativeInteger(stop)) return Promise.reject(new Error('Stop should be UNIX timestamp'));
		if (!isNonNegativeInteger(limit)) return Promise.reject(new Error('Limit should be capped at 100'));

		return this.wsApi.database.getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit);
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
		return this.wsApi.database.getAllContracts();
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

	/**
	 *  @method broadcastTransaction
	 * 	Broadcast a transaction to the network.
	 *
	 * 	@param  {Object} tr
	 *  	transaction: {
	 *  		ref_block_num,
	 *  		ref_block_prefix,
	 *  		operations,
	 *  		signatures,
	 *  	}
	 *
	 *  @return {Promise}
	 */
	broadcastTransaction(tr) {
		if (!tr) {
			return Promise.reject(new Error('Transaction is required'));
		}

		if (!tr.ref_block_num || !tr.ref_block_prefix || !tr.operations || !tr.signatures) {
			return Promise.reject(new Error('Invalid transaction'));
		}

		return this.wsApi.network.broadcastTransaction(tr);
	}

	/**
	 *  @method broadcastBlock
	 * 	Broadcast a block to the network.
	 *
	 *  @param  {Object} block
	 *  	block: {
	 *  		previous: previous-block-id,
	 *  		timestamp: block-timestamp,
	 *  		witness: "witness-id",
	 *  		transaction_merkle_root: "merkle-root",
	 *  		state_root_hash: "hash",
	 *  		result_root_hash: "result-hash",
	 *  		witness_signature: "sig",
	 *  		ed_signature: "eddsa signature",
	 *  		verifications: [{witness-id, witness-signature}],
	 *  		round: round-id,
	 *  		rand: rand,
	 *  		cert: "certificate",
	 *  		transactions: [{ref_block_num, ref_block_prefix, operations, signatures}],
	 *  	}
	 *
	 *  @return {Promise}
	 */
	broadcastBlock(block) {
		if (!block) {
			return Promise.reject(new Error('Block is required'));
		}

		if (!block.previous || !block.timestamp || !block.witness) {
			return Promise.reject(new Error('Invalid block'));
		}

		return this.wsApi.network.broadcastBlock(block);
	}

	/**
	 *  @method getAssetHolders
	 *  Retrieve the information about the holders of the specified asset.
	 *
	 *  @param {String} assetId   [asset id to retrieve]
	 *  @param {Number} start [account id to start retreiving from]
	 *  @param {Number} limit     [count accounts (max 100)]
	 */
	getAssetHolders(assetId, start, limit = 100) {
		if (!isAssetId(assetId)) {
			return Promise.reject(new Error('Invalid Asset ID'));
		}

		if (!isNumber(start)) {
			return Promise.reject(new Error('Invalid start account number'));
		}

		if (!isNumber(limit)) {
			return Promise.reject(new Error('Invalid limit accounts number'));
		}

		return this.wsApi.asset.getAssetHolders(assetId, start, limit);
	}

	/**
	 *  @method getAssetHoldersCount
	 *  Retrieve the number of holders of the provided asset.
	 *
	 *  @param {String} assetId   [asset id to retrieve]
	 */
	getAssetHoldersCount(assetId) {
		if (!isAssetId(assetId)) {
			return Promise.reject(new Error('Invalid Asset ID'));
		}

		return this.wsApi.asset.getAssetHoldersCount(assetId);
	}

	/**
	 *  @method getAllAssetHolders
	 *  Array of all asset IDs with the number of holders.
	 *
	 */
	getAllAssetHolders() {
		return this.wsApi.asset.getAllAssetHolders();
	}

}

export default API;
