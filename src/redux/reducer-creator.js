import { createModule } from 'redux-modules';
import { Map } from 'immutable';

let DEFAULT_FIELDS = Map({
	subbedAccounts: new Map(),
	subbedWitnesses: new Map(),
	subbedCommittee: new Map(),
	getFullAccountsSubscriptions: new Map(),

	objectsById: new Map(),

	accountsByName: new Map(),
	accountsById: new Map(),
	accountsIdByKey: Map(),

	assetByAssetId: new Map(),
	assetBySymbol: new Map(),

	contractsByContractId: new Map(),
	fullContractsByContractId: new Map(),
	contractResultsByContractResultId: new Map(),

	blockHeadersByBlockNumber: Map(),
	blocks: new Map(),

	transactionsByBlockAndIndex: new Map(),

	witnessByAccountId: new Map(),
	witnessByWitnessId: new Map(),

	committeeMembersByAccountId: new Map(),
	committeeMembersByCommitteeMemberId: new Map(),

	objectsByVoteId: new Map(),

	accountsBalanceByAccountId: new Map(),
	accountsBalanceByAccountName: new Map(),

	accountReferencesByAccountId: new Map(),

	bitAssetsByBitAssetId: new Map(),
	dynamicAssetDataByDynamicAssetDataId: new Map(),

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
 * @param {String} reducerName
 * @param {Object|undefined} caches
 * @returns {*}
 */
export default (reducerName, caches) => {
	if (caches) {
		DEFAULT_FIELDS = caches;
	}

	return createModule({
		name: reducerName,
		initialState: DEFAULT_FIELDS,
		transformations: {
			set: {
				reducer: (state, { payload }) => {

					if (!state.has(payload.field)) {
						return state;
					}

					state = state.set(payload.field, payload.value);

					return state;
				},
			},

			reset: {
				reducer: () => DEFAULT_FIELDS,
			},
		},
	});
};
