import assert from 'assert';

import { Echo, constants } from '../';

import { httpUrl, walletHttpURL } from './_test-data';
import { shouldReject } from './_test-utils';

const { WS_CONSTANTS: { CHAIN_API } } = constants;

describe('Http connection', () => {
	describe('When connected without apis option', () => {
		const echo = new Echo();
		it('should not reject', () => echo.connect(httpUrl));
		it('should connect only database api', () => {
			assert.deepStrictEqual(echo.apis, new Set([CHAIN_API.DATABASE_API]));
		});
	});
	describe('When connected with not database api', () => {
		const echo = new Echo();
		const api = CHAIN_API.NETWORK_BROADCAST_API;
		shouldReject(() => echo.connect(httpUrl, { apis: [api] }), `${api} not available through http connection`);
	});
	describe('When try to call not database api', () => {
		const echo = new Echo();
		before(() => echo.connect(httpUrl));
		shouldReject(
			() => echo.api.getAllAssetHolders(),
			`${CHAIN_API.ASSET_API} API is not available, try to specify this in connection option called "apis"`,
		);
	});
	describe('When database api method called', () => {
		const echo = new Echo();
		before(() => echo.connect(httpUrl));
		let res;
		it('should not reject', async () => res = await echo.api.getChainProperties());
		it('should return', () => assert.notStrictEqual(res, undefined));
		it('result should be valid', () => {
			assert.ok(typeof res === 'object');
			assert.ok(res !== null);
			assert.ok(['id', 'chain_id'].every((field) => res[field] !== undefined));
		});
	});
	describe('When database method with callback called', () => {
		const echo = new Echo();
		before(() => echo.connect(httpUrl));
		shouldReject(async () => {
			await echo.api.getContractLogs();
		}, 'method get_contract_logs not supported by http connection');
	});
	describe('When useless database method called', () => {
		const echo = new Echo();
		before(() => echo.connect(httpUrl));
		shouldReject(async () => {
			await echo.api.unsubscribeContractLogs(0);
		}, 'method unsubscribe_contract_logs not supported by http connection');
	});
	describe('When http connection used for wallet api', () => {
		const echo = new Echo();
		it('connect should not reject', () => echo.connect(null, { wallet: walletHttpURL }));
		let res;
		it('method call should not reject', async () => res = await echo.walletApi.networkGetConnectedPeers());
		it('should return', () => assert.notStrictEqual(res, undefined));
		it('result should be valid', () => assert.ok(Array.isArray(res)));
	});
});
