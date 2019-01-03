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
	isBalanceId,
	isContractId,
	isContractResultId,
	isBytecode,
	isRipemd160,
	isPublicKey,
	isVoteId, isWitnessId, isCommitteeMemberId,
} from '../utils/validator';

import { Transactions, Operations } from '../serializer/operations';

import {
	LOOKUP_ACCOUNTS_DEFAULT_LIMIT, LOOKUP_ACCOUNTS_MAX_LIMIT,
	LIST_ASSETS_DEFAULT_LIMIT, LIST_ASSETS_MAX_LIMIT,
	GET_TRADE_HISTORY_DEFAULT_LIMIT, GET_TRADE_HISTORY_MAX_LIMIT,
	LOOKUP_WITNESS_ACCOUNTS_DEFAULT_LIMIT, LOOKUP_WITNESS_ACCOUNTS_MAX_LIMIT,
	COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT, COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT,
} from '../constants/api-config';

import * as CacheMaps from '../constants/cache-maps';

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

			if (cacheValue) {
				return cacheValue;
			}
		}

		try {
			const requestedObject = await this.wsApi.database[methodName]();

			this.cache.set(cacheName, requestedObject);

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
     * @param {Boolean} force
     * @param {Object} cacheParams
     *
     * @returns {Promise.<Array.<*>>}
     * @private
     */
	async _getArrayDataWithMultiSave(array, cacheName, methodName, force = false, cacheParams = []) {
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
			requestedObjects = await this.wsApi.database[methodName](requestedObjectsKeys);
		} catch (error) {
			throw error;
		}

		for (let i = 0; i < length; i += 1) {
			if (resultArray[i]) continue;
			const key = requestedObjectsKeys.shift();
			const requestedObject = requestedObjects.shift();

			resultArray[i] = requestedObject;
			if (!requestedObject) {
				continue;
			}

			this.cache.setInMap(cacheName, key, requestedObject);
			cacheParams.forEach(({ param, cache }) => this.cache.setInMap(cache, requestedObject[param], requestedObject));
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
	async _getSingleDataWithMultiSave(key, cacheName, methodName, force = false, cacheParams = []) {
		if (!force) {
			const cacheValue = this.cache[cacheName].get(key);

			if (cacheValue) {
				return cacheValue;
			}
		}

		try {
			const requestedObject = await this.wsApi.database[methodName](key);

			if (!requestedObject) {
				return requestedObject;
			}

			cacheParams.forEach(({ param, cache }) => this.cache.setInMap(cache, requestedObject[param], requestedObject));

			this.cache.setInMap(cacheName, key, requestedObject);

			return requestedObject;
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

			if (cacheValue) {
				return cacheValue;
			}
		}

		try {
			const requestedObject = await this.wsApi.database[methodName](...params);

			if (!requestedObject) {
				return requestedObject;
			}

			this.cache.setInMap(cacheName, key, requestedObject);

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
     * @param {Boolean} force
     * @returns {Promise.<Array.<*>>}
     * @private
     */
	async _getObjectsById(array, cacheName, methodName, force = false) {
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
			requestedObjects = await this.wsApi.database[methodName](requestedObjectsKeys);
		} catch (error) {
			throw error;
		}

		for (let i = 0; i < length; i += 1) {
			if (resultArray[i]) continue;
			const key = requestedObjectsKeys.shift();
			const requestedObject = requestedObjects.shift();

			resultArray[i] = requestedObject;
			if (!requestedObject) {
				continue;
			}

			if (isAccountId(key)) {
				const nameKey = requestedObject.name;

				this.cache.setInMap(CacheMaps.ACCOUNTS_BY_ID, key, requestedObject)
					.setInMap(CacheMaps.ACCOUNTS_BY_NAME, nameKey, requestedObject);

			} else if (isAssetId(key)) {
				const nameKey = requestedObject.symbol;

				this.cache.setInMap(CacheMaps.ASSET_BY_ASSET_ID, key, requestedObject)
					.setInMap(CacheMaps.ASSET_BY_SYMBOL, nameKey, requestedObject);

			} else if (isWitnessId(key)) {

				this.cache.setInMap(CacheMaps.WITNESS_BY_WITNESS_ID, key, requestedObject);

			} else if (isCommitteeMemberId(key)) {

				this.cache.setInMap(CacheMaps.COMMITTEE_MEMBERS_BY_COMMITTEE_MEMBER_ID, key, requestedObject);

			}

			this.cache.setInMap(cacheName, key, requestedObject);
		}

		return resultArray;
	}

	/**
     *  @method getObjects
     *  @param  {Array<String>} objectIds
     *  @param {Boolean} force
     *
     *  @returns {Promise.<Array.<*>>}
     */
	getObjects(objectIds, force = false) {
		if (!isArray(objectIds)) return Promise.reject(new Error('ObjectIds should be a array'));
		if (!objectIds.every((id) => isObjectId(id))) return Promise.reject(new Error('ObjectIds should contain valid valid object ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getObjectsById(objectIds, CacheMaps.OBJECTS_BY_ID, 'getObjects', force);
	}

	/**
     *  @method getBlockHeader
     *  @param  {Number} blockNum
     *
     *  @returns {Promise.<Object>}
     */
	getBlockHeader(blockNum) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));

		return this._getSingleDataWithMultiSave(blockNum, CacheMaps.BLOCK_HEADERS_BY_BLOCK_NUMBER, 'getBlockHeader');
	}

	/**
     *  @method getBlock
     *  @param  {Number} blockNum
     *
     *  @returns {Promise.<Object>}
     */
	getBlock(blockNum) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));

		return this._getSingleDataWithMultiSave(blockNum, CacheMaps.BLOCKS, 'getBlock');
	}

	/**
     *  @method getTransaction
     *  @param  {Number} blockNum
     *  @param  {Number} transactionIndex
     *
     *  @returns {Promise.<Object>}
     */
	getTransaction(blockNum, transactionIndex) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));
		if (!isUInt64(transactionIndex)) return Promise.reject(new Error('TransactionIndex should be a non negative integer'));

		const key = `${blockNum}:${transactionIndex}`;

		return this._getSingleDataByCompositeParams(key, CacheMaps.TRANSACTIONS_BY_BLOCK_AND_INDEX, 'getTransaction', false, blockNum, transactionIndex);
	}

	/**
     *  @method getChainProperties
     *  @param {Boolean} force
     *
     *  @returns {Promise.<Object>}
     */
	getChainProperties(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations(CacheMaps.CHAIN_PROPERTIES, 'getChainProperties', force);
	}

	/**
     *  @method getGlobalProperties
     *
     *  @returns {Promise.<Object>}
     */
	getGlobalProperties(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations(CacheMaps.GLOBAL_PROPERTIES, 'getGlobalProperties', force);
	}

	/**
     *  @method getConfig
     *  @param {Boolean} force
     *
     *  @returns {Promise.<Object>}
     */
	async getConfig(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations(CacheMaps.CONFIG, 'getConfig', force);
	}

	/**
     *  @method getChainId
     *  @param {Boolean} force
     *
     *  @returns {Promise.<String>}
     */
	async getChainId(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations(CacheMaps.CHAIN_ID, 'getChainId', force);
	}

	/**
     *  @method getDynamicGlobalProperties
     *
     *  @returns {Promise.<Object>}
     */
	async getDynamicGlobalProperties(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations(CacheMaps.DYNAMIC_GLOBAL_PROPERTIES, 'getDynamicGlobalProperties', force);
	}

	/**
     *  @method getKeyReferences
     *  @param  {Array<String>} keys [public keys]
     *  @param {Boolean} force
     *
     *  @returns {Promise.<Array.<*>>}
     */
	getKeyReferences(keys, force = false) {
		if (!isArray(keys)) return Promise.reject(new Error('Keys should be a array'));
		if (!keys.every((key) => isPublicKey(key))) return Promise.reject(new Error('Keys should contain valid public keys'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getArrayDataWithMultiSave(keys, CacheMaps.ACCOUNTS_ID_BY_KEY, 'getKeyReferences', force);
	}

	/**
     *  @method getAccounts
     *  @param  {Array<String>} accountIds
     *  @param {Boolean} force
     *
     *  @returns {Promise.<Array.<*>>}
     */
	async getAccounts(accountIds, force = false) {
		if (!isArray(accountIds)) return Promise.reject(new Error('Account ids should be an array'));
		if (!accountIds.every((id) => isAccountId(id))) return Promise.reject(new Error('Accounts should contain valid account ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const cacheParams = [{ param: 'name', cache: CacheMaps.ACCOUNTS_BY_NAME }, { param: 'id', cache: CacheMaps.OBJECTS_BY_ID }];

		return this._getArrayDataWithMultiSave(accountIds, CacheMaps.ACCOUNTS_BY_ID, 'getAccounts', force, cacheParams);
	}

	/**
     *  @method getFullAccounts
     *  @param  {Array<String>} accountNamesOrIds
     *  @param  {Boolean} subscribe
     *  @param {Boolean} force
     *
     *  @returns {Promise.<Array.<*>>}
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
				cacheValue = this.cache.accountsById.get(key);
			} else {
				cacheValue = this.cache.accountsByName.get(key);
			}

			if (cacheValue) {
				resultArray[i] = cacheValue;
			} else {
				requestedObjects.push(key);
			}
		}

		try {
			requestedObjects = await this.wsApi.database.getFullAccounts(requestedObjects, true);
		} catch (error) {
			throw error;
		}

		for (let i = 0; i < length; i += 1) {
			if (resultArray[i]) continue;

			const requestedObject = requestedObjects.shift();

			resultArray[i] = requestedObject;
			if (!requestedObject) {
				continue;
			}

			const nameKey = requestedObject.name;
			const idKey = requestedObject.id;

			this.cache.setInMap(CacheMaps.ACCOUNTS_BY_ID, idKey, requestedObject)
				.setInMap(CacheMaps.OBJECTS_BY_ID, idKey, requestedObject)
				.setInMap(CacheMaps.ACCOUNTS_BY_NAME, nameKey, requestedObject);
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
	async getAccountByName(accountName, force = false) {
		if (!isAccountName(accountName)) return Promise.reject(new Error('Account name is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));
		const cacheParams = [{ param: 'id', cache: CacheMaps.ACCOUNTS_BY_ID }, { param: 'id', cache: CacheMaps.OBJECTS_BY_ID }];

		return this._getSingleDataWithMultiSave(accountName, CacheMaps.ACCOUNTS_BY_NAME, 'getAccountByName', force, cacheParams);
	}

	/**
     *  @method getAccountReferences
     *  @param  {String} accountId
     *  @param {Boolean} force
     *
     *  @return {Promise.<Object>}
     */
	getAccountReferences(accountId, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataWithMultiSave(accountId, CacheMaps.ACCOUNT_REFERENCES_BY_ACCOUNT_ID, 'getAccountReferences', force);
	}

	/**
     *  @method lookupAccountNames
     *  @param  {Array<String>} accountNames
     *  @param {Boolean} force
     *
     *  @returns {Promise.<Array.<*>>}
     */
	async lookupAccountNames(accountNames, force = false) {
		if (!isArray(accountNames)) return Promise.reject(new Error('Account names should be an array'));
		if (!accountNames.every((id) => isAccountName(id))) return Promise.reject(new Error('Accounts should contain valid account names'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const cacheParams = [{ param: 'id', cache: CacheMaps.ACCOUNTS_BY_ID }, { param: 'id', cache: CacheMaps.OBJECTS_BY_ID }];

		return this._getArrayDataWithMultiSave(accountNames, CacheMaps.ACCOUNTS_BY_NAME, 'lookupAccountNames', force, cacheParams);
	}

	/** @typedef {string} AccountName */
	/** @typedef {string} AccountId */

	/**
     *  @method lookupAccounts
     *  @param  {String} lowerBoundName
     *  @param  {Number} limit
     *
     *  @return {Promise.<Array<[AccountName, AccountId]>>}
     */
	lookupAccounts(lowerBoundName, limit = LOOKUP_ACCOUNTS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundName)) return Promise.reject(new Error('Lower bound name should be a string'));
		if (!isUInt64(limit) || limit > LOOKUP_ACCOUNTS_MAX_LIMIT) return Promise.reject(new Error(`Limit should be a integer and must not exceed ${LOOKUP_ACCOUNTS_MAX_LIMIT}`));

		return this.wsApi.database.lookupAccounts(lowerBoundName, limit);
	}

	/**
     *  @method getAccountCount
     *
     *  @return {Promise<Number>}
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
     *  @return {Promise.<Object>}
     */
	getAccountBalances(accountId, assetIds, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isArray(assetIds)) return Promise.reject(new Error('Asset ids should be an array'));
		if (!assetIds.every((id) => isAssetId(id))) return Promise.reject(new Error('Asset ids contain valid asset ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataByCompositeParams(accountId, CacheMaps.ACCOUNTS_BALANCE_BY_ACCOUNT_ID, 'getAccountBalances', force, accountId, assetIds);
	}

	/**
     *  @method getNamedAccountBalances
     *  @param  {String} accountName
     *  @param  {Array<String>} assetIds
     *  @param {Boolean} force
     *
     *  @return {Promise.<Object>}
     */
	getNamedAccountBalances(accountName, assetIds, force = false) {
		if (!isAccountName(accountName)) return Promise.reject(new Error('Account name is invalid'));
		if (!isArray(assetIds)) return Promise.reject(new Error('Asset ids should be an array'));
		if (!assetIds.every((id) => isAssetId(id))) return Promise.reject(new Error('Asset ids should contain valid asset ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataByCompositeParams(accountName, CacheMaps.ACCOUNTS_BALANCE_BY_ACCOUNT_NAME, 'getNamedAccountBalances', force, accountName, assetIds);
	}

	/**
     *  @method getVestedBalances
     *  @param  {Array<String>} balanceIds
     *
     *  @return {Promise}
     */
	getVestedBalances(balanceIds) {
		if (!isArray(balanceIds)) return Promise.reject(new Error('Balance ids should be an array'));
		if (!balanceIds.every((id) => isBalanceId(id))) return Promise.reject(new Error('Balance ids should contain valid balance ids'));

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
     *  @returns {Promise.<Array.<*>>}
     */
	async getAssets(assetIds, force = false) {
		if (!isArray(assetIds)) return Promise.reject(new Error('Asset ids should be an array'));
		if (!assetIds.every((id) => isAssetId(id))) return Promise.reject(new Error('Assets ids should contain valid asset ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const cacheParams = [{ param: 'symbol', cache: CacheMaps.ASSET_BY_SYMBOL }, { param: 'id', cache: CacheMaps.OBJECTS_BY_ID }];

		return this._getArrayDataWithMultiSave(assetIds, CacheMaps.ASSET_BY_ASSET_ID, 'getAssets', force, cacheParams);
	}

	/**
     *  @method listAssets
     *  @param  {String} lowerBoundSymbol
     *  @param  {Number} limit
     *
     *  @return {Promise.<Array.<{}>>}
     */
	listAssets(lowerBoundSymbol, limit = LIST_ASSETS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundSymbol)) return Promise.reject(new Error('Lower bound symbol is invalid'));
		if (!isUInt64(limit) || limit > LIST_ASSETS_MAX_LIMIT) return Promise.reject(new Error(`Limit should be a integer and must not exceed ${LIST_ASSETS_MAX_LIMIT}`));

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
		if (!symbolsOrIds.every((key) => isAssetId(key) || isAssetName(key))) throw new Error('Symbols or ids should contain valid asset ids or symbol');
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

			if (cacheValue) {
				resultArray[i] = cacheValue;
			} else {
				requestedObjects.push(key);
			}
		}

		try {
			requestedObjects = await this.wsApi.database.lookupAssetSymbols(requestedObjects);
		} catch (error) {
			throw error;
		}

		for (let i = 0; i < length; i += 1) {
			if (resultArray[i]) continue;

			const requestedObject = requestedObjects.shift();

			resultArray[i] = requestedObject;
			if (!requestedObject) {
				continue;
			}

			const idKey = requestedObject.id;
			const nameKey = requestedObject.symbol;

			this.cache.setInMap(CacheMaps.ASSET_BY_ASSET_ID, idKey, requestedObject)
				.setInMap(CacheMaps.OBJECTS_BY_ID, idKey, requestedObject)
				.setInMap(CacheMaps.ASSET_BY_SYMBOL, nameKey, requestedObject);
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
	getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit = GET_TRADE_HISTORY_DEFAULT_LIMIT) {
		if (!isAssetName(baseAssetName)) return Promise.reject(new Error('Base asset name is invalid'));
		if (!isAssetName(quoteAssetName)) return Promise.reject(new Error('Quote asset name is invalid'));
		if (!isUInt64(start)) return Promise.reject(new Error('Start should be UNIX timestamp'));
		if (!isUInt64(stop)) return Promise.reject(new Error('Stop should be UNIX timestamp'));
		if (!isUInt64(limit) || limit > GET_TRADE_HISTORY_MAX_LIMIT) return Promise.reject(new Error(`Limit should be capped at ${GET_TRADE_HISTORY_MAX_LIMIT}`));

		return this.wsApi.database.getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit);
	}

	/**
     *  @method getWitnesses
     *
     *  @param  {Array<String>} witnessIds
     *  @param {Boolean} force
     *
     *  @returns {Promise.<Array.<*>>}
     */
	getWitnesses(witnessIds, force = false) {
		if (!isArray(witnessIds)) return Promise.reject(new Error('Witness ids should be an array'));
		if (!witnessIds.every((id) => isWitnessId(id))) return Promise.reject(new Error('Witness ids should contain valid object ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const cacheParams = [{ param: 'id', cache: CacheMaps.OBJECTS_BY_ID }];

		return this._getArrayDataWithMultiSave(witnessIds, CacheMaps.WITNESS_BY_WITNESS_ID, 'getWitnesses', force, cacheParams);
	}

	/**
     *  @method getWitnessByAccount
     *
     *  @param  {String} accountId
     *  @param {Boolean} force
     *
     *  @return {Promise.<Object>}
     */
	getWitnessByAccount(accountId, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataWithMultiSave(accountId, CacheMaps.WITNESS_BY_ACCOUNT_ID, 'getWitnessByAccount', force);
	}

	/**
     *  @method lookupWitnessAccounts
     *
     *  @param  {String} lowerBoundName
     *  @param  {Number} limit
     *
     *  @return {Promise}
     */
	lookupWitnessAccounts(lowerBoundName, limit = LOOKUP_WITNESS_ACCOUNTS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundName)) return Promise.reject(new Error('LowerBoundName should be string'));
		if (!isUInt64(limit) || limit > LOOKUP_WITNESS_ACCOUNTS_MAX_LIMIT) return Promise.reject(new Error(`Limit should be capped at ${LOOKUP_WITNESS_ACCOUNTS_MAX_LIMIT}`));

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
     *  @returns {Promise.<Array.<*>>}
     */
	getCommitteeMembers(committeeMemberIds, force = false) {
		if (!isArray(committeeMemberIds)) return Promise.reject(new Error('CommitteeMemberIds ids should be an array'));
		if (!committeeMemberIds.every((id) => isCommitteeMemberId(id))) return Promise.reject(new Error('CommitteeMemberIds should contain valid object ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const cacheParams = [{ param: 'id', cache: CacheMaps.OBJECTS_BY_ID }];

		return this._getArrayDataWithMultiSave(committeeMemberIds, CacheMaps.COMMITTEE_MEMBERS_BY_COMMITTEE_MEMBER_ID, 'getCommitteeMembers', force, cacheParams);
	}

	/**
     *  @method getCommitteeMemberByAccount
     *
     *  @param  {String} accountId
     *  @param {Boolean} force
     *
     *  @return {Promise.<Object>}
     */
	getCommitteeMemberByAccount(accountId, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataWithMultiSave(accountId, CacheMaps.COMMITTEE_MEMBERS_BY_ACCOUNT, 'getCommitteeMemberByAccount', force);
	}

	/**
     *  @method lookupCommitteeMemberAccounts
     *
     *  @param  {String} lowerBoundName
     *  @param  {Number} limit
     *
     *  @return {Promise}
     */
	lookupCommitteeMemberAccounts(lowerBoundName, limit = COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundName)) return Promise.reject(new Error('LowerBoundName should be string'));
		if (!isUInt64(limit) || limit > COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT) return Promise.reject(new Error(`Limit should be capped at ${COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT}`));

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
		if (!votes.every((id) => isVoteId(id))) return Promise.reject(new Error('Votes should contain valid vote_id_type ids'));


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
		if (!Transactions.transaction.isValid(transaction)) return Promise.reject(new Error('Transaction is invalid'));

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
		if (!Transactions.transaction.isValid(transaction)) return Promise.reject(new Error('Transaction is invalid'));
		if (!isArray(availableKeys)) return Promise.reject(new Error('Available keys ids should be an array'));
		if (!availableKeys.every((key) => isPublicKey(key))) return Promise.reject(new Error('\'Available keys should contain valid public keys'));

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
		if (!Transactions.transaction.isValid(transaction)) return Promise.reject(new Error('Transaction is invalid'));

		return this.wsApi.database.getPotentialSignatures(transaction);
	}

	/**
     *  @method getPotentialAddressSignatures
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise}
     */
	getPotentialAddressSignatures(transaction) {
		if (!Transactions.transaction.isValid(transaction)) return Promise.reject(new Error('Transaction is invalid'));

		return this.wsApi.database.getPotentialAddressSignatures(transaction);
	}

	/**
     *  @method verifyAuthority
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise}
     */
	verifyAuthority(transaction) {
		if (!Transactions.transaction.isValid(transaction)) return Promise.reject(new Error('Transaction is invalid'));

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
		if (!signers.every((key) => isPublicKey(key))) return Promise.reject(new Error('Signers should contain valid public keys'));

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
		if (!Transactions.signedTransaction.isValid(transaction)) return Promise.reject(new Error('Transaction is invalid'));

		// signed transaction
		return this.wsApi.database.validateTransaction(transaction);
	}

	/**
     *  @method getRequiredFees
     *
     *  @param  {Array<Object>} operations
     *  @param  {String} assetId
     *
     *  @return {Promise.<Array<{asset_id:String,amount:Number}>>}
     */
	getRequiredFees(operations, assetId = '1.3.0') {
		if (!isArray(operations)) return Promise.reject(new Error('Operations should be an array'));
		if (!operations.every((v) => Operations.some((op) => op.isValid(v)))) return Promise.reject(new Error('Operations should contain valid operations'));
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
     *  @return {Promise.<Array<{id:String,statistics:String,suicided:Boolean}>>}
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
     *  @return {Promise.<Object>}
     */
	getContractResult(resultContractId, force = false) {
		if (!isContractResultId(resultContractId)) return Promise.reject(new Error('Result contract id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataWithMultiSave(resultContractId, CacheMaps.CONTRACT_RESULTS_BY_CONTRACT_RESULT_ID, 'getContractResult', force);
	}

	/**
     *  @method getContract
     *
     *  @param  {String} contractId
     *  @param {Boolean} force
     *
     *  @return {Promise.<Object>}
     */
	getContract(contractId, force = false) {
		if (!isContractId(contractId)) return Promise.reject(new Error('Contract id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataWithMultiSave(contractId, CacheMaps.FULL_CONTRACTS_BY_CONTRACT_ID, 'getContract', force);
	}

	/**
     *  @method callContractNoChangingState
     *
     *  @param  {String} contractId
     *  @param  {String} accountId
     *  @param  {String} assetId
     *  @param  {String} bytecode
     *
     *  @return {Promise<string>}
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
     *  @return {Promise.<Object>}
     */
	getContracts(contractIds, force = false) {
		if (!isArray(contractIds)) return Promise.reject(new Error('ContractIds ids should be an array'));
		if (!contractIds.every((id) => isContractId(id))) return Promise.reject(new Error('ContractIds should contain valid contract ids'));

		return this._getSingleDataWithMultiSave(contractIds, CacheMaps.CONTRACTS_BY_CONTRACT_ID, 'getContracts', force);
	}

	/**
     *  @method getContractBalances
     *
     *  @param  {String} contractId
     *  @param {Boolean} force
     *
     *  @return {Promise.<Object>}
     */
	getContractBalances(contractId, force = false) {
		if (!isContractId(contractId)) return Promise.reject(new Error('ContractId is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataWithMultiSave(contractId, CacheMaps.CONTRACT_BALANCE_BY_CONTRACT_ID, 'getContractBalances', force);
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

