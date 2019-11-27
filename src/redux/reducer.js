import { Map } from 'immutable';

import { isArray, isString, isVoid } from '../utils/validators';

let DEFAULT_FIELDS = Map({
	subbedAccounts: new Map(),
	subbedCommittee: new Map(),
	getFullAccountsSubscriptions: new Map(),

	objectsById: new Map(),

	fullAccounts: new Map(),
	accountsByName: new Map(),
	accountsById: new Map(),
	accountsIdByKey: Map(),
	accountAddressesByAccountId: Map(),
	accountEthAddressByAccountId: Map(),
	accountBtcAddressByAccountId: Map(),

	assetByAssetId: new Map(),
	assetBySymbol: new Map(),

	contractsByContractId: new Map(),
	fullContractsByContractId: new Map(),
	contractResultsByContractResultId: new Map(),

	blockHeadersByBlockNumber: Map(),
	blocks: new Map(),

	transactionsByBlockAndIndex: new Map(),

	committeeMembersByAccountId: new Map(),
	committeeMembersByCommitteeMemberId: new Map(),

	objectsByVoteId: new Map(),

	accountsBalanceByAccountId: new Map(),
	accountsBalanceByAccountName: new Map(),

	accountReferencesByAccountId: new Map(),

	bitAssetsByBitAssetId: new Map(),
	dynamicAssetDataByDynamicAssetDataId: new Map(),

	dynamicIdToAssetId: new Map(),
	bitAssetIdToAssetId: new Map(),

	balanceObjectsByBalanceId: new Map(),
	getAccountRefsOfAccountsCalls: new Map(),
	fetchingGetFullAccounts: new Map(),

	chainProperties: null,
	globalProperties: null,
	config: null,
	chainId: null,
	dynamicGlobalProperties: null,
});

/**
 *
 * @param {Array|undefined|null} caches
 * @returns {Function}
 */
export default (caches) => {

	if (!isVoid(caches)) {
		if (isArray(caches) && caches.every((c) => isString(c))) {
			DEFAULT_FIELDS = new Map(caches.reduce((obj, c) => {

				if (DEFAULT_FIELDS.has(c)) {
					obj[c] = DEFAULT_FIELDS.get(c);
				}

				return obj;
			}, {}));
		} else {
			throw new Error('Caches is invalid');
		}
	}

	return (state = DEFAULT_FIELDS, { type, payload = {} }) => {
		switch (type) {
			case 'ECHO_SET_CACHE':
				return state.has(payload.field) ? state.set(payload.field, payload.value) : state;
			case 'ECHO_RESET_CACHE':
				return DEFAULT_FIELDS;
			default:
				return state;
		}
	};
};
