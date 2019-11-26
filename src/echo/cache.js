/* eslint-disable max-len,no-continue,no-restricted-syntax */
import { Map } from 'immutable';

import { isFunction, isObject, isVoid } from '../utils/validators';
import { USE_CACHE_BY_DEFAULT, DEFAULT_BLOCKS_EXPIRATION_NUMBER, DEFAULT_CACHE_EXPIRATION_TIME, DEFAULT_MIN_CACHE_CLEANING_TIME, CACHE_MAPS } from '../constants';

/** @typedef {{ isUsed?: boolean, expirationTime?: number | null, minCleaningTime?: number } | null} Options */

class Cache {

	/**
	 * @constructor
	 *
	 * @param {Options} [opts]
	 * Init cache and redux
	 */
	constructor(opts) {
		if (opts === null) opts = { isUsed: false };
		else if (opts === undefined) opts = {};
		const {
			isUsed, blocksLimit, expirationTime, minCleaningTime,
		} = opts;
		this.isUsed = isUsed === undefined ? USE_CACHE_BY_DEFAULT : isUsed;
		this.expirationTime = expirationTime === undefined ? DEFAULT_CACHE_EXPIRATION_TIME : expirationTime;
		if (![null, Number.POSITIVE_INFINITY, undefined].includes(blocksLimit) && (!Number.isInteger(blocksLimit) || blocksLimit < 0)) {
			throw new Error('Invalid "blockLimit" cache parameter');
		}
		this.blocksLimit = blocksLimit === undefined ? DEFAULT_BLOCKS_EXPIRATION_NUMBER : blocksLimit;
		this.minCleaningTime = minCleaningTime === undefined ? DEFAULT_MIN_CACHE_CLEANING_TIME : minCleaningTime;
		this.redux = { store: null };
		/** @type {{ time: number, map: string, key: string }[]} */
		this.expirations = [];
		this.blocksExpirations = [];
		this.timeout = null;
		this.reset();
	}

	/**
	 * @method reset
	 *
	 * Reset cache and redux
	 */
	reset() {
		this.subbedAccounts = new Map();
		this.subbedCommittee = new Map();
		this.getFullAccountsSubscriptions = new Map();

		this.objectsById = new Map();

		this.fullAccounts = new Map();
		this.accountsByName = new Map();
		this.accountsById = new Map();
		this.accountsIdByKey = Map();
		this.accountAddressesByAccountId = Map();
		this.accountEthAddressByAccountId = Map();
		this.accountBtcAddressByAccountId = Map();

		this.assetByAssetId = new Map();
		this.assetBySymbol = new Map();

		this.dynamicAssetDataByDynamicAssetDataId = new Map();
		this.bitAssetsByBitAssetId = new Map();

		this.dynamicIdToAssetId = new Map();
		this.bitAssetIdToAssetId = new Map();

		this.contractsByContractId = new Map();
		this.fullContractsByContractId = new Map();
		this.contractResultsByContractResultId = new Map();
		this.contractHistoryByContractId = new Map();
		this.contractObjectByContractId = new Map();

		this.blockHeadersByBlockNumber = Map();
		this.blocks = new Map();

		this.transactionsByBlockAndIndex = new Map();

		this.committeeMembersByAccountId = new Map();
		this.committeeMembersByCommitteeMemberId = new Map();

		this.objectsByVoteId = new Map();

		this.accountsBalanceByAccountId = new Map();
		this.accountsBalanceByAccountName = new Map();

		this.accountReferencesByAccountId = new Map();

		this.balanceObjectsByBalanceId = new Map();
		this.getAccountRefsOfAccountsCalls = new Map();

		this.chainProperties = new Map();
		this.globalProperties = new Map();
		this.config = new Map();
		this.chainId = null;
		this.dynamicGlobalProperties = new Map();

		this._clearTimeout();
		this.expirations = [];

		this._resetRedux();
	}

	_copyCacheToRedux() {
		if (!this.redux.store) return;

		const keys = Object.keys(this);

		for (const field of keys) {
			const value = this[field];
			this.redux.store.dispatch({ type: 'ECHO_SET_CACHE', payload: { field, value } });
		}
	}

	_removeExpired() {
		const date = Date.now();
		let expiredCount = 0;
		for (let i = 0; i < this.expirations.length; i += 1) {
			const { map, key, time } = this.expirations[i];
			if (time > date) break;
			this.set(map, this[map].delete(key));
			expiredCount += 1;
		}
		this.expirations = this.expirations.slice(expiredCount);
		this._clearTimeout();
		if (this.expirations.length) {
			const [{ time }] = this.expirations;
			this.timeout = setTimeout(this._removeExpired.bind(this), Math.max(time - date, this.minCleaningTime));
		}
	}

	_clearLastBlock() {
		const key = this.blocksExpirations.shift();
		this.set('blocks', this.blocks.delete(key));
	}

	_clearTimeout() {
		clearTimeout(this.timeout);
		this.timeout = null;
	}

	/**
	 * @method setInMap
	 *
	 * Set in cache and redux
	 *
	 * @param {Object} map
	 * @param {String} key
	 * @param {Object} value
	 * @returns {Cache}
	 */
	setInMap(map, key, value) {
		if (this.isUsed) {
			if (map === CACHE_MAPS.BLOCKS && this.blocksLimit !== null) {
				if (this.blocksLimit !== 0) {
					this.set(map, this.blocks.set(key, value));
					this.blocksExpirations.push(key);

					if (this.blocksExpirations.length > this.blocksLimit) {
						this._clearLastBlock();
					}
				}
			} else {
				this.set(map, this[map].set(key, value));

				if (this.expirationTime !== null) {
					this.expirations.push({ time: Date.now() + this.expirationTime, map, key });
					if (!this.timeout) this.timeout = setTimeout(this._removeExpired.bind(this), this.expirationTime);
				}
			}
		}
		return this;
	}

	/**
	 * @method set
	 *
	 * Set field in cache and redux
	 *
	 * @param {String} field
	 * @param {Object} value
	 * @returns {Cache}
	 */
	set(field, value) {
		if (this.isUsed) {
			this[field] = value;
			if (this.redux.store) {
				this.redux.store.dispatch({ type: 'ECHO_SET_CACHE', payload: { field, value } });
			}
		}
		return this;
	}

	_resetRedux() {
		if (this.redux.store) {
			this.redux.store.dispatch({ type: 'ECHO_RESET_CACHE' });
		}
	}

	/**
	 * @method removeRedux
	 *
	 * Reset redux object
	 */
	removeRedux() {
		this.redux.store = null;
	}

	/**
	 * @method setStore
	 *
	 * Reset redux object
	 *
	 * @param {Object} store
	 */
	setStore({ store }) {
		if (isVoid(store)) return;

		if (!isObject(store) || !isFunction(store.getState) || !isFunction(store.dispatch) || isVoid(store.getState())) {
			throw new Error('Expected the state and dispatch to be available');
		}

		this.redux.store = store;
		this._copyCacheToRedux();
	}

	/**
	 * @method setStore
	 *
	 * Set redux store options
	 *
	 * @param {Object} options
	 */
	setOptions(options) {

		if (!isObject(options)) return;

		try {
			this.setStore(options);
		} catch (error) {
			throw error;
		}
	}

}

export default Cache;
