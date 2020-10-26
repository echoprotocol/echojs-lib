/* eslint-disable no-continue,no-await-in-loop,camelcase,no-restricted-syntax */
import * as assert from 'assert';
import { Map, List, fromJS } from 'immutable';
import {
	isNumber,
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
	isRipemd160,
	isPublicKey,
	isCommitteeMemberId,
	isBitAssetId,
	isDynamicAssetDataId,
	isEchoRandKey,
	isOperationId,
	isDynamicGlobalObjectId,
	isBtcAddressId,
	isObject,
	isInt64,
	validateSidechainType,
} from '../utils/validators';

import { solveRegistrationTask, validateRegistrationOptions } from '../utils/pow-solver';

/** @typedef {import('./ws-api').default} WSAPI */

import { ECHO_ASSET_ID, DYNAMIC_GLOBAL_OBJECT_ID, API_CONFIG, CACHE_MAPS } from '../constants';
import { transaction, signedTransaction, operation, basic, chain } from '../serializers';
import { PublicKey } from '../crypto';
import { CHAIN_API } from '../constants/ws-constants';
import { toRawContractLogsFilterOptions } from '../utils/converters';

const { operationHistoryId } = chain.ids;

/** @typedef {import("bignumber.js").default} BigNumber */
/** @typedef {import("../../types/interfaces/vm/types").Log} Log */
/** @typedef {import("./ws-api/database-api").SidechainType} SidechainType */
/** @typedef {typeof basic.integers["uint64"]["__TInput__"]} UInt64 */

/** @typedef {
*	{
*  		previous:String,
*  		timestamp:String,
*  		account:String,
*  		transaction_merkle_root:String,
*  		state_root_hash:String,
*  		result_root_hash:String,
*  		extensions:Array
*  	}
* 	} BlockHeader */

/** @typedef {
*	{
*  		previous:String,
*  		timestamp:String,
*  		account:String,
*  		transaction_merkle_root:String,
*  		state_root_hash:String,
*  		result_root_hash:String,
*  		extensions:Array,
*  		ed_signature:String,
*  		round:Number,
*  		rand:String,
*  		cert:{
*  			_rand:String,
*  			_block_hash:String,
*  			_producer:Number,
*  			_signatures:Array.<{
*  				_step:Number,
*  				_value:Number,
*  				_producer:Number,
*  				_bba_sign:String
*  			}>
*  		},
*  		transactions:Array.<{
*  			ref_block_num:Number,
*  			ref_block_prefix:Number,
*  			fees_collected:Number,
*  			expiration:String,
*  			operations:Array,
*  			extensions:Array,
*  			signatures:Array.<String>,
*  			operation_results:Array.<Array>
*  		}>
*  	}
* 	} Block */

/** @typedef {
*		{
*  			ref_block_num:Number,
*  			ref_block_prefix:Number,
*  			fees_collected:Number,
*  			expiration:String,
*  			operations:Array.<*>,
*  			extensions:Array,
*  			signatures:Array.<String>,
*  			operation_results:Array.<Array.<*>>
*      }
* 	} Transaction */

/** @typedef {
*	{
*  		id:String,
*  		chain_id:String,
*  	}
* 	} ChainProperties */

/** @typedef {
*	{
* 	 		id:String,
* 	 		parameters:{
* 	 			current_fees:{
* 	 				parameters:Array.<*>,
* 	 				scale:Number
* 	 			},
* 	 			maintenance_interval:Number,
* 	 			maintenance_skip_slots:Number,
* 	 			committee_proposal_review_period:Number,
* 	 			maximum_transaction_size:Number,
* 	 			maximum_block_size:Number,
* 	 			maximum_time_until_expiration:Number,
* 	 			maximum_proposal_lifetime:Number,
* 	 			maximum_asset_whitelist_authorities:Number,
* 	 			maximum_asset_feed_publishers:Number,
* 	 			maximum_committee_count:Number,
* 	 			maximum_authority_membership:Number,
* 	 			reserve_percent_of_fee:Number,
* 	 			network_percent_of_fee:Number,
* 	 			cashback_vesting_period_seconds:Number,
* 	 			max_predicate_opcode:Number,
* 	 			accounts_per_fee_scale:Number,
* 	 			account_fee_scale_bitshifts:Number,
* 	 			max_authority_depth:Number,
*				frozen_balances_multipliers:Array,
* 	 			echorand_config:{
* 	 				_time_net_1mb:Number,
* 	 				_time_net_256b:Number,
* 	 				_creator_count:Number,
* 	 				_verifier_count:Number,
* 	 				_ok_threshold:Number,
* 	 				_max_bba_steps:Number,
* 	 				_gc1_delay:Number
* 	 			},
* 	 			sidechain_config:{
* 	 				eth_contract_address:String,
* 	 				eth_committee_update_method:{method:String,gas:Number},
* 	 				eth_gen_address_method:{method:String,gas:Number},
* 	 				eth_withdraw_method:{method:String,gas:Number},
* 	 				eth_update_addr_method:{method:String,gas:Number},
* 	 				eth_update_contract_address:{method:String,gas:Number},
* 	 				eth_withdraw_token_method:{method:String,gas:Number},
* 	 				eth_collect_tokens_method:{method:String,gas:Number},
* 	 				eth_committee_updated_topic:String,
* 	 				eth_gen_address_topic:String,
* 	 				eth_deposit_topic:String,
* 	 				eth_withdraw_topic:String,
* 	 				erc20_deposit_topic:String,
* 	 				erc20_withdraw_topic:String,
* 	 				ETH_asset_id:String,
* 	 				BTC_asset_id:String,
* 	 				fines:{generate_eth_address:Number|String},
* 	 				gas_price:Number|String,
* 	 				satoshis_per_byte:Number,
* 	 				coefficient_waiting_blocks:Number,
* 	 				btc_deposit_withdrawal_min:Number|String,
* 	 				btc_deposit_withdrawal_fee:Number|String,
* 	 			},
* 	 			gas_price:{
* 	 				price:Number|String,
* 	 				gas_amount:Number|String,
* 	 			},
* 	 			extensions:Array
* 	 		},
* 	 		active_committee_members:Array.<Array.<String>>
*      }
*  	} GlobalProperties */

/** @typedef {
*	{
*  		ECHO_SYMBOL:String,
*  		ECHO_ADDRESS_PREFIX:String,
*  		ECHO_ED_PREFIX:String,
*  		ECHO_MIN_ACCOUNT_NAME_LENGTH:Number,
*  		ECHO_MAX_ACCOUNT_NAME_LENGTH:Number,
*  		ECHO_MIN_ASSET_SYMBOL_LENGTH:Number,
*  		ECHO_MAX_ASSET_SYMBOL_LENGTH:Number,
*  		ECHO_MAX_SHARE_SUPPLY:String,
*  		ECHO_MAX_PAY_RATE:Number,
*  		ECHO_MAX_SIG_CHECK_DEPTH:Number,
*  		ECHO_MIN_TRANSACTION_SIZE_LIMIT:Number,
*  		ECHO_MIN_BLOCK_INTERVAL:Number,
*  		ECHO_MAX_BLOCK_INTERVAL:Number,
*  		ECHO_DEFAULT_BLOCK_INTERVAL:Number,
*  		ECHO_DEFAULT_MAX_TRANSACTION_SIZE:Number,
*  		ECHO_DEFAULT_MAX_BLOCK_SIZE:Number,
*  		ECHO_DEFAULT_MAX_TIME_UNTIL_EXPIRATION:Number,
*  		ECHO_DEFAULT_MAINTENANCE_INTERVAL:Number,
*  		ECHO_DEFAULT_MAINTENANCE_SKIP_SLOTS:Number,
*  		ECHO_MIN_UNDO_HISTORY:Number,
*  		ECHO_MAX_UNDO_HISTORY:Number,
*  		ECHO_MIN_BLOCK_SIZE_LIMIT:Number,
*  		ECHO_MIN_TRANSACTION_EXPIRATION_LIMIT:Number,
*  		ECHO_BLOCKCHAIN_PRECISION:Number,
*  		ECHO_BLOCKCHAIN_PRECISION_DIGITS:Number,
*  		ECHO_DEFAULT_TRANSFER_FEE:Number,
*  		ECHO_MAX_INSTANCE_ID:String,
*  		ECHO_100_PERCENT:Number,
*  		ECHO_1_PERCENT:Number,
*  		ECHO_MAX_MARKET_FEE_PERCENT:Number,
*  		ECHO_DEFAULT_FORCE_SETTLEMENT_DELAY:Number,
*  		ECHO_DEFAULT_FORCE_SETTLEMENT_OFFSET:Number,
*  		ECHO_DEFAULT_FORCE_SETTLEMENT_MAX_VOLUME:Number,
*  		ECHO_DEFAULT_PRICE_FEED_LIFETIME:Number,
*  		ECHO_MAX_FEED_PRODUCERS:Number,
*  		ECHO_DEFAULT_MAX_AUTHORITY_MEMBERSHIP:Number,
*  		ECHO_DEFAULT_MAX_ASSET_WHITELIST_AUTHORITIES:Number,
*  		ECHO_DEFAULT_MAX_ASSET_FEED_PUBLISHERS:Number,
*  		ECHO_COLLATERAL_RATIO_DENOM:Number,
*  		ECHO_MIN_COLLATERAL_RATIO:Number,
*  		ECHO_MAX_COLLATERAL_RATIO:Number,
*  		ECHO_DEFAULT_MAINTENANCE_COLLATERAL_RATIO:Number,
*  		ECHO_DEFAULT_MAX_SHORT_SQUEEZE_RATIO:Number,
*  		ECHO_DEFAULT_MARGIN_PERIOD_SEC:Number,
*  		ECHO_DEFAULT_MAX_COMMITTEE:Number,
*  		ECHO_DEFAULT_MAX_PROPOSAL_LIFETIME_SEC:Number,
*  		ECHO_DEFAULT_COMMITTEE_PROPOSAL_REVIEW_PERIOD_SEC:Number,
*  		ECHO_DEFAULT_NETWORK_PERCENT_OF_FEE:Number,
*  		ECHO_DEFAULT_MAX_BULK_DISCOUNT_PERCENT:Number,
*  		ECHO_DEFAULT_BULK_DISCOUNT_THRESHOLD_MIN:Number,
*  		ECHO_DEFAULT_BULK_DISCOUNT_THRESHOLD_MAX:String,
*  		ECHO_DEFAULT_CASHBACK_VESTING_PERIOD_SEC:Number,
*  		ECHO_DEFAULT_BURN_PERCENT_OF_FEE:Number,
*  		ECHO_DEFAULT_MAX_ASSERT_OPCODE:Number,
*  		ECHO_DEFAULT_ACCOUNTS_PER_FEE_SCALE:Number,
*  		ECHO_DEFAULT_ACCOUNT_FEE_SCALE_BITSHIFTS:Number,
*  		ECHO_MAX_URL_LENGTH:Number,
*  		ECHO_NEAR_SCHEDULE_CTR_IV:String,
*  		ECHO_FAR_SCHEDULE_CTR_IV:String,
*  		ECHO_CORE_ASSET_CYCLE_RATE:Number,
*  		ECHO_CORE_ASSET_CYCLE_RATE_BITS:Number,
*  		ECHO_MAX_INTEREST_APR:Number,
*  		ECHO_COMMITTEE_ACCOUNT:String,
*  		ECHO_RELAXED_COMMITTEE_ACCOUNT:String,
*  		ECHO_NULL_ACCOUNT:String,
*  		ECHO_TEMP_ACCOUNT:String
*  	}
*  	} Config */

