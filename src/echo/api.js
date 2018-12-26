/* eslint-disable no-continue,max-len */
import {
	isArray,
	isObjectId,
	isBoolean,
	isAssetName,
	isAccountId,
	isUInt64,
	isAccountName,
	isString,
	isAssetId,
	isAccountBalanceId,
	isContractId,
	isContractResultId,
	isBytecode,
	isRipemd160,
	isTransaction,
	isSignedTransaction,
	isPublicKey,
	isVoteId,
	isOperation,
} from '../utils/validator';

class API {

	/**
     *
     * @param {Cache} cache
     * @param {WSAPI} wsApi
     */
	constructor(cache, wsApi) {
		this.cache = cache;
		this.wsApi = wsApi;
	}

	/**
	 *
     * @param {String} cacheName
     * @param {String} methodName
     * @param {Boolean} force
     *
     * @returns {Promise.<*>}
     * @private
     */
	async _getConfigurations(cacheName, methodName, force = false) {
		if (!force) {
			const cacheValue = this.cache[cacheName];

			if (cacheValue) return cacheValue;
		}

		try {
			const requestedObject = await this.wsApi.database[methodName]();

			return this.cache.set(cacheName, requestedObject);
		} catch (error) {
			throw error;
		}
	}

	/**
	 *
     * @param {Array} array
     * @param {String} cacheName
     * @param {String} methodName
     * @param {Boolean} force
     *
     * @returns {Promise.<Array.<*>>}
     * @private
     */
	async _getArrayData(array, cacheName, methodName, force = false) {
		const { length } = array;

		const resultArray = new Array(length).fill(null);
		const requestedObjectsKeys = [];

		for (let i = 0; i < length; i += 1) {
			const key = array[i];

			if (!force) {
				const cacheValue = this.cache[cacheName].get(key);

				if (cacheValue) {
					resultArray[i] = cacheValue;
					continue;
				}
			}

			requestedObjectsKeys.push(key);
		}

		let requestedObjects;

		try {
			requestedObjects = await Promise.all(this.wsApi.database[methodName](requestedObjectsKeys));
		} catch (error) {
			throw error;
		}

		for (let i = 0; i < length; i += 1) {
			if (resultArray[i]) continue;
			const key = requestedObjectsKeys.shift();
			const requestedObject = requestedObjects.shift();

			resultArray[i] = this.cache.setInMap(cacheName, key, requestedObject);
		}

		return resultArray;
	}

	/**
	 *
     * @param {*} value
     * @param {String} cacheName
     * @param {String} methodName
     * @param {Boolean} force
     *
     * @returns {Promise.<*>}
     * @private
     */
	async _getSingleData(key, cacheName, methodName, force = false) {
		if (!force) {
			const cacheValue = this.cache[cacheName].get(key);

			if (cacheValue) return cacheValue;
		}

		try {
			const requestedObject = await this.wsApi.database[methodName](key);

			return this.cache.setInMap(cacheName, key, requestedObject);
		} catch (error) {
			throw error;
		}
	}

	/**
     *
     * @param {String} key
     * @param {String} cacheName
     * @param {String} methodName
     * @param {Boolean} force
     * @param {...Array} params
     *
     * @returns {Promise.<*>}
     * @private
     */
	async _getSingleDataByCompositeParams(key, cacheName, methodName, force = false, ...params) {
		if (!force) {
			const cacheValue = this.cache[cacheName].get(key);

			if (cacheValue) return cacheValue;
		}

		try {
			const value = await this.wsApi.database[methodName](...params);

			return this.cache.setInMap(cacheName, key, value);
		} catch (error) {
			throw error;
		}
	}

