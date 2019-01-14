/* eslint-disable no-continue,max-len,no-await-in-loop,camelcase */
import { Map, List, fromJS } from 'immutable';

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
	isOperationHistoryId,
	isContractResultId,
	isBytecode,
	isRipemd160,
	isPublicKey,
	isVoteId,
	isWitnessId,
	isCommitteeMemberId,
	isBitAssetId,
	isDynamicAssetDataId,
	isEchoRandKey,
	isOperationId,
} from '../utils/validator';

import { Transactions, Operations } from '../serializer/operations';

import * as ApiConfig from '../constants/api-config';
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
     * @returns {Promise.<Map>}
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
			let requestedObject = await this.wsApi.database[methodName]();

			requestedObject = new Map(requestedObject);

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
     * @param {Array} cacheParams
     *
     * @returns {Promise.<List.<Map>>}
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
			let requestedObject = requestedObjects.shift();

			if (!requestedObject) {
				resultArray[i] = null;
				continue;
			}

			requestedObject = new Map(requestedObject);
			resultArray[i] = requestedObject;

			this.cache.setInMap(cacheName, key, requestedObject);
			cacheParams.forEach(({ param, cache }) => this.cache.setInMap(cache, requestedObject.get(param), requestedObject));
		}

		return new List(resultArray);
	}

	/**
	 *
     * @param {*} key
     * @param {String} cacheName
     * @param {String} methodName
     * @param {Boolean} force
     * @param {Array} cacheParams
     *
     * @returns {Promise.<Map>}
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
			let requestedObject = await this.wsApi.database[methodName](key);

			if (!requestedObject) {
				return requestedObject;
			}

			requestedObject = new Map(requestedObject);

			cacheParams.forEach(({ param, cache }) => this.cache.setInMap(cache, requestedObject.get(param), requestedObject));

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
     * @returns {Promise.<Map>}
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

			this.cache.setInMap(cacheName, key, fromJS(requestedObject));

			return requestedObject;
		} catch (error) {
			throw error;
		}
	}

	/**
	 *
     * @param {Map} requestedObject
     * @param {Boolean} force
     *  @returns {Promise.<Map{id:String,symbol:String,precision:Number,issuer:String,options:{max_supply:String,market_fee_percent:Number,max_market_fee:String,issuer_permissions:Number,flags:Number,core_exchange_rate:Object,whitelist_authorities:Array,blacklist_authorities:Array,whitelist_markets:Array,blacklist_markets:Array,description:String,extensions:[]},dynamic_asset_data_id:String,dynamic:Object,bitasset:Object|undefined}>}
     * @private
     */
	async _addAssetExtraFields(requestedObject, force = false) {
		const bitAssetId = requestedObject.get('bitasset_data_id');
		const dynamicAssetDataId = requestedObject.get('dynamic_asset_data_id');

		if (bitAssetId) {
			const bitasset = await this.getBitAssetData(bitAssetId, force);
			if (bitasset) {
				requestedObject = requestedObject.set('bitasset', bitasset);
			}
		}

		if (dynamicAssetDataId) {
			const dynamicAssetData = await this.getDynamicAssetData(dynamicAssetDataId, force);
			if (dynamicAssetData) {
				requestedObject = requestedObject.set('dynamic', dynamicAssetData);
			}
		}
		return requestedObject;
	}

	/**
     *
     * @param {Map} account
     * @param {Number} limit
     *  @returns {Promise.<Map{id:String,membership_expiration_date:String,registrar:String,referrer:String,lifetime_referrer:String,network_fee_percentage:Number,lifetime_referrer_fee_percentage:Number,referrer_rewards_percentage:Number,name:String,owner:{weight_threshold:Number,account_auths:Array,key_auths:Array,address_auths:Array},active:{weight_threshold:Number,account_auths:Array,key_auths:Array,address_auths:Array},ed_key:String,options:{memo_key:String,voting_account:String,delegating_account:String,num_witness:Number,num_committee:Number,votes:Array,extensions:Array},statistics:String,whitelisting_accounts:Array,blacklisting_accounts:Array,whitelisted_accounts:Array,blacklisted_accounts:Array,owner_special_authority:Array,active_special_authority:Array,top_n_control_flags:Number,history:Array.<{is:String,op:Array,result:Array,block_num:Number,trx_in_block:Number,op_in_block:Number,virtual_op:Number}>}>}
     * @private
     */
	async _addHistory(account, limit = ApiConfig.ACCOUNT_HISTORY_DEFAULT_LIMIT) {
		const start = ApiConfig.START_OPERATION_HISTORY_ID;
		let stop = start;

		let history = account.get('history');

		if (history && history.size) {
			stop = history.first().get('id');
		} else {
			history = new List();
		}

		try {
			const accountHistory = await this.getAccountHistory(account.get('id'), stop, limit, start);

			history = history.concat(accountHistory);

			account = account.set('history', history);

			return account;
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
     * @returns {Promise.<List.<*>>}
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
					resultArray[i] = cacheValue.toJS();
					continue;
				}
			}

			requestedObjectsKeys.push(key);
		}

		let requestedObjects;

		try {
			requestedObjects = await this.wsApi.database[methodName](requestedObjectsKeys);


			for (let i = 0; i < length; i += 1) {
				if (resultArray[i]) continue;

				const key = requestedObjectsKeys.shift();
				let requestedObject = requestedObjects.shift();

				if (!requestedObject) {
					resultArray[i] = null;
					continue;
				}

				requestedObject = fromJS(requestedObject);

				if (isAccountId(key)) {
					const nameKey = requestedObject.get('name');

					this.cache.setInMap(CacheMaps.ACCOUNTS_BY_ID, key, requestedObject)
						.setInMap(CacheMaps.ACCOUNTS_BY_NAME, nameKey, key);

				} else if (isAssetId(key)) {
					const nameKey = requestedObject.get('symbol');

					requestedObject = await this._addAssetExtraFields(requestedObject, force);

					this.cache.setInMap(CacheMaps.ASSET_BY_ASSET_ID, key, requestedObject)
						.setInMap(CacheMaps.ASSET_BY_SYMBOL, nameKey, requestedObject);

				} else if (isWitnessId(key)) {

					const accountId = requestedObject.get('witness_account');
					const voteId = requestedObject.get('vote_id');

					this.cache.setInMap(CacheMaps.OBJECTS_BY_VOTE_ID, voteId, requestedObject)
						.setInMap(CacheMaps.WITNESS_BY_ACCOUNT_ID, accountId, requestedObject)
						.setInMap(CacheMaps.WITNESS_BY_WITNESS_ID, key, requestedObject);

				} else if (isCommitteeMemberId(key)) {

					const accountId = requestedObject.get('committee_member_account');
					const voteId = requestedObject.get('vote_id');

					this.cache.setInMap(CacheMaps.OBJECTS_BY_VOTE_ID, voteId, requestedObject)
						.setInMap(CacheMaps.COMMITTEE_MEMBERS_BY_ACCOUNT_ID, accountId, requestedObject)
						.setInMap(CacheMaps.COMMITTEE_MEMBERS_BY_COMMITTEE_MEMBER_ID, key, requestedObject);

				} else if (isBitAssetId(key)) {

					this.cache.setInMap(CacheMaps.BIT_ASSETS_BY_BIT_ASSET_ID, key, requestedObject);

				} else if (isDynamicAssetDataId(key)) {

					this.cache.setInMap(CacheMaps.DYNAMIC_ASSET_DATA_BY_DYNAMIC_ASSET_DATA_ID, key, requestedObject);

				}

				resultArray[i] = requestedObject.toJS();
				this.cache.setInMap(cacheName, key, requestedObject);
			}

			return resultArray;
		} catch (error) {
			throw error;
		}
	}

	/**
     *  @method getObjects
     *  @param  {Array<String>} objectIds
     *  @param {Boolean} force
     *
     *  @returns {Promise.<List.<Map>>}
     */
	getObjects(objectIds, force = false) {
		if (!isArray(objectIds)) return Promise.reject(new Error('ObjectIds should be a array'));
		if (!objectIds.every((id) => isObjectId(id))) return Promise.reject(new Error('ObjectIds should contain valid valid object ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getObjectsById(objectIds, CacheMaps.OBJECTS_BY_ID, 'getObjects', force);
	}

	/**
     *  @method getObject
     *  @param  {String} objectId
     *  @param {Boolean} force
     *
     *  @returns {Promise.<Map>}
     */
	async getObject(objectId, force = false) {
		if (!isObjectId(objectId)) return Promise.reject(new Error('ObjectIds should be a array'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return (await this.getObjects([objectId], force))[0];
	}

	/**
	 *
     * 	@param {String} bitAssetId
     *  @param {Boolean} force
     * 	@returns  {Promise.<Map>}
     * 	@private
     */
	getBitAssetData(bitAssetId, force = false) {
		if (!isBitAssetId(bitAssetId)) return Promise.reject(new Error('Bit asset id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this.getObject(bitAssetId, force);
	}


	/**
     *
     * 	@param {String} dynamicAssetDataId
     *  @param {Boolean} force
     * 	@returns  {Promise.<<Map>}
     * 	@private
     */
	getDynamicAssetData(dynamicAssetDataId, force = false) {
		if (!isDynamicAssetDataId(dynamicAssetDataId)) return Promise.reject(new Error('Bit dynamic asset data id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this.getObject(dynamicAssetDataId, force);
	}

	/**
     *  @method getBlockHeader
     *  @param  {Number} blockNum
     *
     *  @returns {Promise.<Map{previous:String,timestamp:String,witness:String,account:String,transaction_merkle_root:String,state_root_hash:String,result_root_hash:String,extensions:[]}>}
     */
	getBlockHeader(blockNum) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));

		return this._getSingleDataWithMultiSave(blockNum, CacheMaps.BLOCK_HEADERS_BY_BLOCK_NUMBER, 'getBlockHeader');
	}

	/**
     *  @method getBlock
     *  @param  {Number} blockNum
     *
     *  @returns {Promise.<Map{previous:String,timestamp:String,witness:String,account:String,transaction_merkle_root:String,state_root_hash:String,result_root_hash:String,extensions:[],witness_signature:String,ed_signature:String,verifications:Array,round:Number,rand:String,cert:{_rand:String,_block_hash:String,_producer:Number,_signatures:Array.<{_step:Number,_value:Number,_signer:Number,_bba_sign:String}>},transactions:Array.<{ref_block_num:Number,ref_block_prefix:Number,expiration:String,operations:Array.<*>,extensions:[],signatures:Array.<String>,operation_results:Array.<Array.<*>>}}>}
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
     *  @returns {Promise.<Map{ref_block_num:Number,ref_block_prefix:Number,expiration:String,operations:Array.<*>,extensions:[],signatures:Array.<String>,operation_results:Array.<Array.<*>>}>}
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
     *  @returns {Promise.<Map{id:String,chain_id:String,immutable_parameters:{min_committee_member_count:Number,min_witness_count:Number,num_special_accounts:Number,num_special_assets:Number}}>}
     */
	getChainProperties(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations(CacheMaps.CHAIN_PROPERTIES, 'getChainProperties', force);
	}

	/**
     *  @method getGlobalProperties
     *
     *  @returns {Promise.<Map{id:String,parameters:{current_fees:{parameters:Array.<*>,scale:Number},block_interval:Number,maintenance_interval:Number,maintenance_skip_slots:Number,committee_proposal_review_period:Number,maximum_transaction_size:Number,maximum_block_size:Number,maximum_time_until_expiration:Number,maximum_proposal_lifetime:Number,maximum_asset_whitelist_authorities:Number,maximum_asset_feed_publishers:Number,maximum_witness_count:Number,maximum_committee_count:Number,maximum_authority_membership:Number,reserve_percent_of_fee:Number,network_percent_of_fee:Number,lifetime_referrer_percent_of_fee:Number,cashback_vesting_period_seconds:Number,cashback_vesting_threshold:Number,count_non_member_votes:Boolean,allow_non_member_whitelists:Boolean,witness_pay_per_block:Number,worker_budget_per_day:String,max_predicate_opcode:Number,fee_liquidation_threshold:Number,accounts_per_fee_scale:Number,account_fee_scale_bitshifts:Number,max_authority_depth:Number,extensions:[]},next_available_vote_id:Number,active_committee_members:Array.<String>,active_witnesses:Array.<String>}>}
     */
	getGlobalProperties(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations(CacheMaps.GLOBAL_PROPERTIES, 'getGlobalProperties', force);
	}

	/**
     *  @method getConfig
     *  @param {Boolean} force
     *
     *  @returns {Promise.<Map{GRAPHENE_SYMBOL:String,GRAPHENE_ADDRESS_PREFIX:String,GRAPHENE_ED_PREFIX:String,GRAPHENE_MIN_ACCOUNT_NAME_LENGTH:Number,GRAPHENE_MAX_ACCOUNT_NAME_LENGTH:Number,GRAPHENE_MIN_ASSET_SYMBOL_LENGTH:Number,GRAPHENE_MAX_ASSET_SYMBOL_LENGTH:Number,GRAPHENE_MAX_SHARE_SUPPLY:String,GRAPHENE_MAX_PAY_RATE:Number,GRAPHENE_MAX_SIG_CHECK_DEPTH:Number,GRAPHENE_MIN_TRANSACTION_SIZE_LIMIT:Number,GRAPHENE_MIN_BLOCK_INTERVAL:Number,GRAPHENE_MAX_BLOCK_INTERVAL:Number,GRAPHENE_DEFAULT_BLOCK_INTERVAL:Number,GRAPHENE_DEFAULT_MAX_TRANSACTION_SIZE:Number,GRAPHENE_DEFAULT_MAX_BLOCK_SIZE:Number,GRAPHENE_DEFAULT_MAX_TIME_UNTIL_EXPIRATION:Number,GRAPHENE_DEFAULT_MAINTENANCE_INTERVAL:Number,GRAPHENE_DEFAULT_MAINTENANCE_SKIP_SLOTS:Number,GRAPHENE_MIN_UNDO_HISTORY:Number,GRAPHENE_MAX_UNDO_HISTORY:Number,GRAPHENE_MIN_BLOCK_SIZE_LIMIT:Number,GRAPHENE_MIN_TRANSACTION_EXPIRATION_LIMIT:Number,GRAPHENE_BLOCKCHAIN_PRECISION:Number,GRAPHENE_BLOCKCHAIN_PRECISION_DIGITS:Number,GRAPHENE_DEFAULT_TRANSFER_FEE:Number,GRAPHENE_MAX_INSTANCE_ID:String,GRAPHENE_100_PERCENT:Number,GRAPHENE_1_PERCENT:Number,GRAPHENE_MAX_MARKET_FEE_PERCENT:Number,GRAPHENE_DEFAULT_FORCE_SETTLEMENT_DELAY:Number,GRAPHENE_DEFAULT_FORCE_SETTLEMENT_OFFSET:Number,GRAPHENE_DEFAULT_FORCE_SETTLEMENT_MAX_VOLUME:Number,GRAPHENE_DEFAULT_PRICE_FEED_LIFETIME:Number,GRAPHENE_MAX_FEED_PRODUCERS:Number,GRAPHENE_DEFAULT_MAX_AUTHORITY_MEMBERSHIP:Number,GRAPHENE_DEFAULT_MAX_ASSET_WHITELIST_AUTHORITIES:Number,GRAPHENE_DEFAULT_MAX_ASSET_FEED_PUBLISHERS:Number,GRAPHENE_COLLATERAL_RATIO_DENOM:Number,GRAPHENE_MIN_COLLATERAL_RATIO:Number,GRAPHENE_MAX_COLLATERAL_RATIO:Number,GRAPHENE_DEFAULT_MAINTENANCE_COLLATERAL_RATIO:Number,GRAPHENE_DEFAULT_MAX_SHORT_SQUEEZE_RATIO:Number,GRAPHENE_DEFAULT_MARGIN_PERIOD_SEC:Number,GRAPHENE_DEFAULT_MAX_WITNESSES:Number,GRAPHENE_DEFAULT_MAX_COMMITTEE:Number,GRAPHENE_DEFAULT_MAX_PROPOSAL_LIFETIME_SEC:Number,GRAPHENE_DEFAULT_COMMITTEE_PROPOSAL_REVIEW_PERIOD_SEC:Number,GRAPHENE_DEFAULT_NETWORK_PERCENT_OF_FEE:Number,GRAPHENE_DEFAULT_LIFETIME_REFERRER_PERCENT_OF_FEE:Number,GRAPHENE_DEFAULT_MAX_BULK_DISCOUNT_PERCENT:Number,GRAPHENE_DEFAULT_BULK_DISCOUNT_THRESHOLD_MIN:Number,GRAPHENE_DEFAULT_BULK_DISCOUNT_THRESHOLD_MAX:String,GRAPHENE_DEFAULT_CASHBACK_VESTING_PERIOD_SEC:Number,GRAPHENE_DEFAULT_CASHBACK_VESTING_THRESHOLD:Number,GRAPHENE_DEFAULT_BURN_PERCENT_OF_FEE:Number,GRAPHENE_WITNESS_PAY_PERCENT_PRECISION:Number,GRAPHENE_DEFAULT_MAX_ASSERT_OPCODE:Number,GRAPHENE_DEFAULT_FEE_LIQUIDATION_THRESHOLD:Number,GRAPHENE_DEFAULT_ACCOUNTS_PER_FEE_SCALE:Number,GRAPHENE_DEFAULT_ACCOUNT_FEE_SCALE_BITSHIFTS:Number,GRAPHENE_MAX_WORKER_NAME_LENGTH:Number,GRAPHENE_MAX_URL_LENGTH:Number,GRAPHENE_NEAR_SCHEDULE_CTR_IV:String,GRAPHENE_FAR_SCHEDULE_CTR_IV:String,GRAPHENE_CORE_ASSET_CYCLE_RATE:Number,GRAPHENE_CORE_ASSET_CYCLE_RATE_BITS:Number,GRAPHENE_DEFAULT_WITNESS_PAY_PER_BLOCK:Number,GRAPHENE_DEFAULT_WITNESS_PAY_VESTING_SECONDS:Number,GRAPHENE_DEFAULT_WORKER_BUDGET_PER_DAY: '50000000000',GRAPHENE_MAX_INTEREST_APR:Number,GRAPHENE_COMMITTEE_ACCOUNT:String,GRAPHENE_WITNESS_ACCOUNT:String,GRAPHENE_RELAXED_COMMITTEE_ACCOUNT:String,GRAPHENE_NULL_ACCOUNT:String,GRAPHENE_TEMP_ACCOUNT:String}>}
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

		if (!force) {
			const cacheValue = this.cache[CacheMaps.CHAIN_ID];

			if (cacheValue) {
				return cacheValue;
			}
		}

		try {
			const requestedObject = await this.wsApi.database.getChainId();

			this.cache.set(CacheMaps.CHAIN_ID, requestedObject);

			return requestedObject;
		} catch (error) {
			throw error;
		}
	}

	/**
     *  @method getDynamicGlobalProperties
     *
     *  @returns {Promise.<Map{id:String,head_block_number:Number,head_block_id:String,time:String,current_witness:String,next_maintenance_time:String,last_budget_time:String,witness_budget:Number,accounts_registered_this_interval:Number,recently_missed_count:Number,current_aslot:Number,recent_slots_filled:String,dynamic_flags:Number,last_irreversible_block_num:Number}>}
     */
	async getDynamicGlobalProperties(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations(CacheMaps.DYNAMIC_GLOBAL_PROPERTIES, 'getDynamicGlobalProperties', force);
	}

	/**
     *  @method getKeyReferences
     *  @param  {List<String>} keys [public keys]
     *  @param {Boolean} force
     *
     *  @returns {Promise.<List.<*>>}
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
     *  @returns {Promise.<List.<Map{id:String,membership_expiration_date:String,registrar:String,referrer:String,lifetime_referrer:String,network_fee_percentage:Number,lifetime_referrer_fee_percentage:Number,referrer_rewards_percentage:Number,name:String,owner:{weight_threshold:Number,account_auths:Array,key_auths:Array,address_auths:Array},active:{weight_threshold:Number,account_auths:Array,key_auths:Array,address_auths:Array},ed_key:String,options:{memo_key:String,voting_account:String,delegating_account:String,num_witness:Number,num_committee:Number,votes:Array,extensions:Array},statistics:String,whitelisting_accounts:Array,blacklisting_accounts:Array,whitelisted_accounts:Array,blacklisted_accounts:Array,owner_special_authority:Array,active_special_authority:Array,top_n_control_flags:Number,history:Array.<{is:String,op:Array,result:Array,block_num:Number,trx_in_block:Number,op_in_block:Number,virtual_op:Number}}>>}
     */
	async getAccounts(accountIds, force = false) {
		if (!isArray(accountIds)) throw new Error('Account ids should be an array');
		if (!accountIds.every((id) => isAccountId(id))) throw new Error('Accounts should contain valid account ids');
		if (!isBoolean(force)) throw new Error('Force should be a boolean');

		const { length } = accountIds;

		const resultArray = new Array(length).fill(null);
		const requestedObjectsKeys = [];

		for (let i = 0; i < length; i += 1) {
			const key = accountIds[i];

			if (!force) {
				const cacheValue = this.cache.objectsById.get(key);

				if (cacheValue) {
					resultArray[i] = cacheValue;
					continue;
				}
			}

			requestedObjectsKeys.push(key);
		}

		let requestedObjects;

		try {
			requestedObjects = await this.wsApi.database.getAccounts(requestedObjectsKeys);

			for (let i = 0; i < length; i += 1) {
				if (resultArray[i]) continue;

				let requestedObject = requestedObjects.shift();

				if (!requestedObject) {
					resultArray[i] = null;
					continue;
				}

				resultArray[i] = requestedObject;
				requestedObject = fromJS(requestedObject);

				const idKey = requestedObject.get('id');
				const nameKey = requestedObject.get('name');

				this.cache.setInMap(CacheMaps.ACCOUNTS_BY_ID, idKey, requestedObject)
					.setInMap(CacheMaps.OBJECTS_BY_ID, idKey, requestedObject)
					.setInMap(CacheMaps.ACCOUNTS_BY_NAME, nameKey, idKey);
			}

			return resultArray;
		} catch (error) {
			throw error;
		}
	}

	/**
     *  @method getFullAccounts
     *  @param  {Array<String>} accountNamesOrIds
     *  @param  {Boolean} subscribe
     *  @param {Boolean} force
     *
     *  @returns {Promise.<List.<Map{id:String,membership_expiration_date:String,registrar:String,referrer:String,lifetime_referrer:String,network_fee_percentage:Number,lifetime_referrer_fee_percentage:Number,referrer_rewards_percentage:Number,name:String,owner:{weight_threshold:Number,account_auths:Array,key_auths:Array,address_auths:Array},active:{weight_threshold:Number,account_auths:Array,key_auths:Array,address_auths:Array},ed_key:String,options:{memo_key:String,voting_account:String,delegating_account:String,num_witness:Number,num_committee:Number,votes:Array,extensions:Array},statistics:String,whitelisting_accounts:Array,blacklisting_accounts:Array,whitelisted_accounts:Array,blacklisted_accounts:Array,owner_special_authority:Array,active_special_authority:Array,top_n_control_flags:Number,history:Array.<{is:String,op:Array,result:Array,block_num:Number,trx_in_block:Number,op_in_block:Number,virtual_op:Number}}>>}
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

			if (!force) {
				let id = key;

				if (!isAccountId(key)) {
					id = this.cache.accountsByName.get(key);
				}

				cacheValue = this.cache.fullAccounts.get(id);

				if (cacheValue) {
					resultArray[i] = cacheValue;
					continue;
				}
			}

			requestedObjects.push(key);
		}

		try {
			requestedObjects = await this.wsApi.database.getFullAccounts(requestedObjects, true);


			for (let i = 0; i < length; i += 1) {
				if (resultArray[i]) continue;

				let requestedObject = requestedObjects.shift();

				if (!requestedObject || !requestedObject[1] || !requestedObject[1].account) {
					resultArray[i] = null;
					continue;
				}

				const { account } = requestedObject[1];
				const immutableAccount = fromJS(account);
				delete requestedObject[1].account;

				const requestArray = [
					...requestedObject[1].call_orders.map(({ id }) => id),
					...requestedObject[1].limit_orders.map(({ id }) => id),
					...requestedObject[1].balances.map(({ id }) => id),
				];

				const balances = new Map().withMutations((map) => {
					requestedObject[1].balances.map(({ id, asset_type }) => map.set(asset_type, id));
				});

				const limitOrders = new Set(requestedObject[1].limit_orders.map(({ id }) => id));
				const callOrders = new Set(requestedObject[1].call_orders.map(({ id }) => id));
				const proposals = new Set(requestedObject[1].proposals.map(({ id }) => id));

				requestedObject = fromJS({ ...account, ...requestedObject[1] });
				requestedObject = await this._addHistory(requestedObject);

				requestedObject = requestedObject.withMutations((map) => {
					map
						.set('balances', balances)
						.set('limit_orders', limitOrders)
						.set('call_orders', callOrders)
						.set('proposals', proposals);
				});

				resultArray[i] = requestedObject.toJS();

				await this.getObjects(requestArray);

				const nameKey = requestedObject.get('name');
				const idKey = requestedObject.get('id');

				this.cache.setInMap(CacheMaps.ACCOUNTS_BY_ID, idKey, immutableAccount)
					.setInMap(CacheMaps.OBJECTS_BY_ID, idKey, immutableAccount)
					.setInMap(CacheMaps.FULL_ACCOUNTS, idKey, requestedObject)
					.setInMap(CacheMaps.ACCOUNTS_BY_NAME, nameKey, idKey);
			}

			return resultArray;
		} catch (error) {
			throw error;
		}
	}

	/**
     *  @method getAccountByName
     *  @param  {String} accountName
     *  @param {Boolean} force
     *
     *  @return {Promise.<Map{id:String,membership_expiration_date:String,registrar:String,referrer:String,lifetime_referrer:String,network_fee_percentage:Number,lifetime_referrer_fee_percentage:Number,referrer_rewards_percentage:Number,name:String,owner:{weight_threshold:Number,account_auths:Array,key_auths:Array,address_auths:Array},active:{weight_threshold:Number,account_auths:Array,key_auths:Array,address_auths:Array},ed_key:String,options:{memo_key:String,voting_account:String,delegating_account:String,num_witness:Number,num_committee:Number,votes:Array,extensions:Array},statistics:String,whitelisting_accounts:Array,blacklisting_accounts:Array,whitelisted_accounts:Array,blacklisted_accounts:Array,owner_special_authority:Array,active_special_authority:Array,top_n_control_flags:Number,history:Array.<{is:String,op:Array,result:Array,block_num:Number,trx_in_block:Number,op_in_block:Number,virtual_op:Number}}>}
     */
	async getAccountByName(accountName, force = false) {
		if (!isAccountName(accountName)) throw new Error('Account name is invalid');
		if (!isBoolean(force)) throw new Error('Force should be a boolean');

		if (!force) {
			const id = this.cache.accountsByName.get(accountName);

			const cacheValue = this.cache.objectsById.get(id);

			if (cacheValue) {
				return cacheValue;
			}
		}

		try {
			const requestedObject = await this.wsApi.database.getAccountByName(accountName);

			if (!requestedObject) {
				return requestedObject;
			}

			const idKey = requestedObject.id;
			const nameKey = requestedObject.name;

			this.cache.setInMap(CacheMaps.ACCOUNTS_BY_ID, idKey, fromJS(requestedObject))
				.setInMap(CacheMaps.OBJECTS_BY_ID, idKey, fromJS(requestedObject))
				.setInMap(CacheMaps.ACCOUNTS_BY_NAME, nameKey, idKey);

			return requestedObject;
		} catch (error) {
			throw error;
		}
	}

	/**
     *  @method getAccountReferences
     *  @param  {String} accountId
     *  @param {Boolean} force
     *
     *  @return {Promise.<Map>}
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
     *  @returns {Promise.<List.<Map{id:String,membership_expiration_date:String,registrar:String,referrer:String,lifetime_referrer:String,network_fee_percentage:Number,lifetime_referrer_fee_percentage:Number,referrer_rewards_percentage:Number,name:String,owner:{weight_threshold:Number,account_auths:Array,key_auths:Array,address_auths:Array},active:{weight_threshold:Number,account_auths:Array,key_auths:Array,address_auths:Array},ed_key:String,options:{memo_key:String,voting_account:String,delegating_account:String,num_witness:Number,num_committee:Number,votes:Array,extensions:Array},statistics:String,whitelisting_accounts:Array,blacklisting_accounts:Array,whitelisted_accounts:Array,blacklisted_accounts:Array,owner_special_authority:Array,active_special_authority:Array,top_n_control_flags:Number,history:Array.<{is:String,op:Array,result:Array,block_num:Number,trx_in_block:Number,op_in_block:Number,virtual_op:Number}}>>}
     */
	async lookupAccountNames(accountNames, force = false) {
		if (!isArray(accountNames)) return Promise.reject(new Error('Account names should be an array'));
		if (!accountNames.every((id) => isAccountName(id))) return Promise.reject(new Error('Accounts should contain valid account names'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const { length } = accountNames;

		const resultArray = new Array(length).fill(null);
		const requestedObjectsKeys = [];

		for (let i = 0; i < length; i += 1) {
			const key = accountNames[i];

			if (!force) {
				const id = this.cache.accountsByName.get(key);

				const cacheValue = this.cache.objectsById.get(id);

				if (cacheValue) {
					return cacheValue;
				}
			}

			if (!force) {
				const cacheValue = this.cache.objectsById.get(key);

				if (cacheValue) {
					resultArray[i] = cacheValue;
					continue;
				}
			}

			requestedObjectsKeys.push(key);
		}

		let requestedObjects;

		try {
			requestedObjects = await this.wsApi.database.lookupAccountNames(requestedObjectsKeys);

			for (let i = 0; i < length; i += 1) {
				if (resultArray[i]) continue;

				let requestedObject = requestedObjects.shift();

				if (!requestedObject) {
					resultArray[i] = null;
					continue;
				}

				resultArray[i] = requestedObject;
				requestedObject = fromJS(requestedObject);

				const idKey = requestedObject.get('id');
				const nameKey = requestedObject.get('name');

				this.cache.setInMap(CacheMaps.ACCOUNTS_BY_ID, idKey, requestedObject)
					.setInMap(CacheMaps.OBJECTS_BY_ID, idKey, requestedObject)
					.setInMap(CacheMaps.ACCOUNTS_BY_NAME, nameKey, idKey);
			}

			return resultArray;
		} catch (error) {
			throw error;
		}
	}

	/** @typedef {String} AccountName */
	/** @typedef {String} AccountId */

	/**
     *  @method lookupAccounts
     *  @param  {String} lowerBoundName
     *  @param  {Number} limit
     *
     *  @return {Promise.<List<[AccountName, AccountId]>>}
     */
	async lookupAccounts(lowerBoundName, limit = ApiConfig.LOOKUP_ACCOUNTS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundName)) throw new Error('Lower bound name should be a string');
		if (!isUInt64(limit) || limit > ApiConfig.LOOKUP_ACCOUNTS_MAX_LIMIT) throw new Error(`Limit should be a integer and must not exceed ${ApiConfig.LOOKUP_ACCOUNTS_MAX_LIMIT}`);

		const result = await this.wsApi.database.lookupAccounts(lowerBoundName, limit);
		return result;
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
     *  @return {Promise.<Map>}
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
     *  @return {Promise.<Map>}
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
     *  @return {Promise.<*>}
     */
	async getVestedBalances(balanceIds) {
		if (!isArray(balanceIds)) throw new Error('Balance ids should be an array');
		if (!balanceIds.every((id) => isBalanceId(id))) throw new Error('Balance ids should contain valid balance ids');

		const result = this.wsApi.database.getVestedBalances(balanceIds);
		return result;
	}

	/**
     *  @method getVestingBalances
     *  @param  {String} accountId
     *
     *  @return {Promise.<*>}
     */
	async getVestingBalances(accountId) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		const result = this.wsApi.database.getVestingBalances(accountId);
		return result;
	}

	/**
     *  @method getAssets
     *  @param  {Array<String>} assetIds
     *  @param {Boolean} force
     *
     *  @returns {Promise.<List.<Map{id:String,symbol:String,precision:Number,issuer:String,options:{max_supply:String,market_fee_percent:Number,max_market_fee:String,issuer_permissions:Number,flags:Number,core_exchange_rate:Object,whitelist_authorities:Array,blacklist_authorities:Array,whitelist_markets:Array,blacklist_markets:Array,description:String,extensions:[]},dynamic_asset_data_id:String,dynamic:Object,bitasset:Object|undefined}>>}
     */
	async getAssets(assetIds, force = false) {
		if (!isArray(assetIds)) return Promise.reject(new Error('Asset ids should be an array'));
		if (!assetIds.every((id) => isAssetId(id))) return Promise.reject(new Error('Assets ids should contain valid asset ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const { length } = assetIds;

		const resultArray = new Array(length).fill(null);
		let requestedObjects = [];

		for (let i = 0; i < length; i += 1) {

			const key = assetIds[i];

			if (!force) {
				const cacheValue = this.cache.assetByAssetId.get(key);

				if (cacheValue) {
					resultArray[i] = cacheValue.toJS();
					continue;
				}
			}

			requestedObjects.push(key);
		}

		try {
			requestedObjects = await this.wsApi.database.getAssets(requestedObjects);


			for (let i = 0; i < length; i += 1) {
				if (resultArray[i]) continue;

				let requestedObject = requestedObjects.shift();

				if (!requestedObject) {
					resultArray[i] = null;
					continue;
				}

				requestedObject = fromJS(requestedObject);
				requestedObject = await this._addAssetExtraFields(requestedObject, force);
				resultArray[i] = requestedObject.toJS();

				const idKey = requestedObject.get('id');
				const nameKey = requestedObject.get('symbol');

				this.cache.setInMap(CacheMaps.ASSET_BY_ASSET_ID, idKey, requestedObject)
					.setInMap(CacheMaps.OBJECTS_BY_ID, idKey, requestedObject)
					.setInMap(CacheMaps.ASSET_BY_SYMBOL, nameKey, requestedObject);
			}

			return resultArray;
		} catch (error) {
			throw error;
		}

	}

	/**
     *  @method listAssets
     *  @param  {String} lowerBoundSymbol
     *  @param  {Number} limit
     *
     *  @return {Promise.<List.<Map{id:String,symbol:String,precision:Number,issuer:String,options:{max_supply:String,market_fee_percent:Number,max_market_fee:String,issuer_permissions:Number,flags:Number,core_exchange_rate:Object,whitelist_authorities:Array,blacklist_authorities:Array,whitelist_markets:Array,blacklist_markets:Array,description:String,extensions:[]},dynamic_asset_data_id:String}>>}
     */
	async listAssets(lowerBoundSymbol, limit = ApiConfig.LIST_ASSETS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundSymbol)) throw new Error('Lower bound symbol is invalid');
		if (!isUInt64(limit) || limit > ApiConfig.LIST_ASSETS_MAX_LIMIT) throw new Error(`Limit should be a integer and must not exceed ${ApiConfig.LIST_ASSETS_MAX_LIMIT}`);

		const result = await this.wsApi.database.listAssets(lowerBoundSymbol, limit);
		return result;
	}

	/**
     *  @method lookupAssetSymbols
     *  @param  {Array<String>} symbolsOrIds
     *  @param {Boolean} force
     *
     *  @return {Promise.<List.<Map{id:String,symbol:String,precision:Number,issuer:String,options: {max_supply:String,	market_fee_percent:Number,max_market_fee:String,issuer_permissions:Number,flags:Number,core_exchange_rate:Object,whitelist_authorities:Array,blacklist_authorities:Array,whitelist_markets:Array,blacklist_markets:Array,description:String,extensions:[]},dynamic_asset_data_id:String|Object}>>}
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

			if (!force) {
				let cacheValue = null;

				if (isAssetId(key)) {
					cacheValue = this.cache.assetByAssetId.get(key);
				} else {
					cacheValue = this.cache.assetBySymbol.get(key);
				}

				if (cacheValue) {
					resultArray[i] = cacheValue.toJS();
					continue;
				}
			}

			requestedObjects.push(key);
		}

		try {
			requestedObjects = await this.wsApi.database.lookupAssetSymbols(requestedObjects);
		} catch (error) {
			throw error;
		}

		for (let i = 0; i < length; i += 1) {
			if (resultArray[i]) continue;

			let requestedObject = requestedObjects.shift();

			if (!requestedObject) {
				resultArray[i] = null;
				continue;
			}

			requestedObject = fromJS(requestedObject);
			requestedObject = await this._addAssetExtraFields(requestedObject, force);
			resultArray[i] = requestedObject.toJS();

			const idKey = requestedObject.get('id');
			const nameKey = requestedObject.get('symbol');

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
     *  @return {Promise.<*>}
     */
	async getOrderBook(baseAssetName, quoteAssetName, depth = ApiConfig.ORDER_BOOK_DEFAULT_DEPTH) {
		if (!isAssetName(baseAssetName)) throw new Error('Base asset name is invalid');
		if (!isAssetName(quoteAssetName)) throw new Error('Quote asset name is invalid');
		if (!isUInt64(depth) || depth > ApiConfig.ORDER_BOOK_MAX_DEPTH) throw new Error(`Depth should be a integer and must not exceed ${ApiConfig.ORDER_BOOK_MAX_DEPTH}`);

		const result = await this.wsApi.database.getOrderBook(baseAssetName, quoteAssetName, depth);
		return result;
	}

	/**
     *  @method getLimitOrders
     *  @param  {String} baseAssetId
     *  @param  {String} quoteAssetId
     *  @param  {Number} limit
     *
     *  @return {Promise.<*>}
     */
	async getLimitOrders(baseAssetId, quoteAssetId, limit) {
		if (!isAssetId(baseAssetId)) throw new Error('Base asset id is invalid');
		if (!isAssetId(quoteAssetId)) throw new Error('Quote asset id is invalid');
		if (!isUInt64(limit)) throw new Error('Limit should be a integer');

		const result = await this.wsApi.database.getLimitOrders(baseAssetId, quoteAssetId, limit);
		return result;
	}

	/**
     *  @method getCallOrders
     *  @param  {String} assetId
     *  @param  {Number} limit
     *
     *  @return {Promise.<*>}
     */
	async getCallOrders(assetId, limit) {
		if (!isAssetId(assetId)) throw new Error('Asset id is invalid');
		if (!isUInt64(limit)) throw new Error('Limit should be a integer');

		const result = await this.wsApi.database.getCallOrders(assetId, limit);
		return result;
	}

	/**
     *  @method getSettleOrders
     *  @param  {String} assetId
     *  @param  {Number} limit
     *
     *  @return {Promise.<*>}
     */
	async getSettleOrders(assetId, limit) {
		if (!isAssetId(assetId)) throw new Error('Asset id is invalid');
		if (!isUInt64(limit)) throw new Error('Limit should be a integer');

		const result = await this.wsApi.database.getSettleOrders(assetId, limit);
		return result;
	}

	/**
     *  @method getMarginPositions
     *  @param  {String} accountId
     *
     *  @return {Promise.<*>}
     */
	async getMarginPositions(accountId) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		const result = await this.wsApi.database.getMarginPositions(accountId);
		return result;
	}

	/**
     *  @method getTicker
     *
     *  @param  {String} baseAssetName
     *  @param  {String} quoteAssetName
     *
     *  @return {Promise.<*>}
     */
	async getTicker(baseAssetName, quoteAssetName) {
		if (!isAssetName(baseAssetName)) throw new Error('Base asset name is invalid');
		if (!isAssetName(quoteAssetName)) throw new Error('Quote asset name is invalid');

		const result = await this.wsApi.database.getTicker(baseAssetName, quoteAssetName);
		return result;
	}

	/**
     *  @method get24Volume
     *
     *  @param  {String} baseAssetName
     *  @param  {String} quoteAssetName
     *
     *  @return {Promise.<*>}
     */
	async get24Volume(baseAssetName, quoteAssetName) {
		if (!isAssetName(baseAssetName)) throw new Error('Base asset name is invalid');
		if (!isAssetName(quoteAssetName)) throw new Error('Quote asset name is invalid');

		const result = await this.wsApi.database.get24Volume(baseAssetName, quoteAssetName);
		return result;
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
     *  @return {Promise.<*>}
     */
	async getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit = ApiConfig.GET_TRADE_HISTORY_DEFAULT_LIMIT) {
		if (!isAssetName(baseAssetName)) throw new Error('Base asset name is invalid');
		if (!isAssetName(quoteAssetName)) throw new Error('Quote asset name is invalid');
		if (!isUInt64(start)) throw new Error('Start should be UNIX timestamp');
		if (!isUInt64(stop)) throw new Error('Stop should be UNIX timestamp');
		if (!isUInt64(limit) || limit > ApiConfig.GET_TRADE_HISTORY_MAX_LIMIT) throw new Error(`Limit should be capped at ${ApiConfig.GET_TRADE_HISTORY_MAX_LIMIT}`);

		const result = await this.wsApi.database.getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit);
		return result;
	}

	/**
     *  @method getWitnesses
     *
     *  @param  {Array<String>} witnessIds
     *  @param {Boolean} force
     *
     *  @returns {Promise.<List.<Map{id:String,witness_account:String,last_aslot:Number,signing_key:String,pay_vb:String,vote_id:String,total_votes:Number,url:String,total_missed:Number,last_confirmed_block_num:Number,ed_signing_key:String}>>}
     */
	getWitnesses(witnessIds, force = false) {
		if (!isArray(witnessIds)) return Promise.reject(new Error('Witness ids should be an array'));
		if (!witnessIds.every((id) => isWitnessId(id))) return Promise.reject(new Error('Witness ids should contain valid object ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const cacheParams = [{ param: 'id', cache: CacheMaps.OBJECTS_BY_ID }, { param: 'vote_id', cache: CacheMaps.OBJECTS_BY_VOTE_ID }, { param: 'witness_account', cache: CacheMaps.WITNESS_BY_ACCOUNT_ID }];

		return this._getArrayDataWithMultiSave(witnessIds, CacheMaps.WITNESS_BY_WITNESS_ID, 'getWitnesses', force, cacheParams);
	}

	/**
     *  @method getWitnessByAccount
     *
     *  @param  {String} accountId
     *  @param {Boolean} force
     *
     *  @return {Promise.<Map{id:String,witness_account:String,last_aslot:Number,signing_key:String,pay_vb:String,vote_id:String,total_votes:Number,url:String,total_missed:Number,last_confirmed_block_num:Number,ed_signing_key:String}>}
     */
	getWitnessByAccount(accountId, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const cacheParams = [{ param: 'id', cache: CacheMaps.OBJECTS_BY_ID }, { param: 'vote_id', cache: CacheMaps.OBJECTS_BY_VOTE_ID }, { param: 'id', cache: CacheMaps.WITNESS_BY_WITNESS_ID }];

		return this._getSingleDataWithMultiSave(accountId, CacheMaps.WITNESS_BY_ACCOUNT_ID, 'getWitnessByAccount', force, cacheParams);
	}

	/**
     *  @method lookupWitnessAccounts
     *
     *  @param  {String} lowerBoundName
     *  @param  {Number} limit
     *
     *  @return {Promise.<*>}
     */
	async lookupWitnessAccounts(lowerBoundName, limit = ApiConfig.LOOKUP_WITNESS_ACCOUNTS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundName)) throw new Error('LowerBoundName should be string');
		if (!isUInt64(limit) || limit > ApiConfig.LOOKUP_WITNESS_ACCOUNTS_MAX_LIMIT) throw new Error(`Limit should be capped at ${ApiConfig.LOOKUP_WITNESS_ACCOUNTS_MAX_LIMIT}`);

		const result = await this.wsApi.database.lookupWitnessAccounts(lowerBoundName, limit);
		return result;
	}

	/**
     *  @method getWitnessCount
     *
     *  @return {Promise.<Number>}
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
     *  @returns {Promise.<List.<Map{id:String,committee_member_account:String,vote_id:String,total_votes:Number,url:String}>>}
     */
	getCommitteeMembers(committeeMemberIds, force = false) {
		if (!isArray(committeeMemberIds)) return Promise.reject(new Error('CommitteeMemberIds ids should be an array'));
		if (!committeeMemberIds.every((id) => isCommitteeMemberId(id))) return Promise.reject(new Error('CommitteeMemberIds should contain valid committee ids'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const cacheParams = [{ param: 'id', cache: CacheMaps.OBJECTS_BY_ID }, { param: 'vote_id', cache: CacheMaps.OBJECTS_BY_VOTE_ID }, { param: 'committee_member_account', cache: CacheMaps.COMMITTEE_MEMBERS_BY_ACCOUNT_ID }];

		return this._getArrayDataWithMultiSave(committeeMemberIds, CacheMaps.COMMITTEE_MEMBERS_BY_COMMITTEE_MEMBER_ID, 'getCommitteeMembers', force, cacheParams);
	}

	/**
     *  @method getCommitteeMemberByAccount
     *
     *  @param  {String} accountId
     *  @param {Boolean} force
     *
     *  @return {Promise.<Map{id:String,committee_member_account:String,vote_id:String,total_votes:Number,url:String}>}
     */
	getCommitteeMemberByAccount(accountId, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const cacheParams = [{ param: 'id', cache: CacheMaps.OBJECTS_BY_ID }, { param: 'vote_id', cache: CacheMaps.OBJECTS_BY_VOTE_ID }, { param: 'id', cache: CacheMaps.COMMITTEE_MEMBERS_BY_COMMITTEE_MEMBER_ID }];

		return this._getSingleDataWithMultiSave(accountId, CacheMaps.COMMITTEE_MEMBERS_BY_ACCOUNT_ID, 'getCommitteeMemberByAccount', force, cacheParams);
	}

	/**
     *  @method lookupCommitteeMemberAccounts
     *
     *  @param  {String} lowerBoundName
     *  @param  {Number} limit
     *
     *  @return {Promise.<*>}
     */
	async lookupCommitteeMemberAccounts(lowerBoundName, limit = ApiConfig.COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundName)) throw new Error('LowerBoundName should be string');
		if (!isUInt64(limit) || limit > ApiConfig.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT) throw new Error(`Limit should be capped at ${ApiConfig.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT}`);

		const result = await this.wsApi.database.lookupCommitteeMemberAccounts(lowerBoundName, limit);
		return result;
	}

	/**
     *  @method getWorkersByAccount
     *
     *  @param  {String} accountId
     *
     *  @return {Promise.<*>}
     */
	async getWorkersByAccount(accountId) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		const result = await this.wsApi.database.getWorkersByAccount(accountId);
		return result;
	}

	/**
     *  @method lookupVoteIds
     *
     *  @param  {Array<String>} votes
     *  @param  {Boolean} force
     *
     *  @return {Promise.<Array.<{id:String,committee_member_account:String|undefined,witness_account:String|undefined,vote_id:String,total_votes:Number,url:String,last_aslot:Number|undefined,signing_key:String|undefined,pay_vb:String|undefined,total_missed:Number|undefined,last_confirmed_block_num:Number|undefined,ed_signing_key:String|undefined}>>}
     */
	async lookupVoteIds(votes, force = false) {
		if (!isArray(votes)) throw new Error('Votes should be an array');
		if (!votes.every((id) => isVoteId(id))) throw new Error('Votes should contain valid vote_id_type ids');

		const { length } = votes;

		const resultArray = new Array(length).fill(null);
		const requestedObjectsKeys = [];

		for (let i = 0; i < length; i += 1) {
			const key = votes[i];

			if (!force) {
				const cacheValue = this.cache[CacheMaps.OBJECTS_BY_VOTE_ID].get(key);

				if (cacheValue) {
					resultArray[i] = cacheValue;
					continue;
				}
			}

			requestedObjectsKeys.push(key);
		}

		let requestedObjects;

		try {
			requestedObjects = await this.wsApi.database.lookupVoteIds(requestedObjectsKeys);
		} catch (error) {
			throw error;
		}

		for (let i = 0; i < length; i += 1) {
			if (resultArray[i]) continue;
			const key = requestedObjectsKeys.shift();
			let requestedObject = requestedObjects.shift();

			if (!requestedObject) {
				resultArray[i] = null;
				continue;
			}

			requestedObject = new Map(requestedObject);
			const id = requestedObject.get('id');

			this.cache.setInMap(CacheMaps.OBJECTS_BY_VOTE_ID, key, requestedObject)
				.setInMap(CacheMaps.OBJECTS_BY_ID, id, requestedObject);

			if (requestedObject.has('committee_member_account')) {

				const accountId = requestedObject.get('committee_member_account');

				this.cache.setInMap(CacheMaps.COMMITTEE_MEMBERS_BY_ACCOUNT_ID, accountId, requestedObject)
					.setInMap(CacheMaps.COMMITTEE_MEMBERS_BY_COMMITTEE_MEMBER_ID, id, requestedObject);

			} else if (requestedObject.has('witness_account')) {

				const accountId = requestedObject.get('witness_account');

				this.cache.setInMap(CacheMaps.WITNESS_BY_ACCOUNT_ID, accountId, requestedObject)
					.setInMap(CacheMaps.WITNESS_BY_WITNESS_ID, id, requestedObject);

			}

			resultArray[i] = requestedObject;
		}

		return new List(resultArray);
	}

	/**
     *  @method getTransactionHex
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise.<*>}
     */
	async getTransactionHex(transaction) {
		if (!Transactions.transaction.isValid(transaction)) throw new Error('Transaction is invalid');

		// transaction is signed
		const result = await this.wsApi.database.getTransactionHex(transaction);
		return result;
	}

	/**
     *  @method getRequiredSignatures
     *
     *  @param  {Object} transaction
     *  @param  {Array<String>} availableKeys [public keys]
     *
     *  @return {Promise.<*>}
     */
	async getRequiredSignatures(transaction, availableKeys) {
		if (!Transactions.transaction.isValid(transaction)) throw new Error('Transaction is invalid');
		if (!isArray(availableKeys)) throw new Error('Available keys ids should be an array');
		if (!availableKeys.every((key) => isPublicKey(key))) throw new Error('\'Available keys should contain valid public keys');

		const result = await this.wsApi.database.getRequiredSignatures(transaction, availableKeys);
		return result;
	}

	/**
     *  @method getPotentialSignatures
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise.<*>}
     */
	async getPotentialSignatures(transaction) {
		if (!Transactions.transaction.isValid(transaction)) throw new Error('Transaction is invalid');

		const result = await this.wsApi.database.getPotentialSignatures(transaction);
		return result;
	}

	/**
     *  @method getPotentialAddressSignatures
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise.<*>}
     */
	async getPotentialAddressSignatures(transaction) {
		if (!Transactions.transaction.isValid(transaction)) throw new Error('Transaction is invalid');

		const result = await this.wsApi.database.getPotentialAddressSignatures(transaction);
		return result;
	}

	/**
     *  @method verifyAuthority
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise.<*>}
     */
	async verifyAuthority(transaction) {
		if (!Transactions.transaction.isValid(transaction)) throw new Error('Transaction is invalid');

		const result = await this.wsApi.database.verifyAuthority(transaction);
		return result;
	}

	/**
     *  @method verifyAccountAuthority
     *
     *  @param  {Object} accountNameOrId
     *  @param  {Array<String>} signers [public keys]
     *
     *  @return {Promise.<*>}
     */
	async verifyAccountAuthority(accountNameOrId, signers) {
		if (!(isAccountName(accountNameOrId) || isAccountId(accountNameOrId))) throw new Error('Account name or id is invalid');
		if (!isArray(signers)) throw new Error('Signers ids should be an array');
		if (!signers.every((key) => isPublicKey(key))) throw new Error('Signers should contain valid public keys');

		const result = await this.wsApi.database.verifyAccountAuthority(accountNameOrId, signers);
		return result;
	}

	/**
     *  @method validateTransaction
     *
     *  @param  {Object} transaction
     *
     *  @return {Promise.<*>}
     */
	async validateTransaction(transaction) {
		if (!Transactions.signedTransaction.isValid(transaction)) throw new Error('Transaction is invalid');

		// signed transaction
		const result = await this.wsApi.database.validateTransaction(transaction);
		return result;
	}

	/**
     *  @method getRequiredFees
     *
     *  @param  {Array<Object>} operations
     *  @param  {String} assetId
     *
     *  @return {Promise.<List<{asset_id:String,amount:Number}>>}
     */
	async getRequiredFees(operations, assetId = '1.3.0') {
		if (!isArray(operations)) throw new Error('Operations should be an array');
		if (!operations.every((v) => Operations.some((op) => op.isValid(v)))) throw new Error('Operations should contain valid operations');
		if (!isAssetId(assetId)) throw new Error('Asset id is invalid');

		const result = await this.wsApi.database.getRequiredFees(operations, assetId);
		return result;
	}

	/**
     *  @method getProposedTransactions
     *
     *  @param  {String} accountNameOrId
     *
     *  @return {Promise.<*>}
     */
	async getProposedTransactions(accountNameOrId) {
		if (!(isAccountId(accountNameOrId) || isAccountName(accountNameOrId))) throw new Error('AccountNameOrId is invalid');

		const result = await this.wsApi.database.getProposedTransactions(accountNameOrId);
		return result;
	}

	/**
     *  @method getAllContracts
     *
     *  @return {Promise.<List<Map{id:String,statistics:String,suicided:Boolean}>>}
	 */
	async getAllContracts() {

		const result = await this.wsApi.database.getAllContracts();
		return result;
	}

	/**
     *  @method getContractLogs
     *
     *  @param  {String} contractId
     *  @param  {Number} fromBlock
     *  @param  {Number} toBlock
     *
     *  @return {Promise.<Array.<{address:String,log:Array.<String>,data:String}>>}
     */
	async getContractLogs(contractId, fromBlock, toBlock) {
		if (!isContractId(contractId)) throw new Error('ContractId is invalid');
		if (!isUInt64(fromBlock)) throw new Error('FromBlock should be a non negative integer');
		if (!isUInt64(toBlock)) throw new Error('ToBlock should be a non negative integer');
		if (fromBlock > toBlock) throw new Error('FromBlock should be less then toBlock');

		const result = await this.wsApi.database.getContractLogs(contractId, fromBlock, toBlock);
		return result;
	}

	/**
     *  @method getContractResult
     *
     *  @param  {String} resultContractId
     *  @param {Boolean} force
     *
     *  @return {Promise.<{exec_res:{excepted:String,new_address:String,output:String,code_deposit:String,gas_refunded:String,deposit_size:Number,gas_for_deposit:String},tr_receipt: {status_code:String,gas_used:String,bloom:String,log:Array}}>}
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
     *  @return {Promise.<{contract_info:{id:String,statistics:String,suicided:Boolean},code:String,storage:Array.<Array>}>}
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
	async callContractNoChangingState(contractId, accountId, assetId, bytecode) {
		if (!isContractId(contractId)) throw new Error('ContractId is invalid');
		if (!isAccountId(accountId)) throw new Error('AccountId is invalid');
		if (!isAssetId(assetId)) throw new Error('AssetId is invalid');
		if (!isBytecode(bytecode)) throw new Error('Bytecode is invalid');

		const result = await this.wsApi.database.callContractNoChangingState(contractId, accountId, assetId, bytecode);
		return result;
	}

	/**
     *  @method getContracts
     *
     *  @param  {Array<String>} contractIds
	 *  @param {Boolean} force
     *
     *  @return {Promise.<List<Map{id:String,statistics:String,suicided:Boolean}>>}
     */
	getContracts(contractIds, force = false) {
		if (!isArray(contractIds)) return Promise.reject(new Error('ContractIds ids should be an array'));
		if (!contractIds.every((id) => isContractId(id))) return Promise.reject(new Error('ContractIds should contain valid contract ids'));

		return this._getArrayDataWithMultiSave(contractIds, CacheMaps.CONTRACTS_BY_CONTRACT_ID, 'getContracts', force);
	}

	/**
     *  @method getContractBalances
     *
     *  @param  {String} contractId
     *  @param {Boolean} force
     *
     *  @return {Promise.<Map>}
     */
	async getContractBalances(contractId, force = false) {
		if (!isContractId(contractId)) throw new Error('ContractId is invalid');
		if (!isBoolean(force)) throw new Error('Force should be a boolean');

		const result = await this.wsApi.database.getContractBalances(contractId);
		return result;
	}

	/**
     *  @method getRecentTransactionById
     *
     *  @param  {String} transactionId
     *
     *  @return {Promise.<*>}
     */
	async getRecentTransactionById(transactionId) {
		if (!isRipemd160(transactionId)) throw new Error('Transaction id should be a 20 bytes hex string');

		const result = await this.wsApi.database.getRecentTransactionById(transactionId);
		return result;
	}

	/**
     *  @method registerAccount
     *
     *  @param  {String} name
     * 	@param  {String} ownerKey
     * 	@param  {String} activeKey
     * 	@param  {String} echoRandKey
     *
     *  @return {Promise.<null>}
     */
	async registerAccount(name, ownerKey, activeKey, memoKey, echoRandKey) {
		if (!isAccountName(name)) throw new Error('Name is invalid');
		if (!isPublicKey(ownerKey)) throw new Error('Owner public key is invalid');
		if (!isPublicKey(activeKey)) throw new Error('Active public key is invalid');
		if (!isPublicKey(memoKey)) throw new Error('Memo public key is invalid');
		if (!isEchoRandKey(echoRandKey)) throw new Error('Echo rand key is invalid');

		const result = await this.wsApi.registration.registerAccount(name, ownerKey, activeKey, memoKey, echoRandKey);
		return result;
	}

	/**
     *  @method getAccountHistory
     *  Get operations relevant to the specified account.
     *
     *  @param {String} accountId
     *  @param {String} stop [Id of the earliest operation to retrieve]
     *  @param {Number} limit     [count operations (max 100)]
     *  @param {String} start [Id of the most recent operation to retrieve]
     *
     *  @return {Promise.<List.<Map{is:String,op:Array,result:Array,block_num:Number,trx_in_block:Number,op_in_block:Number,virtual_op:Number}>>}
     */
	async getAccountHistory(accountId, stop = ApiConfig.START_OPERATION_HISTORY_ID, limit = ApiConfig.ACCOUNT_HISTORY_DEFAULT_LIMIT, start = ApiConfig.STOP_OPERATION_HISTORY_ID) {
		if (!isAccountId(accountId)) throw new Error('Account is invalid');
		if (!isOperationHistoryId(stop)) throw new Error('Stop parameter is invalid');
		if (!isUInt64(limit) || limit > ApiConfig.ACCOUNT_HISTORY_MAX_LIMIT) throw new Error(`Limit should be capped at ${ApiConfig.ACCOUNT_HISTORY_MAX_LIMIT}`);
		if (!isOperationHistoryId(start)) throw new Error('Start parameter is invalid');

		const result = await this.wsApi.history.getAccountHistory(accountId, stop, limit, start);
		return result;
	}

	/**
     *  @method getRelativeAccountHistory
     *  Get operations relevant to the specified account referenced
     *  by an event numbering specific to the account.
     *
     *  @param {String} accountId
     *  @param {Number} stop [Sequence number of earliest operation]
     *  @param {Number} limit     [count operations (max 100)]
     *  @param {Number} start [Sequence number of the most recent operation to retrieve]
     *
     *  @return {Promise.<Array.<{id:String,op:Array,result:Array,block_num:Number,trx_in_block:Number,op_in_trx:Number,virtual_op:Number}>>}
     */
	async getRelativeAccountHistory(accountId, stop = ApiConfig.RELATIVE_ACCOUNT_HISTORY_STOP, limit = ApiConfig.RELATIVE_ACCOUNT_HISTORY_DEFAULT_LIMIT, start = ApiConfig.RELATIVE_ACCOUNT_HISTORY_START) {
		if (!isAccountId(accountId)) throw new Error('Account is invalid');
		if (!isUInt64(stop)) throw new Error('Stop parameter should be non negative number');
		if (!isUInt64(limit) || limit > ApiConfig.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT) throw new Error(`Limit should be capped at ${ApiConfig.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT}`);
		if (!isUInt64(start)) throw new Error('Start parameter should be non negative number');

		const result = await this.wsApi.history.getRelativeAccountHistory(accountId, stop, limit, start);
		return result;
	}

	/**
     *  @method getAccountHistoryOperations
     *  Get only asked operations relevant to the specified account.
     *
     *  @param {String} accountId
     *  @param {String} operationId
     *  @param {Number} start [Id of the most recent operation to retrieve]
     *  @param {Number} stop [Id of the earliest operation to retrieve]
     *  @param {Number} limit     [count operations (max 100)]
     *
     *  @return {Promise<Array.<{ id:String,op:Array,result:Array,block_num:Number,trx_in_block:Number,op_in_trx:Number,virtual_op:Number}>>}
     */
	async getAccountHistoryOperations(accountId, operationId, start = ApiConfig.START_OPERATION_HISTORY_ID, stop = ApiConfig.STOP_OPERATION_HISTORY_ID, limit = ApiConfig.ACCOUNT_HISTORY_OPERATIONS_DEFAULT_LIMIT) {
		if (!isAccountId(accountId)) throw new Error('Account is invalid');
		if (!isOperationId(operationId)) throw new Error('Operation id invalid');
		if (!isOperationHistoryId(start)) throw new Error('Start parameter is invalid');
		if (!isOperationHistoryId(stop)) throw new Error('Stop parameter is invalid');
		if (!isUInt64(limit) || limit > ApiConfig.ACCOUNT_HISTORY_OPERATIONS_MAX_LIMIT) throw new Error(`Limit should be capped at ${ApiConfig.ACCOUNT_HISTORY_OPERATIONS_MAX_LIMIT}`);

		const result = await this.wsApi.history.getAccountHistoryOperations(accountId, operationId, start, stop, limit);
		return result;
	}

	/**
     *  @method getContractHistory
     *  Get operations relevant to the specified account.
     *
     *  @param {String} contractId
     *  @param {String} stop [Id of the earliest operation to retrieve]
     *  @param {Number} limit     [count operations (max 100)]
     *  @param {String} start [Id of the most recent operation to retrieve]
     *
     *  @return {Promise.<Array.<*>>}
     */
	async getContractHistory(contractId, stop = ApiConfig.STOP_OPERATION_HISTORY_ID, limit = ApiConfig.CONTRACT_HISTORY_DEFAULT_LIMIT, start = ApiConfig.START_OPERATION_HISTORY_ID) {
		if (!isContractId(contractId)) throw new Error('Contract is invalid');
		if (!isOperationHistoryId(stop)) throw new Error('Stop parameter is invalid');
		if (!isUInt64(limit) || limit > ApiConfig.CONTRACT_HISTORY_MAX_LIMIT) throw new Error(`Limit should be capped at ${ApiConfig.CONTRACT_HISTORY_MAX_LIMIT}`);
		if (!isOperationHistoryId(start)) throw new Error('Start parameter is invalid');

		const result = await this.wsApi.history.getContractHistory(contractId, stop, limit, start);
		return result;
	}

	setOptions() {}

}

export default API;