/** @typedef {
*	{
*  		id:String,
*  		head_block_number:Number,
*  		head_block_id:String,
*  		time:String,
*  		next_maintenance_time:String,
*  		last_maintenance_time:String,
*  		committee_budget:Number,
*  		accounts_registered_this_interval:Number,
*  		recently_missed_count:Number,
*  		current_aslot:Number,
*  		recent_slots_filled:String,
*  		dynamic_flags:Number,
*  		last_irreversible_block_num:Number,
*  	}
*  	} DynamicGlobalProperties */

/** @typedef {
* 	{
*  		id:String,
*  		committee_member_account:String,
*  		vote_id:String,
*  		total_votes:Number,
*  		url:String,
*  		eth_address:String,
*  		btc_public_key:String
*  	}
*  	} Committee */

/** @typedef {
* 			{
* 				id:String,
* 				membership_expiration_date:String,
* 				registrar:String,
* 				referrer:String,
* 				lifetime_referrer:String,
* 				network_fee_percentage:Number,
* 				lifetime_referrer_fee_percentage:Number,
* 				referrer_rewards_percentage:Number,
*				active_delegate_share: Number,
* 				name:String,
* 				owner:{
* 					weight_threshold:Number,
* 					account_auths:Array,
* 					key_auths:Array,
* 					},
* 				active:{
* 					weight_threshold:Number,
* 					account_auths:Array,
* 					key_auths:Array,
* 					},
* 				ed_key:String,
* 				options:{
* 					voting_account:String,
* 					delegating_account:String,
* 					num_committee:Number,
* 					votes:Array,
* 					extensions:Array
* 				},
* 				statistics:String,
* 				whitelisting_accounts:Array,
* 				blacklisting_accounts:Array,
* 				whitelisted_accounts:Array,
* 				blacklisted_accounts:Array,
* 				owner_special_authority:Array,
* 				active_special_authority:Array,
* 				top_n_control_flags:Number
* 			}
* 	} Account */

/** @typedef {
* 		{
*  			id:String,
* 			op:Array,
* 			result:Array,
* 			block_num:Number,
* 			trx_in_block:Number,
* 			op_in_block:Number,
* 			virtual_op:Number,
* 			proposal_hist_id: Number|undefined
*  		}
*  	} AccountHistory */

/** @typedef {
* 			{
* 				id:String,
* 				membership_expiration_date:String,
* 				registrar:String,
* 				referrer:String,
* 				lifetime_referrer:String,
* 				network_fee_percentage:Number,
* 				lifetime_referrer_fee_percentage:Number,
* 				referrer_rewards_percentage:Number,
* 				name:String,
* 				owner:{
* 					weight_threshold:Number,
* 					account_auths:Array,
* 					key_auths:Array,
* 					},
* 				active:{
* 					weight_threshold:Number,
* 					account_auths:Array,
* 					key_auths:Array,
* 					},
* 				ed_key:String,
* 				options:{
* 					voting_account:String,
* 					delegating_account:String,
* 					num_committee:Number,
* 					votes:Array,
* 					extensions:Array
* 				},
* 				statistics:String,
* 				whitelisting_accounts:Array,
* 				blacklisting_accounts:Array,
* 				whitelisted_accounts:Array,
* 				blacklisted_accounts:Array,
* 				owner_special_authority:Array,
* 				active_special_authority:Array,
* 				top_n_control_flags:Number,
* 				history:Array.<AccountHistory>,
* 				balances:Object,
* 				limit_orders:Object,
* 				call_orders:Object,
* 				proposals:Object
* 			}
* 	} FullAccount */

/** @typedef {
* 		{
*  			id:String,
*  			symbol:String,
*  			precision:Number,
*  			issuer:String,
*  			options:{
*  				max_supply:String,
*  				market_fee_percent:Number,
*  				max_market_fee:String,
*  				issuer_permissions:Number,
*  				flags:Number,
*  				core_exchange_rate:Object,
*  				whitelist_authorities:Array,
*  				blacklist_authorities:Array,
*  				whitelist_markets:Array,
*  				blacklist_markets:Array,
*  				description:String,
*  				extensions:Array
*  			},
*  			dynamic_asset_data_id:String,
*  			dynamic:Object,
*  			bitasset:(Object|undefined)
*  		}
*  	} Asset */

/** @typedef {
*	{
*  		id:String,
*  		committee_member_account:(String|undefined),
*  		vote_id:String,
*  		total_votes:Number,
*  		url:String,
*  		last_aslot:(Number|undefined),
*  		signing_key:(String|undefined),
*  		pay_vb:(String|undefined),
*  		total_missed:(Number|undefined),
*  		last_confirmed_block_num:(Number|undefined),
*  		ed_signing_key:(String|undefined)
*  	}
*  	} Vote */

/** @typedef {
*	{
*  		address:String,
*  		log:Array.<String>,
*  		data:String
 *  	trx_num:Number,
 *  	op_num:Number
*  	}
*  	} ContractLogs */

/** @typedef {
*	[0,
*		{
*  			exec_res:{
*  				excepted:String,
*  				new_address:String,
*  				output:String,
*  				code_deposit:String,
*  				deposit_size:Number,
*  				gas_for_deposit:String
*  			},
*  			tr_receipt:{
*  				status_code:String,
*  				gas_used:String,
*  				bloom:String,
*  				log:Array
*  			}
*  		}
*	] | [1, { output: String }]
*  	} ContractResult */

/** @typedef {
*	{
*  		block_num:Number,
*  		id:String,
*  		op:[
*			Number,
*			{
*				amount:{
*					amount:Number,
*					asset_id:String
*				},
*				extensions: [],
*				fee:{
*					amount:Number,
*					asset_id:String
*				},
*				from:String,
*				to:String
*			}
*		],
*  		op_in_trx:Number,
*		result: [0, {}],
*  		trx_in_block:Number,
*  		virtual_op:Number,
*  		proposal_hist_id: Number
*  	}
* 	} ContractHistory */

class API {

	/**
	 *
	 * @param {Cache} cache
	 * @param {import("./engine").default} engine
	 * @param {import("./index").RegistrationOptions} [registrationOptions]
	 */
	constructor(cache, engine, registrationOptions = {}) {
		this.cache = cache;
		this.engine = engine;
		this.registrationOptions = validateRegistrationOptions(registrationOptions);
	}

