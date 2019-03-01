import "mocha";

import { constants } from "../../src/index";

import { accountId } from "../_test-data";

import { assetCreate } from '../../src/echo/operations';

describe('create asset', () => {
	describe('successful validation', () => {
		it('full object', () => {
			assetCreate.validate([constants.OPERATIONS.ASSET_CREATE, {
                fee: { asset_id: '1.3.0' },
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
                            asset_id: '1.3.0',
                        },
                        quote: {
                            amount: 1,
                            asset_id: '1.3.1',
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
    })
});
