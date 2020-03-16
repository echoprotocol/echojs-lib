import 'mocha';
import { accountId, url, privateKey } from '../_test-data';
import { getRandomAssetSymbol } from '../_test-utils';
import { Echo, OPERATIONS_IDS } from '../../';
import { PROTOCOL_OBJECT_TYPE_ID } from '../../src/constants';
import testExtensionsField from './_testExtensionsField';

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
					issuer_permissions: 15,
					flags: 0,
					core_exchange_rate: {
						base: { amount: 10, asset_id: `1.${PROTOCOL_OBJECT_TYPE_ID.ASSET}.0` },
						quote: { amount: 1, asset_id: `1.${PROTOCOL_OBJECT_TYPE_ID.ASSET}.1` },
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
		}).timeout(15e3);
	});

	testExtensionsField(echo, OPERATIONS_IDS.ASSET_CREATE, (extensions) => ({
		issuer: accountId,
		symbol: getRandomAssetSymbol(),
		precision: 5,
		common_options: {
			max_supply: 1e15,
			issuer_permissions: 15,
			flags: 0,
			core_exchange_rate: {
				base: { amount: 10, asset_id: `1.${PROTOCOL_OBJECT_TYPE_ID.ASSET}.0` },
				quote: { amount: 1, asset_id: `1.${PROTOCOL_OBJECT_TYPE_ID.ASSET}.1` },
			},
			whitelist_authorities: [],
			blacklist_authorities: [],
			description: '',
		},
		bitasset_opts: undefined,
		extensions,
	}));
});
