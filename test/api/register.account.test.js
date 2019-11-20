import { ok } from 'assert';

import echo from '../..';
import { url } from '../_test-data';

describe('API register account POW', () => {
	before(async () => {
		await echo.connect(url, {
			connectionTimeout: 5000,
			maxRetries: 5,
			pingTimeout: 3000,
			pingDelay: 10000,
			debug: false,
			apis: ['database', 'registration'],//constants.WS_CONSTANTS.CHAIN_APIS,
		});

	});

	after(async () => await echo.disconnect());

	describe('register account', () => {
		it('register account', async () => {
			let isResolved = false;
			const promise = echo.api.registerAccount(
				'kokoko'+ Date.now(),
				'ECHODvHDsAfk2M8LhYcxLZTbrNJRWT3UH5zxdaWimWc6uZkH',
				'ECHODvHDsAfk2M8LhYcxLZTbrNJRWT3UH5zxdaWimWc6uZkH',
				() => isResolved = true,
			);
			await new Promise((resolve) => setTimeout(() => resolve(), 100));
			await echo.api.getAccountCount();
			ok(!isResolved);
			const result = await promise;
			ok(isResolved);
			ok(Array.isArray(result));
		}).timeout(1e8);
	});

});