	/**
     *  @method getObjects
     *  @param  {Array<String>} objectIds
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getObjects(objectIds, force = false) {
		if (!isArray(objectIds)) return Promise.reject(new Error('ObjectIds should be a array'));
		if (objectIds.some((id) => !isObjectId(id))) return Promise.reject(new Error('ObjectIds should contain valid valid object ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getArrayData(objectIds, 'objectsById', 'getObjects', force);
	}

	/**
     *  @method getBlockHeader
     *  @param  {Number} blockNum
     *
     *  @return {Promise}
     */
	getBlockHeader(blockNum) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));

		return this._getSingleData(blockNum, 'blockHeadersByBlockNumber', 'getBlockHeader');
	}

	/**
     *  @method getBlock
     *  @param  {Number} blockNum
     *
     *  @return {Promise}
     */
	getBlock(blockNum) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));

		return this._getSingleData(blockNum, 'blocks', 'getBlock');
	}

	/**
     *  @method getTransaction
     *  @param  {Number} blockNum
     *  @param  {Number} transactionIndex
     *
     *  @return {Promise}
     */
	getTransaction(blockNum, transactionIndex) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));
		if (!isUInt64(transactionIndex)) return Promise.reject(new Error('TransactionIndex should be a non negative integer'));

		const key = `${blockNum}:${transactionIndex}`;

		return this._getSingleDataByCompositeParams(key, 'transactionsByBlockAndIndex', 'getTransaction', false, blockNum, transactionIndex);
	}

	/**
     *  @method getChainProperties
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getChainProperties(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations('chainProperties', 'getChainProperties', force);
	}

	/**
     *  @method getGlobalProperties
     *
     *  @return {Promise}
     */
	getGlobalProperties() {
		return this.wsApi.database.getGlobalProperties();
	}

	/**
     *  @method getConfig
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	async getConfig(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations('config', 'getConfig', force);
	}

	/**
     *  @method getChainId
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	async getChainId(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations('chainId', 'getChainId', force);
	}

	/**
     *  @method getDynamicGlobalProperties
     *
     *  @return {Promise}
     */
	async getDynamicGlobalProperties() {
		return this.wsApi.database.getDynamicGlobalProperties();
	}

	/**
     *  @method getKeyReferences
     *  @param  {Array<String>} keys [public keys]
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getKeyReferences(keys, force = false) {
		if (!isArray(keys)) return Promise.reject(new Error('Keys should be a array'));
		if (keys.some((key) => !isPublicKey(key))) return Promise.reject(new Error('Keys should contain valid public keys'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getArrayData(keys, 'accountIdByKey', 'getKeyReferences', force);
	}

	/**
     *  @method getAccounts
     *  @param  {Array<String>} accountIds
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getAccounts(accountIds, force = false) {
		if (!isArray(accountIds)) return Promise.reject(new Error('Account ids should be an array'));
		if (accountIds.some((id) => !isAccountId(id))) return Promise.reject(new Error('Accounts should contain valid account ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getArrayData(accountIds, 'accountsById', 'getKeyReferences', force);
	}

	/**
     *  @method getFullAccounts
     *  @param  {Array<String>} accountNamesOrIds
     *  @param  {Boolean} subscribe
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	async getFullAccounts(accountNamesOrIds, subscribe = true, force = false) {
		if (!isArray(accountNamesOrIds)) return Promise.reject(new Error('Account names or ids should be an array'));
		if (!accountNamesOrIds.every((key) => isAccountId(key) || isAccountName(key))) return Promise.reject(new Error('Accounts should contain valid account ids or names'));
		if (!isBoolean(subscribe)) return Promise.reject(new Error('Subscribe should be a boolean'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

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
			requestedObjects = await Promise.all(this.wsApi.database.getFullAccounts(requestedObjects, true));
		} catch (error) {
			throw error;
		}

		for (let i = 0; i < length; i += 1) {
			if (resultArray[i]) continue;

			const requestedObject = requestedObjects.shift();

			const key = accountNamesOrIds[i];

			if (isAccountId(key)) {
				this.cache.objectsById = this.cache.objectsById.set(key, requestedObject);
			} else {
				this.cache.accountsByName = this.cache.accountsByName.set(key, requestedObject);
			}

			resultArray[i] = requestedObject;
		}

		return resultArray;
	}

	/**
     *  @method getAccountByName
     *  @param  {String} accountName
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getAccountByName(accountName, force = false) {
		if (!isAccountName(accountName)) return Promise.reject(new Error('Account name is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleData(accountName, 'accountsByName', 'getAccountByName', force);
	}

	/**
     *  @method getAccountReferences
     *  @param  {String} accountId
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getAccountReferences(accountId, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this.wsApi.database.getAccountReferences(accountId);
	}

	/**
     *  @method lookupAccountNames
     *  @param  {Array<String>} accountNames
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	lookupAccountNames(accountNames, force = false) {
		if (!isArray(accountNames)) return Promise.reject(new Error('Account names should be an array'));
		if (accountNames.some((id) => !isAccountName(id))) return Promise.reject(new Error('Accounts should contain valid account names'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

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
		if (!isUInt64(limit) || limit > 1000) return Promise.reject(new Error('Limit should be a integer and must not exceed 1000'));

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
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getAccountBalances(accountId, assetIds, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isArray(assetIds)) return Promise.reject(new Error('Asset ids should be an array'));
		if (assetIds.some((id) => !isAssetId(id))) return Promise.reject(new Error('Asset ids contain valid asset ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));
		// TODO save it to cache or not
		return this.wsApi.database.getAccountBalances(accountId, assetIds);
	}

	/**
     *  @method getNamedAccountBalances
     *  @param  {String} accountName
     *  @param  {Array<String>} assetIds
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getNamedAccountBalances(accountName, assetIds, force = false) {
		if (!isAccountName(accountName)) return Promise.reject(new Error('Account name is invalid'));
		if (!isArray(assetIds)) return Promise.reject(new Error('Asset ids should be an array'));
		if (assetIds.some((id) => !isAssetId(id))) return Promise.reject(new Error('Asset ids should contain valid asset ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

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
		if (balanceIds.some((id) => !isAccountBalanceId(id))) return Promise.reject(new Error('Balance ids should contain valid balance ids'));

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
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getAssets(assetIds, force = false) {
		if (!isArray(assetIds)) return Promise.reject(new Error('Asset ids should be an array'));
		if (assetIds.some((id) => !isAssetId(id))) return Promise.reject(new Error('Assets ids should contain valid asset ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

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
		if (!isAssetName(lowerBoundSymbol)) return Promise.reject(new Error('Lower bound symbol is invalid'));
		if (!isUInt64(limit) || limit > 100) return Promise.reject(new Error('Limit should be a integer and must not exceed 100'));

		return this.wsApi.database.listAssets(lowerBoundSymbol, limit);
	}

	/**
     *  @method lookupAssetSymbols
     *  @param  {Array<String>} symbolsOrIds
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	async lookupAssetSymbols(symbolsOrIds, force = false) {

		if (!isArray(symbolsOrIds)) return Promise.reject(new Error('Symbols or ids should be an array'));

		if (!symbolsOrIds.every((key) => isAssetId(key) || isAccountName(key))) throw new Error('Symbols or ids should contain valid asset ids or symbol');
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const { length } = symbolsOrIds;

		const resultArray = new Array(length).fill(null);
		let requestedObjects = [];

		for (let i = 0; i < length; i += 1) {

			const key = symbolsOrIds[i];
			let cacheValue = null;

			if (isAssetId(key)) {
				cacheValue = this.cache.assetByAssetId.get(key);
			} else {
				cacheValue = this.cache.assetBySymbol.get(key);
			}

			if (cacheValue) resultArray[i] = cacheValue;
			else requestedObjects.push(key);
		}

		try {
			requestedObjects = await Promise.all(this.wsApi.database.lookupAssetSymbols(requestedObjects));
		} catch (error) {
			throw error;
		}

		for (let i = 0; i < length; i += 1) {
			if (resultArray[i]) continue;

			const requestedObject = requestedObjects.shift();

			const key = symbolsOrIds[i];

			if (isAssetId(key)) {
				this.cache.objectsById = this.cache.assetByAssetId.set(key, requestedObject);
			} else {
				this.cache.accountsByName = this.cache.accountsByName.set(key, requestedObject);
			}

			resultArray[i] = requestedObject;
		}

		return resultArray;
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
		if (!isAssetName(baseAssetName)) return Promise.reject(new Error('Base asset name is invalid'));
		if (!isAssetName(quoteAssetName)) return Promise.reject(new Error('Quote asset name is invalid'));
		if (!isUInt64(depth) || depth > 50) return Promise.reject(new Error('Depth should be a integer and must not exceed 50'));

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
		if (!isUInt64(limit)) return Promise.reject(new Error('Limit should be a integer'));

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
		if (!isUInt64(limit)) return Promise.reject(new Error('Limit should be a integer'));

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
		if (!isUInt64(limit)) return Promise.reject(new Error('Limit should be a integer'));

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
		if (!isAssetName(baseAssetName)) return Promise.reject(new Error('Base asset name is invalid'));
		if (!isAssetName(quoteAssetName)) return Promise.reject(new Error('Quote asset name is invalid'));

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
		if (!isAssetName(baseAssetName)) return Promise.reject(new Error('Base asset name is invalid'));
		if (!isAssetName(quoteAssetName)) return Promise.reject(new Error('Quote asset name is invalid'));

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
		if (!isAssetName(baseAssetName)) return Promise.reject(new Error('Base asset name is invalid'));
		if (!isAssetName(quoteAssetName)) return Promise.reject(new Error('Quote asset name is invalid'));
		if (!isUInt64(start)) return Promise.reject(new Error('Start should be UNIX timestamp'));
		if (!isUInt64(stop)) return Promise.reject(new Error('Stop should be UNIX timestamp'));
		if (!isUInt64(limit)) return Promise.reject(new Error('Limit should be capped at 100'));

		return this.wsApi.database.getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit);
	}

	/**
     *  @method getWitnesses
     *
     *  @param  {Array<String>} witnessIds
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getWitnesses(witnessIds, force = false) {
		if (!isArray(witnessIds)) return Promise.reject(new Error('Witness ids should be an array'));
		if (witnessIds.some((id) => !isObjectId(id))) return Promise.reject(new Error('Witness ids should contain valid object ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getArrayData(witnessIds, 'witnessByAccountId', 'getWitnesses', force);
	}

	/**
     *  @method getWitnessByAccount
     *
     *  @param  {String} accountId
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getWitnessByAccount(accountId, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleData(accountId, 'witnessByAccountId', 'getWitnessByAccount', force);
	}

	/**
     *  @method lookupWitnessAccounts
     *
     *  @param  {String} lowerBoundName
     *  @param  {Number} limit
     *
     *  @return {Promise}
     */
	lookupWitnessAccounts(lowerBoundName, limit = 1000) {
		if (!isString(lowerBoundName)) return Promise.reject(new Error('LowerBoundName should be string'));
		if (!isUInt64(limit) || limit > 1000) return Promise.reject(new Error('Limit should be capped at 1000'));

		return this.wsApi.database.lookupWitnessAccounts(lowerBoundName, limit);
	}

	/**
     *  @method getWitnessCount
     *
     *  @return {Promise}
     */
	getWitnessCount() {
		return this.wsApi.database.getWitnessCount();
	}

	/**
     *  @method getCommitteeMembers
     *
     *  @param  {Array<String>} committeeMemberIds
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getCommitteeMembers(committeeMemberIds, force = false) {
		if (!isArray(committeeMemberIds)) return Promise.reject(new Error('CommitteeMemberIds ids should be an array'));
		if (committeeMemberIds.some((id) => !isObjectId(id))) return Promise.reject(new Error('CommitteeMemberIds should contain valid object ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getArrayData(committeeMemberIds, 'committeeByAccountId', 'getCommitteeMembers', force);
	}

	/**
     *  @method getCommitteeMemberByAccount
     *
     *  @param  {String} accountId
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getCommitteeMemberByAccount(accountId, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleData(accountId, 'committeeByAccountId', 'getCommitteeMemberByAccount', force);
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
		if (!isString(lowerBoundName)) return Promise.reject(new Error('LowerBoundName should be string'));
		if (!isUInt64(limit) || limit > 1000) return Promise.reject(new Error('Limit should be capped at 1000'));

		return this.wsApi.database.lookupCommitteeMemberAccounts(lowerBoundName, limit);
	}

	/**
     *  @method getWorkersByAccount
     *
     *  @param  {String} accountId
     *
     *  @return {Promise}
     */
	getWorkersByAccount(accountId) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));

		return this.wsApi.database.getWorkersByAccount(accountId);
	}

	/**
     *  @method lookupVoteIds
     *
     *  @param  {Array<Strings>} votes
     *
     *  @return {Promise}
     */
	lookupVoteIds(votes) {
		if (!isArray(votes)) return Promise.reject(new Error('Votes should be an array'));
		if (votes.some((id) => !isVoteId(id))) return Promise.reject(new Error('Votes should contain valid vote_id_type ids'));


		return this.wsApi.database.lookupVoteIds(votes);
	}

	/**
     *  @method getTransactionHex
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise}
     */
	getTransactionHex(transaction) {
		if (!isSignedTransaction(transaction)) return Promise.reject(new Error('Transaction is invalid'));

		// transaction is signed
		return this.wsApi.database.getTransactionHex(transaction);
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
		if (!isTransaction(transaction)) return Promise.reject(new Error('Transaction is invalid'));
		if (!isArray(availableKeys)) return Promise.reject(new Error('Available keys ids should be an array'));
		if (availableKeys.some((key) => !isPublicKey(key))) return Promise.reject(new Error('\'Available keys should contain valid public keys'));

		return this.wsApi.database.getRequiredSignatures(transaction, availableKeys);
	}

	/**
     *  @method getPotentialSignatures
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise}
     */
	getPotentialSignatures(transaction) {
		if (!isTransaction(transaction)) return Promise.reject(new Error('Transaction is invalid'));

		return this.wsApi.database.getPotentialSignatures(transaction);
	}

	/**
     *  @method verifyAuthority
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise}
     */
	verifyAuthority(transaction) {
		if (!isTransaction(transaction)) return Promise.reject(new Error('Transaction is invalid'));

		return this.wsApi.database.verifyAuthority(transaction);
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
		if (!(isAccountName(accountNameOrId) || isAccountId(accountNameOrId))) return Promise.reject(new Error('Account name or id is invalid'));
		if (!isArray(signers)) return Promise.reject(new Error('Signers ids should be an array'));
		if (signers.some((key) => !isPublicKey(key))) return Promise.reject(new Error('Signers should contain valid public keys'));

		return this.wsApi.database.verifyAccountAuthority(accountNameOrId, signers);
	}

	/**
     *  @method validateTransaction
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise}
     */
	validateTransaction(transaction) {
		if (!isSignedTransaction(transaction)) return Promise.reject(new Error('Transaction is invalid'));

		// signed transaction
		return this.wsApi.database.validateTransaction(transaction);
	}

	/**
     *  @method getRequiredFees
     *
     *  @param  {Array<Object>} operations
     *  @param  {String} assetId
     *
     *  @return {Promise}
     */
	getRequiredFees(operations, assetId = '1.3.0') {
		if (!isArray(operations)) return Promise.reject(new Error('Operations should be an array'));
		if (operations.some((op) => !isOperation(op))) return Promise.reject(new Error('Operations should contain valid operations'));
		if (!isAssetId(assetId)) return Promise.reject(new Error('Asset id is invalid'));

		return this.wsApi.database.getRequiredFees(operations, assetId);
	}

	/**
     *  @method getProposedTransactions
     *
     *  @param  {String} accountNameOrId
     *
     *  @return {Promise}
     */
	getProposedTransactions(accountNameOrId) {
		if (!(isAccountId(accountNameOrId) || isAccountName(accountNameOrId))) return Promise.reject(new Error('AccountNameOrId is invalid'));

		return this.wsApi.database.getProposedTransactions(accountNameOrId);
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
		if (!isContractId(contractId)) return Promise.reject(new Error('ContractId is invalid'));
		if (!isUInt64(fromBlock)) return Promise.reject(new Error('FromBlock should be a non negative integer'));
		if (!isUInt64(toBlock)) return Promise.reject(new Error('ToBlock should be a non negative integer'));
		if (fromBlock > toBlock) return Promise.reject(new Error('FromBlock should be less then toBlock'));

		return this.wsApi.database.getContractLogs(contractId, fromBlock, toBlock);
	}

	/**
     *  @method getContractResult
     *
     *  @param  {String} resultContractId
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getContractResult(resultContractId, force = false) {
		if (!isContractResultId(resultContractId)) return Promise.reject(new Error('Result contract id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleData(resultContractId, 'contractResultByContractResultId', 'getContractResult', force);
	}

	/**
     *  @method getContract
     *
     *  @param  {String} contractId
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getContract(contractId, force = false) {
		if (!isContractId(contractId)) return Promise.reject(new Error('Contract id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleData(contractId, 'contractByContractId', 'getContract', force);
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
		if (!isContractId(contractId)) return Promise.reject(new Error('ContractId is invalid'));
		if (!isAccountId(accountId)) return Promise.reject(new Error('AccountId is invalid'));
		if (!isAssetId(assetId)) return Promise.reject(new Error('AssetId is invalid'));
		if (!isBytecode(bytecode)) return Promise.reject(new Error('Bytecode is invalid'));

		return this.wsApi.database.callContractNoChangingState(contractId, accountId, assetId, bytecode);
	}

	/**
     *  @method getContracts
     *
     *  @param  {Array<String>} contractIds
     *
     *  @return {Promise}
     */
	getContracts(contractIds) {
		if (!isArray(contractIds)) return Promise.reject(new Error('ContractIds ids should be an array'));
		if (contractIds.some((id) => !isContractId(id))) return Promise.reject(new Error('ContractIds should contain valid contract ids'));

		return this.wsApi.database.getContracts(contractIds);
	}

	/**
     *  @method getContractBalances
     *
     *  @param  {String} contractId
     *  @param {Boolean} force
     *
     *  @return {Promise}
     */
	getContractBalances(contractId, force = false) {
		if (!isContractId(contractId)) return Promise.reject(new Error('ContractId is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleData(contractId, 'contractBalanceByContractId', 'getContractBalances', force);
	}

	/**
     *  @method getRecentTransactionById
     *
     *  @param  {String} transactionId
     *
     *  @return {Promise}
     */
	getRecentTransactionById(transactionId) {
		if (!isRipemd160(transactionId)) return Promise.reject(new Error('Transaction id should be a 20 bytes hex string'));

		return this.wsApi.database.getRecentTransactionById(transactionId);
	}

}

export default API;
