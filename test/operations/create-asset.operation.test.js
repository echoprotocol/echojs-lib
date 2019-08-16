import 'mocha';
import { constants, Echo } from '../../src/index';
import { accountId, url } from '../_test-data';
import { assetCreate } from '../../src/echo/operations';
import testExtensionsField from './_testExtensionsField';

function getRandomAssetSymbol() {
	const charCodes = new Array(16).fill(0).map(() => Math.floor(Math.random() * 26) + 65);
	const result = String.fromCharCode(...charCodes);
	return result;
}

describe('create asset', () => {
	const echo = new Echo();

	before(async () => await echo.connect(url));
	after(async () => await echo.disconnect());

	describe('successful validation', () => {
		it('full object', () => {
			assetCreate.validate([constants.OPERATIONS_IDS.ASSET_CREATE, {
				fee: { asset_id: `1.${constants.OBJECT_TYPES.ACCOUNT}.0` },
				issuer: accountId,
				symbol: 'NEWASSET',
				precision: 5,
				common_options: {
					max_supply: 1000000000000000,
					market_fee_percent: 0,
					max_market_fee: 1000000000000000,
					issuer_permissions: 79,
					flags: 0,
					core_exchange_rate: {
						base: {
							amount: 10,
							asset_id: `1.${ASSET}.0`,
						},
						quote: {
							amount: 1,
							asset_id: `1.${ASSET}.1`,
						}
					},
					whitelist_authorities: [],
					blacklist_authorities: [],
					whitelist_markets: [],
					blacklist_markets: [],
					description: '',
				},
				bitasset_opts: undefined,
				is_prediction_market: false,
			}]);
		});
	});

	testExtensionsField(echo, constants.OPERATIONS_IDS.ASSET_CREATE, (extensions) => ({
		issuer: accountId,
		symbol: getRandomAssetSymbol(),
		precision: 5,
		common_options: {
			max_supply: 1e15,
			market_fee_percent: 0,
			max_market_fee: 1e15,
			issuer_permissions: 79,
			flags: 0,
			core_exchange_rate: {
				base: { amount: 10, asset_id: '1.3.0' },
				quote: { amount: 1, asset_id: '1.3.1' }
			},
			whitelist_authorities: [],
			blacklist_authorities: [],
			whitelist_markets: [],
			blacklist_markets: [],
			description: '',
		},
		bitasset_opts: undefined,
		is_prediction_market: false,
		extensions,
	}));
});
