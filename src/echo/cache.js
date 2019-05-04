/* eslint-disable max-len,no-continue,no-restricted-syntax */
import { Map } from 'immutable';

import { isFunction, isObject, isVoid } from '../utils/validators';

class Cache {

	/**
	 * @constructor
	 *
	 * Init cache and redux
	 */
	constructor() {
		this.isUsed = true;

		this.redux = {
			store: null,
		};

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
			this.set(map, this[map].set(key, value));
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