	/**
	 *
	 * @param {String} cacheName
	 * @param {String} methodName
	 * @param {Boolean} force
	 *
	 * @return {Promise.<Object>}
	 * @private
	 */
	async _getConfigurations(cacheName, methodName, force = false) {
		if (!force) {
			const cacheValue = this.cache[cacheName];

			if (
				cacheValue && (isString(cacheValue) || (cacheValue instanceof Map && cacheValue.size !== 0))
			) {
				return cacheValue.toJS();
			}
		}

		try {
			const requestedObject = await this.engine.database[methodName]();

			this.cache.set(cacheName, new Map(requestedObject));

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
	 * @return {Promise.<Array.<Object>>}
	 * @private
	 */
	async _getArrayDataWithMultiSave(array, cacheName, methodName, force = false, cacheParams = []) {
		const { length } = array;

		const resultArray = new Array(length).fill(null);
		let requestedObjectsKeys = [];

		if (force) {
			requestedObjectsKeys = array;
		} else {
			for (let i = 0; i < length; i += 1) {
				const key = array[i];

				const cacheValue = this.cache[cacheName].get(key);

				if (cacheValue) {
					resultArray[i] = cacheValue.toJS();
					continue;
				}

				requestedObjectsKeys.push(key);
			}
		}

		if (requestedObjectsKeys.length === 0) {
			return resultArray;
		}

		let requestedObjects;

		try {
			requestedObjects = await this.engine.database[methodName](requestedObjectsKeys);
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

			resultArray[i] = requestedObject;
			requestedObject = fromJS(requestedObject);

			this.cache.setInMap(cacheName, key, requestedObject);
			for (const { param, cache } of cacheParams) {
				this.cache.setInMap(cache, requestedObject.get(param), requestedObject);
			}
		}

		return resultArray;
	}

	/**
	 *
	 * @param {*} key
	 * @param {String} cacheName
	 * @param {String} methodName
	 * @param {Boolean} force
	 * @param {Array} cacheParams
	 *
	 * @return {Promise.<Object>}
	 * @private
	 */
	async _getSingleDataWithMultiSave(key, cacheName, methodName, force = false, cacheParams = []) {
		if (!force) {
			const cacheValue = this.cache[cacheName].get(key);

			if (cacheValue) {
				return cacheValue.toJS();
			}
		}

		try {
			let requestedObject = await this.engine.database[methodName](key);
			if (!requestedObject) {
				return requestedObject;
			}

			requestedObject = fromJS(requestedObject);
			this.cache.setInMap(cacheName, key, requestedObject);
			for (const { param, cache } of cacheParams) {
				this.cache.setInMap(cache, requestedObject.get(param), requestedObject);
			}

			return requestedObject.toJS();
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
	 * @return {Promise.<Object>}
	 * @private
	 */
	async _getSingleDataByCompositeParams(key, cacheName, methodName, force = false, ...params) {
		if (!force) {
			const cacheValue = this.cache[cacheName].get(key);

			if (cacheValue) {
				return cacheValue.toJS();
			}
		}

		try {

			const requestedObject = await this.engine.database[methodName](...params);

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
	 * @return {Promise.<Asset>}
	 * @private
	 */
	async _addAssetExtraFields(requestedObject, force = false) {
		const bitAssetId = requestedObject.get('bitasset_data_id');
		const dynamicAssetDataId = requestedObject.get('dynamic_asset_data_id');

		if (bitAssetId) {
			const bitasset = await this.getBitAssetData(bitAssetId, force);
			if (bitasset) {
				requestedObject = requestedObject.set('bitasset', fromJS(bitasset));
				if (!this.cache.bitAssetIdToAssetId.get(bitAssetId)) {
					this.cache.setInMap(CACHE_MAPS.BIT_ASSET_ID_TO_ASSET_ID, bitAssetId, requestedObject.get('id'));
				}
			}
		}

		if (dynamicAssetDataId) {
			const dynamicAssetData = await this.getDynamicAssetData(dynamicAssetDataId, force);
			if (dynamicAssetData) {
				requestedObject = requestedObject.set('dynamic', fromJS(dynamicAssetData));
				if (!this.cache.dynamicIdToAssetId.get(dynamicAssetDataId)) {
					this.cache
						.setInMap(CACHE_MAPS.DYNAMIC_ID_TO_ASSET_ID, dynamicAssetDataId, requestedObject.get('id'));
				}

			}
		}
		return requestedObject;
	}

	/**
	 *
	 * @param {Map} account
	 * @param {Number} limit
	 * @return {Promise.<FullAccount>}
	 * @private
	 */
	async _addHistory(account, limit = API_CONFIG.ACCOUNT_HISTORY_DEFAULT_LIMIT) {
		const start = API_CONFIG.START_OPERATION_HISTORY_ID;
		let stop = start;

		let history = account.get('history');

		if (history && history.size) {
			stop = history.first().get('id');
		} else {
			history = new List();
		}

		try {
			const accountHistory = await this.getAccountHistory(account.get('id'), stop, limit, start);

			history = history.concat(fromJS(accountHistory));

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
	 * @return {Promise.<Array.<*>>}
	 * @private
	 */
	async _getObjectsById(array, cacheName, methodName, force = false) {
		const { length } = array;

		const resultArray = new Array(length).fill(null);
		let requestedObjectsKeys = [];

		if (force) {
			requestedObjectsKeys = array;
		} else {
			for (let i = 0; i < length; i += 1) {
				const key = array[i];

				const cacheValue = this.cache[cacheName].get(key);

				if (cacheValue) {
					resultArray[i] = cacheValue.toJS();
					continue;
				}

				requestedObjectsKeys.push(key);
			}
		}


		if (requestedObjectsKeys.length === 0) {
			return resultArray;
		}

		let requestedObjects;

		try {
			requestedObjects = await this.engine.database[methodName](requestedObjectsKeys);


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

					this.cache.setInMap(CACHE_MAPS.ACCOUNTS_BY_ID, key, requestedObject)
						.setInMap(CACHE_MAPS.ACCOUNTS_BY_NAME, nameKey, key);

				} else if (isAssetId(key)) {
					const nameKey = requestedObject.get('symbol');

					requestedObject = await this._addAssetExtraFields(requestedObject, force);

					this.cache.setInMap(CACHE_MAPS.ASSET_BY_ASSET_ID, key, requestedObject)
						.setInMap(CACHE_MAPS.ASSET_BY_SYMBOL, nameKey, requestedObject);

				} else if (isDynamicGlobalObjectId(key)) {
					this.cache.set(CACHE_MAPS.DYNAMIC_GLOBAL_PROPERTIES, requestedObject);
				} else if (isCommitteeMemberId(key)) {

					const accountId = requestedObject.get('committee_member_account');
					const voteId = requestedObject.get('vote_id');

					this.cache.setInMap(CACHE_MAPS.OBJECTS_BY_VOTE_ID, voteId, requestedObject)
						.setInMap(CACHE_MAPS.COMMITTEE_MEMBERS_BY_ACCOUNT_ID, accountId, requestedObject)
						.setInMap(CACHE_MAPS.COMMITTEE_MEMBERS_BY_COMMITTEE_MEMBER_ID, key, requestedObject);

				} else if (isBitAssetId(key)) {

					this.cache.setInMap(CACHE_MAPS.BIT_ASSETS_BY_BIT_ASSET_ID, key, requestedObject);

				} else if (isDynamicAssetDataId(key)) {

					this.cache
						.setInMap(CACHE_MAPS.DYNAMIC_ASSET_DATA_BY_DYNAMIC_ASSET_DATA_ID, key, requestedObject);

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
	 *  @return {Promise.<Array.<Object>>}
	 */
	getObjects(objectIds, force = false) {
		if (!isArray(objectIds)) return Promise.reject(new Error('ObjectIds should be a array'));
		if (!objectIds.every((id) => isObjectId(id))) {
			return Promise.reject(new Error('ObjectIds should contain valid valid object ids'));
		}
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getObjectsById(objectIds, CACHE_MAPS.OBJECTS_BY_ID, 'getObjects', force);
	}

	/**
	 *  @method getObject
	 *  @param  {String} objectId
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<Object>}
	 */
	async getObject(objectId, force = false) {
		if (!isObjectId(objectId)) return Promise.reject(new Error('ObjectId should be an object id'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return (await this.getObjects([objectId], force))[0];
	}

	/**
	 * @param {string} contractId
	 * @returns {Promise<boolean>}
	 */
	async checkERC20Token(contractId) {
		if (!isContractId(contractId)) throw new Error('invalid contract id format');
		return this.engine.database.checkERC20Token(contractId);
	}

	/**
	 *
	 * 	@param {String} bitAssetId
	 *  @param {Boolean} force
	 * 	@return  {Promise.<Object>}
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
	 * 	@return  {Promise.<Object>}
	 * 	@private
	 */
	getDynamicAssetData(dynamicAssetDataId, force = false) {
		if (!isDynamicAssetDataId(dynamicAssetDataId)) {
			return Promise.reject(new Error('Bit dynamic asset data id is invalid'));
		}
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this.getObject(dynamicAssetDataId, force);
	}

	/**
	 *  @method getBlockHeader
	 *  @param  {Number} blockNum
	 *
	 *  @return {
	 *  	Promise.<BlockHeader>
	 *  }
	 */
	getBlockHeader(blockNum) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));

		return this._getSingleDataWithMultiSave(blockNum, CACHE_MAPS.BLOCK_HEADERS_BY_BLOCK_NUMBER, 'getBlockHeader');
	}

	/**
	 *  @method getBlock
	 *  @param  {Number} blockNum
	 *
	 *  @return {
	 *  	Promise.<Block>
	 *  }
	 */
	getBlock(blockNum) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));

		return this._getSingleDataWithMultiSave(blockNum, CACHE_MAPS.BLOCKS, 'getBlock');
	}

	/**
	 *  @method getTransaction
	 *  @param  {Number} blockNum
	 *  @param  {Number} transactionIndex
	 *
	 *  @return {
	 *  	Promise.<Transaction>
	 *  }
	 */
	getTransaction(blockNum, transactionIndex) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));
		if (!isUInt64(transactionIndex)) {
			return Promise.reject(new Error('TransactionIndex should be a non negative integer'));
		}

		const key = `${blockNum}:${transactionIndex}`;

		return this._getSingleDataByCompositeParams(
			key,
			CACHE_MAPS.TRANSACTIONS_BY_BLOCK_AND_INDEX,
			'getTransaction',
			false,
			blockNum,
			transactionIndex,
		);
	}

	/**
	 *  @method getChainProperties
	 *  @param {Boolean} force
	 *
	 *  @return {
	 *  	Promise.<ChainProperties>
	 * 	}
	 */
	getChainProperties(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations(CACHE_MAPS.CHAIN_PROPERTIES, 'getChainProperties', force);
	}

	/**
	 *  @method getGlobalProperties
	 *
	 *  @return {
	 *  	Promise.<GlobalProperties>
	 *  }
	 */
	getGlobalProperties(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations(CACHE_MAPS.GLOBAL_PROPERTIES, 'getGlobalProperties', force);
	}

	/**
	 *  @method getConfig
	 *  @param {Boolean} force
	 *
	 *  @return {
	 *  	Promise.<Config>
	 *  }
	 */
	async getConfig(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getConfigurations(CACHE_MAPS.CONFIG, 'getConfig', force);
	}

	/**
	 *  @method getChainId
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<String>}
	 */
	async getChainId(force = false) {
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		if (!force) {
			const cacheValue = this.cache[CACHE_MAPS.CHAIN_ID];

			if (cacheValue) {
				return cacheValue;
			}
		}

		try {
			const requestedObject = await this.engine.database.getChainId();

			this.cache.set(CACHE_MAPS.CHAIN_ID, requestedObject);

			return requestedObject;
		} catch (error) {
			throw error;
		}
	}

	/**
	 *  @method getDynamicGlobalProperties
	 *
	 *  @return {
	 *  	Promise.<DynamicGlobalProperties>
	 *  }
	 */
	async getDynamicGlobalProperties(force = false) {
		if (!isBoolean(force)) throw new Error('Force should be a boolean');

		return this.getObject(DYNAMIC_GLOBAL_OBJECT_ID, force);
	}

	async getGitRevision() {
		return this.engine.database.getGitRevision();
	}

	/**
	 * @method getCurrentIncentivesInfo
	 * @returns {Promise<unknown>}
	 */
	async getCurrentIncentivesInfo() {
		return this.engine.database.getCurrentIncentivesInfo();
	}

	/**
	 * @method getIncentivesInfo
	 * @param {number} blockStart
	 * @param {number} blockEnd
	 * @returns {Promise<unknown>}
	 */
	async getIncentivesInfo(blockStart, blockEnd) {
		if (!isNumber(blockStart)) {
			throw new Error('Invalid start block number');
		}
		if (!isNumber(blockEnd)) {
			throw new Error('Invalid end block number');
		}
		if (blockEnd <= blockStart) {
			throw new Error('Block start should be less then block end');
		}

		return this.engine.database.getIncentivesInfo(blockStart, blockEnd);
	}

	/**
	 * @method getAccountAddressByLabel
	 * @param {string} accountNameOrId
	 * @param {string} label
	 * @returns {Promise<unknown>}
	 */
	async getAccountAddressByLabel(accountNameOrId, label) {
		if (!(isAccountId(accountNameOrId) || isAccountName(accountNameOrId))) {
			throw new Error('AccountNameOrId is invalid');
		}

		if (!isString(label)) {
			throw new Error('Label is invalid');
		}

		return this.engine.database.getAccountAddressByLabel(accountNameOrId, label);
	}

	/**
	 *  @method getKeyReferences
	 *  @param  {Array<String|PublicKey>} keys [public keys]
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<Array.<*>>}
	 */
	getKeyReferences(keys, force = false) {
		if (!isArray(keys)) return Promise.reject(new Error('Keys should be a array'));
		keys = keys.map((value) => ((value instanceof PublicKey) ? value.toString() : value));
		if (!keys.every((key) => isPublicKey(key))) {
			return Promise.reject(new Error('Keys should contain valid public keys'));
		}
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getArrayDataWithMultiSave(keys, CACHE_MAPS.ACCOUNTS_ID_BY_KEY, 'getKeyReferences', force);
	}

	/**
	 *  @method getAccounts
	 *  @param  {Array<String>} accountIds
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<Array.<Account>>}
	 */
	async getAccounts(accountIds, force = false) {
		if (!isArray(accountIds)) throw new Error('Account ids should be an array');
		if (!accountIds.every((id) => isAccountId(id))) throw new Error('Accounts should contain valid account ids');
		if (!isBoolean(force)) throw new Error('Force should be a boolean');

		const { length } = accountIds;

		const resultArray = new Array(length).fill(null);
		let requestedObjectsKeys = [];

		if (force) {
			requestedObjectsKeys = accountIds;
		} else {
			for (let i = 0; i < length; i += 1) {
				const key = accountIds[i];

				const cacheValue = this.cache.objectsById.get(key);

				if (cacheValue) {
					resultArray[i] = cacheValue.toJS();
					continue;
				}


				requestedObjectsKeys.push(key);
			}
		}

		if (requestedObjectsKeys.length === 0) {
			return resultArray;
		}

		let requestedObjects;

		try {
			requestedObjects = await this.engine.database.getAccounts(requestedObjectsKeys);

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

				this.cache.setInMap(CACHE_MAPS.ACCOUNTS_BY_ID, idKey, requestedObject)
					.setInMap(CACHE_MAPS.OBJECTS_BY_ID, idKey, requestedObject)
					.setInMap(CACHE_MAPS.ACCOUNTS_BY_NAME, nameKey, idKey);
			}

			return resultArray;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @method getAccountDeposits
	 * @param {string} account
	 * @param {SidechainType} type
	 * @returns {Promise<unknown>}
	 */
	async getAccountDeposits(account, type) {
		if (!isAccountId(account)) throw new Error('Invalid account id format');
		validateSidechainType(type);
		return this.engine.database.getAccountDeposits(account, type);
	}

	/**
	 * @method getAccountWithdrawals
	 * @param {string} account
	 * @param {SidechainType} type
	 * @returns {Promise<unknown>}
	 */
	async getAccountWithdrawals(account, type) {
		if (!isAccountId(account)) throw new Error('Invalid account id format');
		validateSidechainType(type);
		return this.engine.database.getAccountWithdrawals(account, type);
	}

	/**
	 *  @method getFullAccounts
	 *  @param  {Array<String>} accountNamesOrIds
	 *  @param  {Boolean} subscribe
	 *  @param 	{Boolean} force
	 *
	 *  @return {Promise.<Array.<FullAccount>>}
	 */
	async getFullAccounts(accountNamesOrIds, subscribe = true, force = false) {
		if (!isArray(accountNamesOrIds)) {
			throw new Error('Account names or ids should be an array');
		}
		if (!accountNamesOrIds.every((key) => isAccountId(key) || isAccountName(key))) {
			throw new Error('Accounts should contain valid account ids or names');
		}
		if (!isBoolean(subscribe)) throw new Error('Subscribe should be a boolean');
		if (!isBoolean(force)) throw new Error('Force should be a boolean');

		const { length } = accountNamesOrIds;

		const resultArray = new Array(length).fill(null);
		let requestedObjects = [];

		if (force) {
			requestedObjects = accountNamesOrIds;
		} else {
			for (let i = 0; i < length; i += 1) {

				const key = accountNamesOrIds[i];

				let id = key;

				if (!isAccountId(key)) {
					id = this.cache.accountsByName.get(key);
				}

				const cacheValue = this.cache.fullAccounts.get(id);

				if (cacheValue) {
					resultArray[i] = cacheValue.toJS();
					continue;
				}

				requestedObjects.push(key);
			}
		}

		if (requestedObjects.length === 0) {
			return resultArray;
		}

		try {
			requestedObjects = await this.engine.database.getFullAccounts(requestedObjects, true);


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

				const requestArray = requestedObject[1].balances.map(({ id }) => id);

				const balances = new Map().withMutations((map) => {
					requestedObject[1].balances.map(({ id, asset_type }) => map.set(asset_type, id));
				});

				const proposals = new Set(requestedObject[1].proposals.map(({ id }) => id));

				requestedObject = fromJS({ ...account, ...requestedObject[1] });
				requestedObject = await this._addHistory(requestedObject);

				requestedObject = requestedObject.withMutations((map) => {
					map.set('balances', balances).set('proposals', proposals);
				});

				resultArray[i] = requestedObject.toJS();

				await this.getObjects(requestArray);

				const nameKey = requestedObject.get('name');
				const idKey = requestedObject.get('id');

				this.cache.setInMap(CACHE_MAPS.ACCOUNTS_BY_ID, idKey, immutableAccount)
					.setInMap(CACHE_MAPS.OBJECTS_BY_ID, idKey, immutableAccount)
					.setInMap(CACHE_MAPS.FULL_ACCOUNTS, idKey, requestedObject)
					.setInMap(CACHE_MAPS.ACCOUNTS_BY_NAME, nameKey, idKey);
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
	 *  @return {Promise.<Account>}
	 */
	async getAccountByName(accountName, force = false) {
		if (!isAccountName(accountName)) throw new Error('Account name is invalid');
		if (!isBoolean(force)) throw new Error('Force should be a boolean');

		if (!force) {
			const id = this.cache.accountsByName.get(accountName);

			const cacheValue = this.cache.objectsById.get(id);

			if (cacheValue) {
				return cacheValue.toJS();
			}
		}

		try {
			const requestedObject = await this.engine.database.getAccountByName(accountName);

			if (!requestedObject) {
				return requestedObject;
			}

			const idKey = requestedObject.id;
			const nameKey = requestedObject.name;

			this.cache.setInMap(CACHE_MAPS.ACCOUNTS_BY_ID, idKey, fromJS(requestedObject))
				.setInMap(CACHE_MAPS.OBJECTS_BY_ID, idKey, fromJS(requestedObject))
				.setInMap(CACHE_MAPS.ACCOUNTS_BY_NAME, nameKey, idKey);

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
	 *  @return {Promise.<Object>}
	 */
	getAccountReferences(accountId, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataWithMultiSave(
			accountId,
			CACHE_MAPS.ACCOUNT_REFERENCES_BY_ACCOUNT_ID,
			'getAccountReferences',
			force,
		);
	}

	/**
	 *  @method lookupAccountNames
	 *  @param  {Array<String>} accountNames
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<Array.<Account>>}
	 */
	async lookupAccountNames(accountNames, force = false) {
		if (!isArray(accountNames)) throw new Error('Account names should be an array');
		if (!accountNames.every((id) => isAccountName(id))) {
			throw new Error('Accounts should contain valid account names');
		}
		if (!isBoolean(force)) throw new Error('Force should be a boolean');

		const { length } = accountNames;

		const resultArray = new Array(length).fill(null);
		let requestedObjectsKeys = [];

		if (force) {
			requestedObjectsKeys = accountNames;
		} else {
			for (let i = 0; i < length; i += 1) {
				const key = accountNames[i];

				const id = this.cache.accountsByName.get(key);

				const cacheValue = this.cache.objectsById.get(id);

				if (cacheValue) {
					resultArray[i] = cacheValue.toJS();
					continue;
				}

				requestedObjectsKeys.push(key);
			}
		}

		let requestedObjects;

		try {
			requestedObjects = await this.engine.database.lookupAccountNames(requestedObjectsKeys);

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

				this.cache.setInMap(CACHE_MAPS.ACCOUNTS_BY_ID, idKey, requestedObject)
					.setInMap(CACHE_MAPS.OBJECTS_BY_ID, idKey, requestedObject)
					.setInMap(CACHE_MAPS.ACCOUNTS_BY_NAME, nameKey, idKey);
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
	 *  @return {Promise.<Array<AccountName, AccountId>>}
	 */
	async lookupAccounts(lowerBoundName, limit = API_CONFIG.LOOKUP_ACCOUNTS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundName)) throw new Error('Lower bound name should be a string');
		if (!isUInt64(limit) || limit > API_CONFIG.LOOKUP_ACCOUNTS_MAX_LIMIT) {
			throw new Error(`Limit should be a integer and must not exceed ${API_CONFIG.LOOKUP_ACCOUNTS_MAX_LIMIT}`);
		}

		return this.engine.database.lookupAccounts(lowerBoundName, limit);
	}

	/**
	 *  @method getAccountCount
	 *
	 *  @return {Promise<Number>}
	 */
	getAccountCount() {
		return this.engine.database.getAccountCount();
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
		if (!assetIds.every((id) => isAssetId(id))) {
			return Promise.reject(new Error('Asset ids contain valid asset ids'));
		}
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataByCompositeParams(
			accountId,
			CACHE_MAPS.ACCOUNTS_BALANCE_BY_ACCOUNT_ID,
			'getAccountBalances',
			force,
			accountId,
			assetIds,
		);
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
		if (!assetIds.every((id) => isAssetId(id))) {
			return Promise.reject(new Error('Asset ids should contain valid asset ids'));
		}
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataByCompositeParams(
			accountName,
			CACHE_MAPS.ACCOUNTS_BALANCE_BY_ACCOUNT_NAME,
			'getNamedAccountBalances',
			force,
			accountName,
			assetIds,
		);
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

		return this.engine.database.getVestedBalances(balanceIds);
	}

	/**
	 *  @method getVestingBalances
	 *  @param  {String} accountId
	 *
	 *  @return {Promise.<*>}
	 */
	async getVestingBalances(accountId) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		return this.engine.database.getVestingBalances(accountId);
	}

	/**
	 *  @method getAssets
	 *  @param  {Array<String>} assetIds
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<Array.<Asset>>}
	 */
	async getAssets(assetIds, force = false) {
		if (!isArray(assetIds)) throw new Error('Asset ids should be an array');
		if (!assetIds.every((id) => isAssetId(id))) throw new Error('Assets ids should contain valid asset ids');
		if (!isBoolean(force)) throw new Error('Force should be a boolean');

		const { length } = assetIds;

		const resultArray = new Array(length).fill(null);
		let requestedObjects = [];

		if (force) {
			requestedObjects = assetIds;
		} else {
			for (let i = 0; i < length; i += 1) {

				const key = assetIds[i];

				const cacheValue = this.cache.assetByAssetId.get(key);

				if (cacheValue) {
					resultArray[i] = cacheValue.toJS();
					continue;
				}

				requestedObjects.push(key);
			}
		}

		if (requestedObjects.length === 0) {
			return resultArray;
		}


		try {
			requestedObjects = await this.engine.database.getAssets(requestedObjects);


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

				this.cache.setInMap(CACHE_MAPS.ASSET_BY_ASSET_ID, idKey, requestedObject)
					.setInMap(CACHE_MAPS.OBJECTS_BY_ID, idKey, requestedObject)
					.setInMap(CACHE_MAPS.ASSET_BY_SYMBOL, nameKey, requestedObject);
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
	 *  @return {Promise.<Array.<Asset>>}
	 */
	async listAssets(lowerBoundSymbol, limit = API_CONFIG.LIST_ASSETS_DEFAULT_LIMIT) {
		if (!isString(lowerBoundSymbol)) throw new Error('Lower bound symbol is invalid');
		if (!isUInt64(limit) || limit > API_CONFIG.LIST_ASSETS_MAX_LIMIT) {
			throw new Error(`Limit should be a integer and must not exceed ${API_CONFIG.LIST_ASSETS_MAX_LIMIT}`);
		}

		return this.engine.database.listAssets(lowerBoundSymbol, limit);
	}

	/**
	 *  @method lookupAssetSymbols
	 *  @param  {Array<String>} symbolsOrIds
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<Array.<Asset>>}
	 */
	async lookupAssetSymbols(symbolsOrIds, force = false) {
		if (!isArray(symbolsOrIds)) return Promise.reject(new Error('Symbols or ids should be an array'));
		if (!symbolsOrIds.every((key) => isAssetId(key) || isAssetName(key))) {
			throw new Error('Symbols or ids should contain valid asset ids or symbol');
		}
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const { length } = symbolsOrIds;

		const resultArray = new Array(length).fill(null);
		let requestedObjects = [];

		if (force) {
			requestedObjects = symbolsOrIds;
		} else {
			for (let i = 0; i < length; i += 1) {

				const key = symbolsOrIds[i];

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

				requestedObjects.push(key);
			}
		}


		try {
			requestedObjects = await this.engine.database.lookupAssetSymbols(requestedObjects);
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

			this.cache.setInMap(CACHE_MAPS.ASSET_BY_ASSET_ID, idKey, requestedObject)
				.setInMap(CACHE_MAPS.OBJECTS_BY_ID, idKey, requestedObject)
				.setInMap(CACHE_MAPS.ASSET_BY_SYMBOL, nameKey, requestedObject);
		}

		return resultArray;
	}

	/**
	 *  @method getMarginPositions
	 *  @param  {String} accountId
	 *
	 *  @return {Promise.<*>}
	 */
	async getMarginPositions(accountId) {
		if (!isAccountId(accountId)) throw new Error('Account id is invalid');

		return this.engine.database.getMarginPositions(accountId);
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

		return this.engine.database.getTicker(baseAssetName, quoteAssetName);
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

		return this.engine.database.get24Volume(baseAssetName, quoteAssetName);
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
	async getTradeHistory(
		baseAssetName,
		quoteAssetName,
		start,
		stop,
		limit = API_CONFIG.GET_TRADE_HISTORY_DEFAULT_LIMIT,
	) {
		if (!isAssetName(baseAssetName)) throw new Error('Base asset name is invalid');
		if (!isAssetName(quoteAssetName)) throw new Error('Quote asset name is invalid');
		if (!isUInt64(start)) throw new Error('Start should be UNIX timestamp');
		if (!isUInt64(stop)) throw new Error('Stop should be UNIX timestamp');
		if (!isUInt64(limit) || limit > API_CONFIG.GET_TRADE_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.GET_TRADE_HISTORY_MAX_LIMIT}`);
		}

		return this.engine.database.getTradeHistory(baseAssetName, quoteAssetName, start, stop, limit);
	}

	/**
	 *  @method getCommitteeMembers
	 *
	 *  @param  {Array<String>} committeeMemberIds
	 *  @param {Boolean} force
	 *
	 *  @return {
	 *  	Promise.<Array.<Committee>>
	 *  }
	 */
	getCommitteeMembers(committeeMemberIds, force = false) {
		if (!isArray(committeeMemberIds)) return Promise.reject(new Error('CommitteeMemberIds ids should be an array'));
		if (!committeeMemberIds.every((id) => isCommitteeMemberId(id))) {
			return Promise.reject(new Error('CommitteeMemberIds should contain valid committee ids'));
		}
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const cacheParams = [
			{ param: 'id', cache: CACHE_MAPS.OBJECTS_BY_ID },
			{ param: 'vote_id', cache: CACHE_MAPS.OBJECTS_BY_VOTE_ID },
			{ param: 'committee_member_account', cache: CACHE_MAPS.COMMITTEE_MEMBERS_BY_ACCOUNT_ID },
		];

		return this._getArrayDataWithMultiSave(
			committeeMemberIds,
			CACHE_MAPS.COMMITTEE_MEMBERS_BY_COMMITTEE_MEMBER_ID,
			'getCommitteeMembers',
			force,
			cacheParams,
		);
	}

	/**
	 *  @method getCommitteeMemberByAccount
	 *
	 *  @param  {String} accountId
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<Committee>}
	 */
	getCommitteeMemberByAccount(accountId, force = false) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		const cacheParams = [
			{ param: 'id', cache: CACHE_MAPS.OBJECTS_BY_ID },
			{ param: 'vote_id', cache: CACHE_MAPS.OBJECTS_BY_VOTE_ID },
			{ param: 'id', cache: CACHE_MAPS.COMMITTEE_MEMBERS_BY_COMMITTEE_MEMBER_ID },
		];

		return this._getSingleDataWithMultiSave(
			accountId,
			CACHE_MAPS.COMMITTEE_MEMBERS_BY_ACCOUNT_ID,
			'getCommitteeMemberByAccount',
			force,
			cacheParams,
		);
	}

	/**
	 *  @method lookupCommitteeMemberAccounts
	 *
	 *  @param  {String} lowerBoundName
	 *  @param  {Number} limit
	 *
	 *  @return {Promise.<*>}
	 */
	async lookupCommitteeMemberAccounts(
		lowerBoundName,
		limit = API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT,
	) {
		if (!isString(lowerBoundName)) throw new Error('LowerBoundName should be string');
		if (!isUInt64(limit) || limit > API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT}`);
		}

		return this.engine.database.lookupCommitteeMemberAccounts(lowerBoundName, limit);
	}

	/**
	 *  @method getTransactionHex
	 *
	 *  @param  {Object} tr
	 *
	 *  @return {Promise.<*>}
	 */
	async getTransactionHex(tr) {
		const raw = transaction.toRaw(tr);
		// transaction is signed
		return this.engine.database.getTransactionHex(raw);
	}

	/**
	 *  @method getRequiredSignatures
	 *
	 *  @param  {Object} tr
	 *  @param  {Array<String>} availableKeys [public keys]
	 *
	 *  @return {Promise.<*>}
	 */
	async getRequiredSignatures(tr, availableKeys) {
		const raw = transaction.toRaw(tr);
		if (!isArray(availableKeys)) throw new Error('Available keys ids should be an array');
		if (!availableKeys.every((key) => isPublicKey(key))) {
			throw new Error('Available keys should contain valid public keys');
		}

		return this.engine.database.getRequiredSignatures(raw, availableKeys);
	}

	/**
	 *  @method getPotentialSignatures
	 *
	 *  @param  {Object} transaction
	 *
	 *  @return {Promise.<*>}
	 */
	async getPotentialSignatures(tr) {
		const raw = transaction.toRaw(tr);
		return this.engine.database.getPotentialSignatures(raw);
	}

	/**
	 *  @method verifyAuthority
	 *
	 *  @param  {Object} tr
	 *
	 *  @return {Promise.<*>}
	 */
	async verifyAuthority(tr) {
		const raw = transaction.toRaw(tr);
		return this.engine.database.verifyAuthority(raw);
	}

	/**
	 *  @method verifyAccountAuthority
	 *
	 *  @param  {String} accountNameOrId
	 *  @param  {Array<String>} signers [public keys]
	 *
	 *  @return {Promise.<*>}
	 */
	async verifyAccountAuthority(accountNameOrId, signers) {
		if (!(isAccountName(accountNameOrId) || isAccountId(accountNameOrId))) {
			throw new Error('Account name or id is invalid');
		}
		if (!isArray(signers)) throw new Error('Signers ids should be an array');
		if (!signers.every((key) => isPublicKey(key))) throw new Error('Signers should contain valid public keys');

		return this.engine.database.verifyAccountAuthority(accountNameOrId, signers);
	}

	/**
	 *  @method validateTransaction
	 *
	 *  @param  {Object} tr
	 *
	 *  @return {Promise.<*>}
	 */
	async validateTransaction(tr) {
		const raw = signedTransaction.toRaw(tr);
		// signed transaction
		return this.engine.database.validateTransaction(raw);
	}

	/**
	 *  @method getRequiredFees
	 *
	 *  @param  {Array<Object>} operations
	 *  @param  {String} assetId
	 *
	 *  @return {
	 *  	Promise.<Array<{
	 *  		asset_id:String,
	 *  		amount:Number
	 *  	}>>
	 *  }
	 */
	async getRequiredFees(operations, assetId = ECHO_ASSET_ID) {
		if (!isArray(operations)) return Promise.reject(new Error('Operations should be an array'));
		return this.engine.database.getRequiredFees(operations.map((op) => operation.toRaw(op, true)), assetId);
	}

	/**
	 *  @method getProposedTransactions
	 *
	 *  @param  {String} accountNameOrId
	 *
	 *  @return {Promise.<*>}
	 */
	async getProposedTransactions(accountNameOrId) {
		if (!(isAccountId(accountNameOrId) || isAccountName(accountNameOrId))) {
			throw new Error('AccountNameOrId is invalid');
		}

		return this.engine.database.getProposedTransactions(accountNameOrId);
	}

	/**
	 * @param {ContractLogsFilterOptions_t} [opts]
	 * @returns {Promise<Log[]>}
	 */
	async getContractLogs(opts = {}) {
		return new Promise((resolve, reject) => {
			this.engine.database.getContractLogs((res) => resolve(res), toRawContractLogsFilterOptions(opts))
				.catch((err) => reject(err));
		}).then((res) => {
			assert.ok(Array.isArray(res));
			assert.strictEqual(res.length, 1);
			return res[0];
		});
	}

	/**
	 * @param {(result: Log[]) => any} callback
	 * @param {ContractLogsFilterOptions_t} [opts]
	 * @returns {Promise<Log[]>}
	 */
	async subscribeContractLogs(callback, opts = {}) {
		return this.engine.database.subscribeContractLogs((result) => {
			assert.ok(Array.isArray(result));
			assert.strictEqual(result.length, 1);
			callback(result[0]);
		}, toRawContractLogsFilterOptions(opts));
	}

	/** @param {UInt64} subscribeId */
	async unsubscribeContractLogs(subscribeId) {
		return this.engine.database.unsubscribeContractLogs(basic.integers.uint64.toRaw(subscribeId));
	}

	/**
	 *  @method getContractResult
	 *
	 *  @param  {String} resultContractId
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<ContractResult>}
	 */
	getContractResult(resultContractId, force = false) {
		if (!isContractResultId(resultContractId)) return Promise.reject(new Error('Result contract id is invalid'));
		if (!isBoolean(force)) return Promise.reject(new Error('Force should be a boolean'));

		return this._getSingleDataWithMultiSave(
			resultContractId,
			CACHE_MAPS.CONTRACT_RESULTS_BY_CONTRACT_RESULT_ID,
			'getContractResult',
			force,
		);
	}

	/**
	 *  @method getContract
	 *
	 *  @param  {String} contractId
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<[0, { code:String, storage:Array.<Array>}] | [1, { code:String }]>}
	 */
	getContract(contractId, force = false) {
		if (!isContractId(contractId)) return Promise.reject(new Error('Contract id is invalid'));

		return this._getSingleDataWithMultiSave(
			contractId,
			CACHE_MAPS.CONTRACT_OBJECT_BY_CONTRACT_ID,
			'getContract',
			force,
		);
	}

	/**
	 * @method callContractNoChangingState
	 * @param {string} contractId
	 * @param {string} caller
	 * @param {{ amount: number | string, asset_id: string }} asset
	 * @param {string} code
	 * @return {Promise<string>}
	 */
	async callContractNoChangingState(contractId, caller, asset, code) {
		if (!isContractId(contractId)) throw new Error('ContractId is invalid');
		if (!isAccountId(caller) && !isContractId(caller)) throw new Error('Caller is invalid');
		if (!isObject(asset)) throw new Error('Asset is not an object');
		if (!isInt64(asset.amount)) throw new Error('Asset amount is not int64');
		if (!isAssetId(asset.asset_id)) throw new Error('Invalid asset id');
		if (!/^([\da-fA-F]{2})*$/.test(code)) throw new Error('Bytecode is invalid');
		return this.engine.database.callContractNoChangingState(contractId, caller, asset, code);
	}

	/**
	 *  @method getContracts
	 *
	 *  @param  {Array<String>} contractIds
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<Array<{id:String,statistics:String,suicided:Boolean}>>}
	 */
	getContracts(contractIds, force = false) {
		if (!isArray(contractIds)) return Promise.reject(new Error('ContractIds ids should be an array'));
		if (!contractIds.every((id) => isContractId(id))) {
			return Promise.reject(new Error('ContractIds should contain valid contract ids'));
		}

		return this._getArrayDataWithMultiSave(contractIds, CACHE_MAPS.CONTRACTS_BY_CONTRACT_ID, 'getContracts', force);
	}

	/**
	 *  @method getContractBalances
	 *
	 *  @param  {String} contractId
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<Object>}
	 */
	async getContractBalances(contractId, force = false) {
		if (!isContractId(contractId)) throw new Error('ContractId is invalid');
		if (!isBoolean(force)) throw new Error('Force should be a boolean');

		return this.engine.database.getContractBalances(contractId);
	}

	/**
	 *  @method getContractPoolWhitelist
	 *
	 *  @param  {String} contractId
	 *
	 *  @return {Promise.<Object>}
	 */
	async getContractPoolWhitelist(contractId) {
		if (!isContractId(contractId)) throw new Error('ContractId is invalid');

		return this.engine.database.getContractPoolWhitelist(contractId);
	}

	/**
	 *  @method getContractPoolBalance
	 *
	 *  @param  {String} contractId
	 *
	 *  @return {Promise.<Object>}
	 */
	async getContractPoolBalance(contractId) {
		if (!isContractId(contractId)) throw new Error('ContractId is invalid');

		return this.engine.database.getContractPoolBalance(contractId);
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

		return this.engine.database.getRecentTransactionById(transactionId);
	}

	/**
	 * @param {string} assetId
	 * @returns {Promise<BigNumber>}
	 */
	async getFeePool(assetId) {
		if (!isAssetId(assetId)) throw new Error('invalid assetId format');
		const [asset] = await this.getObjects([assetId], true);
		if (!asset) throw new Error(`asset ${assetId} not found`);
		const [assetDynamicData] = await this.getObjects([asset.dynamic_asset_data_id]);
		return assetDynamicData.fee_pool;
	}

	// TODO: fix @returns in JSDoc
	/**
	 * @param {import('../serializer/transaction-type').SignedTransactionObject} signedTransactionObject
	 * @param {()=>* =} wasBroadcastedCallback
	 * @returns {Promise<*>}
	 */
	broadcastTransactionWithCallback(signedTransactionObject, wasBroadcastedCallback) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.engine[CHAIN_API.NETWORK_BROADCAST_API].broadcastTransactionWithCallback(
					(res) => resolve(res),
					signedTransactionObject,
				);
			} catch (error) {
				reject(error);
				return;
			}
			if (typeof wasBroadcastedCallback !== 'undefined') wasBroadcastedCallback();
		});
	}

	/**
	 * @method registerAccount
	 * @param {string} name
	 * @param {string} activeKey
	 * @param {string} echoRandKey
	 * @param {string} evmAddress
	 * @param {() => any} [wasBroadcastedCallback]
	 * @return {Promise<[{ block_num: number, tx_id: string }]>}
	 */
	async registerAccount(name, activeKey, echoRandKey, evmAddress, wasBroadcastedCallback) {
		if (!isAccountName(name)) throw new Error('Name is invalid');
		if (!isPublicKey(activeKey)) throw new Error('Active public key is invalid');
		if (!isEchoRandKey(echoRandKey)) throw new Error('Echo rand key is invalid');
		const registrationTask = await this.engine.registration.requestRegistrationTask();
		const { block_id: blockId, rand_num: randNum, difficulty } = registrationTask;
		const nonce = await solveRegistrationTask(blockId, randNum, difficulty, this.registrationOptions);
		return new Promise(async (resolve, reject) => {
			try {
				await this.engine.registration.submitRegistrationSolution(
					(res) => resolve(res),
					name,
					activeKey,
					echoRandKey,
					evmAddress,
					nonce,
					randNum,
				);
			} catch (error) {
				reject(error);
			}
			if (typeof wasBroadcastedCallback !== 'undefined') wasBroadcastedCallback();
		});
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
	 *  @return {
	 *  	Promise.<Array.<AccountHistory>>
	 *  }
	 */
	async getAccountHistory(
		accountId,
		stop = API_CONFIG.START_OPERATION_HISTORY_ID,
		limit = API_CONFIG.ACCOUNT_HISTORY_DEFAULT_LIMIT,
		start = API_CONFIG.STOP_OPERATION_HISTORY_ID,
	) {
		if (!isAccountId(accountId)) throw new Error('Account is invalid');
		if (!isOperationHistoryId(stop)) throw new Error('Stop parameter is invalid');
		if (!isUInt64(limit) || limit > API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT}`);
		}
		if (!isOperationHistoryId(start)) throw new Error('Start parameter is invalid');

		return this.engine.history.getAccountHistory(accountId, stop, limit, start);
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
	 *  @return {
	 *  	Promise.<Array.<AccountHistory>>
	 *  }
	 */
	async getRelativeAccountHistory(
		accountId,
		stop = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_STOP,
		limit = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_DEFAULT_LIMIT,
		start = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_START,
	) {
		if (!isAccountId(accountId)) throw new Error('Account is invalid');
		if (!isUInt64(stop)) throw new Error('Stop parameter should be non negative number');
		if (!isUInt64(limit) || limit > API_CONFIG.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT}`);
		}
		if (!isUInt64(start)) throw new Error('Start parameter should be non negative number');

		return this.engine.history.getRelativeAccountHistory(accountId, stop, limit, start);
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
	 *  @return {
	 *  	Promise<Array.<AccountHistory>>
	 *  }
	 */
	async getAccountHistoryOperations(
		accountId,
		operationId,
		start = API_CONFIG.START_OPERATION_HISTORY_ID,
		stop = API_CONFIG.STOP_OPERATION_HISTORY_ID,
		limit = API_CONFIG.ACCOUNT_HISTORY_OPERATIONS_DEFAULT_LIMIT,
	) {
		if (!isAccountId(accountId)) throw new Error('Account is invalid');
		if (!isOperationId(operationId)) throw new Error('Operation id invalid');
		if (!isOperationHistoryId(start)) throw new Error('Start parameter is invalid');
		if (!isOperationHistoryId(stop)) throw new Error('Stop parameter is invalid');
		if (!isUInt64(limit) || limit > API_CONFIG.ACCOUNT_HISTORY_OPERATIONS_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.ACCOUNT_HISTORY_OPERATIONS_MAX_LIMIT}`);
		}
		return this.engine.history
			.getAccountHistoryOperations(accountId, operationId, start, stop, limit);
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
	 *  @return {Promise.<Array.<ContractHistory>>}
	 */
	async getContractHistory(
		contractId,
		stop = API_CONFIG.STOP_OPERATION_HISTORY_ID,
		limit = API_CONFIG.CONTRACT_HISTORY_DEFAULT_LIMIT,
		start = API_CONFIG.START_OPERATION_HISTORY_ID,
	) {
		if (!isContractId(contractId)) throw new Error('Contract is invalid');
		if (!isOperationHistoryId(stop)) throw new Error('Stop parameter is invalid');
		if (!isUInt64(limit) || limit > API_CONFIG.CONTRACT_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.CONTRACT_HISTORY_MAX_LIMIT}`);
		}
		if (!isOperationHistoryId(start)) throw new Error('Start parameter is invalid');

		return this.engine.history.getContractHistory(
			contractId,
			stop,
			limit,
			start,
		);
	}

	/**
	 * @param {typeof chain.ids["protocol"]["contractId"]["__TInput__"]} contract
	 * @param {Object} [options]
	 * @param {typeof basic.integers["uint64"]["__TInput__"]} [options.stop]
	 * @param {typeof basic.integers["uint32"]["__TInput__"]} [options.limit]
	 * @param {typeof basic.integers["uint64"]["__TInput__"]} [options.start]
	 */
	async getRelativeContractHistory(contract, options = {}) {
		contract = chain.ids.protocol.contractId.toRaw(contract);
		const stop = options.stop === undefined ? 0 : basic.integers.uint64.toRaw(options.stop);
		const limit = options.limit === undefined ? 100 : basic.integers.uint32.toRaw(options.limit);
		const start = options.stop === undefined ? 0 : basic.integers.uint64.toRaw(options.start);
		if (limit > 100) throw new Error('Limit is greater than 100');
		return this.engine.history.getRelativeContractHistory(contract, stop, limit, start);
	}

	/**
	 * @param {String} address
	 * @param {Integer_t["uint64"]["__TOutput__"]} stop
	 * @param {Integer_t["uint32"]["__TOutput__"]} limit
	 * @param {Integer_t["uint64"]["__TOutput__"]} start
	 * @returns {Promise}
	 */
	async getAccountAddressHistory(_address, options = {}) {
		const address = chain.ripemd160.toRaw(_address);
		const stop = options.stop === undefined ?
			API_CONFIG.STOP_OPERATION_HISTORY_ID : operationHistoryId.toRaw(options.stop);
		const limit = options.limit === undefined ? 100 : basic.integers.uint32.toRaw(options.limit);
		const start = options.start === undefined ?
			API_CONFIG.START_OPERATION_HISTORY_ID : operationHistoryId.toRaw(options.start);
		if (limit > 100) throw new Error('Limit is greater than 100');
		return this.engine.history.getAccountAddressHistory(address, start, stop, limit);
	}

	/**
	 *  @method getFullContract
	 *  Get contract info.
	 *
	 *  @param {String} contractId
	 *  @param {Boolean} force
	 *
	 *  @return {Promise.<Object>}
	 */
	async getFullContract(contractId, force = false) {

		if (!force) {
			const cacheValue = this.cache[CACHE_MAPS.FULL_CONTRACTS_BY_CONTRACT_ID].get(contractId);

			if (cacheValue) {
				return cacheValue.toJS();
			}
		}

		const [contract, balances, history, poolBalance, lists] = await Promise.all([
			this.getContract(contractId, force),
			this.getContractBalances(contractId),
			this.getContractHistory(contractId),
			this.getContractPoolBalance(contractId),
			this.getContractPoolWhitelist(contractId)
				.catch((err) => {
					if (err.message === 'Assert Exception: itr != index.end(): Contract pool object not found') {
						return [];
					}
					throw err;
				}),
		]);

		this.cache.setInMap(
			CACHE_MAPS.FULL_CONTRACTS_BY_CONTRACT_ID,
			contractId,
			fromJS({
				contract, history, balances, poolBalance, whitelist: lists.whitelist, blacklist: lists.blacklist,
			}),
		);

		return {
			contract, history, balances, poolBalance, whitelist: lists.whitelist, blacklist: lists.blacklist,
		};
	}

	/**
	 *  @method broadcastTransaction
	 * 	Broadcast a transaction to the network.
	 *
	 * 	@param  {Object} tr
	 *  @param  {Number} tr.ref_block_num
	 *  @param  {Number} tr.ref_block_prefix
	 *  @param  {Array} tr.operations
	 *  @param  {Array} tr.signatures
	 *
	 *  @return {Promise.<*>}
	 */
	broadcastTransaction(tr) {
		if (!tr) {
			return Promise.reject(new Error('Transaction is required'));
		}

		if (!tr.ref_block_num || !tr.ref_block_prefix || !tr.operations || !tr.signatures) {
			return Promise.reject(new Error('Invalid transaction'));
		}

		return this.engine[CHAIN_API.NETWORK_BROADCAST_API].broadcastTransaction(tr);
	}

	/**
	 *  @method broadcastBlock
	 * 	Broadcast a block to the network.
	 *
	 *  @param  {Object} block
	 *  @param  {Number} block.previous  [previous block id]
	 *  @param  {Number} block.timestamp  [block timestamp]
	 *  @param  {String} block.transaction_merkle_root  [merkle root]
	 *  @param  {String} block.state_root_hash  [hash]
	 *  @param  {String} block.result_root_hash  [result hash]
	 *  @param  {String} block.ed_signature  [eddsa signature]
	 *  @param  {Number} block.round  [round id]
	 *  @param  {Number} block.rand  [rand]
	 *  @param  {String} block.cert  [certificate]
	 *  @param  {Array} block.transactions
	 *
	 *  @return {Promise.<*>}
	 */
	broadcastBlock(block) {
		if (!block) {
			return Promise.reject(new Error('Block is required'));
		}

		if (!block.previous || !block.timestamp) {
			return Promise.reject(new Error('Invalid block'));
		}

		return this.engine[CHAIN_API.NETWORK_BROADCAST_API].broadcastBlock(block);
	}

	/**
	*  @method getAssetHolders
	*  Retrieve the information about the holders of the specified asset.
	*
	*  @param {String} assetId   [asset id to retrieve]
	*  @param {Number} start [account id to start retrieving from]
	*  @param {Number} limit     [count accounts (max 100)]
	*
	*  @return {Promise.<Array.<{name: String, account_id:String, amount: String}>>}
	*  [ { name: 'init0', account_id: '1.2.6', amount: '100000039900000' } ]
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

		return this.engine.asset.getAssetHolders(assetId, start, limit);
	}

	/**
	*  @method getAssetHoldersCount
	*  Retrieve the number of holders of the provided asset.
	*
	*  @param {String} assetId   [asset id to retrieve]
	*
	*  @return {Promise.<Number>} result - 8
	*/
	getAssetHoldersCount(assetId) {
		if (!isAssetId(assetId)) {
			return Promise.reject(new Error('Invalid Asset ID'));
		}

		return this.engine.asset.getAssetHoldersCount(assetId);
	}

	/**
	*  @method getAllAssetHolders
	*  Array of all asset IDs with the number of holders.
	*
	* 	@return {Promise.<Array.<{asset_id: String, count: Number}>>}
	* 	[ { asset_id: '1.3.0', count: 8 } ]
	*/
	getAllAssetHolders() {
		return this.engine.asset.getAllAssetHolders();
	}

	/**
	 *
	 * @param {Array<String>} keys
	 * @return {*}
	 */
	getBalanceObjects(keys) {
		if (!isArray(keys)) return Promise.reject(new Error('Invalid keys'));

		return this.engine.database.getBalanceObjects(keys);
	}

	/**
	 *
	 * @param {Number} blockNum
	 * @return {*}
	 */
	getBlockVirtualOperations(blockNum) {
		if (!isUInt64(blockNum)) return Promise.reject(new Error('BlockNumber should be a non negative integer'));

		return this.engine.database.getBlockVirtualOperations(blockNum);
	}

	/**
	 *
	 * @param {String} accountId
	 * @return {*}
	 */
	getFrozenBalances(accountId) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));

