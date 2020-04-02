import { url, accountId, privateKey } from '../_test-data';
import { Echo, OPERATIONS_IDS, constants } from '../../';
import { getRandomAssetSymbol } from '../_test-utils';
import { strictEqual } from 'assert';

/** @typedef {ReturnType<Echo['createTransaction']>} Transaction */

describe('asset issue', () => {
	const echo = new Echo();
	/** @type {string} */
	let assetId;
	before(async function () {
		this.timeout(15e3);
		await echo.connect(url);
		/** @type {string} */
		assetId = await echo.createTransaction().addOperation(OPERATIONS_IDS.ASSET_CREATE, {
			issuer: accountId,
			symbol: getRandomAssetSymbol(),
			precision: 4,
			common_options: {
				max_supply: '1e15',
				issuer_permissions: 15,
				flags: 0,
				core_exchange_rate: {
					base: { amount: 10, asset_id: `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ASSET}.0` },
					quote: { amount: 1, asset_id: `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ASSET}.1` },
				},
				whitelist_authorities: [],
				blacklist_authorities: [],
				description: '',
			},
		}).addSigner(privateKey).broadcast().then((txRes) => txRes[0].trx.operation_results[0][1]);
	});
	after(async () => await echo.disconnect());
	describe('when should succeed', () => {
		const value = 123;
		/** @type {Transaction} */
		let tx;
		it('tx building should succeed', () => {
			tx = echo.createTransaction().addOperation(OPERATIONS_IDS.ASSET_ISSUE, {
				asset_to_issue: { asset_id: assetId, amount: value },
				issue_to_account: accountId,
				issuer: accountId,
			});
		});
		it('tx signing should succeed', async function () {
			if (!tx) this.skip();
			await tx.sign(privateKey);
		});
		it('tx broadcasting should succeed', async function () {
			if (!tx) this.skip();
			await tx.broadcast();
		}).timeout(15e3);
		it('balance should change', async () => {
			const balance = await echo.api.getAccountBalances(accountId, [assetId]);
			strictEqual(balance[0].amount, value);
		});
	});

});
