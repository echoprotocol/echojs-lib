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
		let result2 = false;
		let res;
		it('register account', async () => {
			const result = new Promise(async (resolve) => {
				return resolve(echo.api.registerAccount(
						'kokoko'+ Date.now(),
						'ECHODvHDsAfk2M8LhYcxLZTbrNJRWT3UH5zxdaWimWc6uZkH',
						'ECHODvHDsAfk2M8LhYcxLZTbrNJRWT3UH5zxdaWimWc6uZkH',
						() => console.log('was broadcasted'),
					));
			});
			setTimeout(async () => await echo.api.getAccountCount(), 100);
			ok(!Array.isArray(result));
			const registrationResult = await result;
			ok(Array.isArray(registrationResult));
		}).timeout(1e8);
	});

});