		return this.engine.database.getFrozenBalances(accountId);
	}

	/** @param {string} account */
	async getERC20AccountDeposits(account) {
		if (!isAccountId(account)) throw new Error('Invalid account id');
		return this.engine.database.getERC20AccountDeposits(account);
	}

	/** @param {string} account */
	async getERC20AccountWithdrawals(account) {
		if (!isAccountId(account)) throw new Error('Invalid account id');
		return this.engine.database.getERC20AccountWithdrawals(account);
	}

	/**
	 *
	 * @param {String} accountId
	 * @return {*}
	 */
	getBtcAddress(accountId) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));

		return this._getSingleDataByCompositeParams(
			accountId,
			CACHE_MAPS.ACCOUNT_BTC_ADDRESS_BY_ACCOUNT_ID,
			'getBtcAddress',
			false,
			accountId,
		);

	}

	/**
	 *
	 * @param {String} address
	 * @return {*}
	 */
	getAccountByAddress(address) {
		return this.engine.database.getAccountByAddress(address);
	}

	/**
	 *
	 * @param {String} accountId
	 * @param {Number} from
	 * @param {Number} limit
	 * @return {*}
	 */
	async getAccountAddresses(accountId, from, limit) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));

		if (!isNumber(from)) {
			return Promise.reject(new Error('Invalid from block number'));
		}

		if (!isNumber(limit)) {
			return Promise.reject(new Error('Invalid limit accounts number'));
		}

		return this._getSingleDataByCompositeParams(
			accountId,
			CACHE_MAPS.ACCOUNT_ADDRESSES_BY_ACCOUNT_ID,
			'getAccountAddresses',
			false,
			accountId,
			from,
			limit,
		);
	}

	/**
	 *
	 * @param {String} accountId
	 * @return {*}
	 */
	getEthAddress(accountId) {
		if (!isAccountId(accountId)) return Promise.reject(new Error('Account id is invalid'));

		return this._getSingleDataByCompositeParams(
			accountId,
			CACHE_MAPS.ACCOUNT_ETH_ADDRESS_BY_ACCOUNT_ID,
			'getEthAddress',
			false,
			accountId,
		);
	}

	/**
	 *
	 * @param {String} btcAddressId
	 * @return {*}
	 */
	getBtcDepositScript(btcAddressId) {
		if (!isBtcAddressId(btcAddressId)) return Promise.reject(new Error('Btc address id is invalid'));

		return this.engine.database.getBtcDepositScript(btcAddressId);
	}

	/*
	 *  @method requestRegistrationTask
	 *
	 *  @return {Promise<Object>}
	 */
	requestRegistrationTask() {
		return this.engine.registration.requestRegistrationTask();
	}

	/**
	 *  @method submitRegistrationSolution
	 *
	 * 	@param {String} name
	 * 	@param {String} activeKey
	 * 	@param {String} echorandKey
	 * 	@param {String} evmAddress
	 * 	@param {Number} nounce
	 * 	@param {Number} randNum
	 * 	@param {Function} wasBroadcastedCallback
	 *
 	 *  @return {Promise<Boolean>}
	 */
	submitRegistrationSolution(name, activeKey, echorandKey, evmAddress, nounce, randNum, wasBroadcastedCallback) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.engine.registration.submitRegistrationSolution((res) =>
					resolve(res), name, activeKey, echorandKey, evmAddress, nounce, randNum);
			} catch (error) {
				reject(error);
			}
			if (typeof wasBroadcastedCallback !== 'undefined') wasBroadcastedCallback();
		});

	}

	/**
	 *  @method getCommitteeFrozenBalance
	 *
	 * 	@param {String} committeeMemberIds
	 *
 	 *  @return {*}
	 */
	getCommitteeFrozenBalance(committeeMemberId) {
		if (!isCommitteeMemberId(committeeMemberId)) {
			return Promise.reject(new Error('CommitteeMemberId should be valid committee id'));
		}

		return this.engine.database.getCommitteeFrozenBalance(committeeMemberId);
	}

	/**
	 *  @method getRegistrar
	 *
 	 *  @return {*}
	 */
	getRegistrar() {
		return this.engine.registration.getRegistrar();
	}

	getConnectedPeers() { return this.engine[CHAIN_API.NETWORK_NODE_API].getConnectedPeers(); }
	getPotentialPeers() { return this.engine[CHAIN_API.NETWORK_NODE_API].getPotentialPeers(); }
	setOptions() { }

	/**
     *  @method getDidObject
     *
     *  @param  {string} id
     *
     *  @return {*}
     */
	getDidObject(id) {
		if (!isString(id)) {
			return Promise.reject(new Error('Id should be valid string'));
		}
		return this.engine[CHAIN_API.DID_API].getDidObject(id);
	}

	/**
     *  @method getKey
     *
     *  @param  {string} idString
     *
     *  @return {*}
     */
	getKey(idString) {
		if (!isString(idString)) {
			return Promise.reject(new Error('Id string should be valid string'));
		}
		return this.engine[CHAIN_API.DID_API].getKey(idString);
	}

	/**
     *  @method getKeys
     *
     *  @param  {string} idString
     *
     *  @return {*}
     */
	getKeys(idString) {
		if (!isString(idString)) {
			return Promise.reject(new Error('Id string should be valid string'));
		}
		return this.engine[CHAIN_API.DID_API].getKeys(idString);
	}

}

export default API;
