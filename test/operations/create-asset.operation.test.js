import 'mocha';
import { accountId, url, privateKey } from '../_test-data';
import { Echo, OPERATIONS_IDS } from '../../src';
import { inspect } from 'util';
import { OBJECT_TYPES } from '../../src/constants';
import testExtensionsField from './_testExtensionsField';

/** @returns {string} */
function getRandomAssetSymbol() {
	const charCodes = new Array(16).fill(0).map(() => Math.floor(Math.random() * 26) + 65);
	const result = String.fromCharCode(...charCodes);
	return result;
}

describe('create asset', () => {
	const echo = new Echo();
	before(async () => await echo.connect(url));
	after(async () => await echo.disconnect());

	describe('when "bitasset_opts" field is not provided', () => {
		/** @type {import("../../types/echo/transaction").default} */
		let tx;
		it('transaction building should not rejects', () => {
			tx = echo.createTransaction().addOperation(OPERATIONS_IDS.ASSET_CREATE, {
				issuer: accountId,
				symbol: getRandomAssetSymbol(),
				precision: 5,
				common_options: {
					max_supply: 1e15,
					issuer_permissions: 79,
					flags: 0,
					core_exchange_rate: {
						base: { amount: 10, asset_id: `1.${OBJECT_TYPES.ASSET}.0` },
						quote: { amount: 1, asset_id: `1.${OBJECT_TYPES.ASSET}.1` },
					},
					whitelist_authorities: [],
					blacklist_authorities: [],
					description: '',
				},
				bitasset_opts: undefined,
			}).addSigner(privateKey);
		});
		let result;
		it('transaction broadcasting should not rejects', async () => {
			result = await tx.broadcast();
		}).timeout(7e3);
	});

	testExtensionsField(echo, OPERATIONS_IDS.ASSET_CREATE, (extensions) => ({
		issuer: accountId,
		symbol: getRandomAssetSymbol(),
		precision: 5,
		common_options: {
			max_supply: 1e15,
			issuer_permissions: 79,
			flags: 0,
			core_exchange_rate: {
				base: { amount: 10, asset_id: `1.${OBJECT_TYPES.ASSET}.0` },
				quote: { amount: 1, asset_id: `1.${OBJECT_TYPES.ASSET}.1` },
			},
			whitelist_authorities: [],
			blacklist_authorities: [],
			description: '',
		},
		bitasset_opts: undefined,
		extensions,
	}));
});
