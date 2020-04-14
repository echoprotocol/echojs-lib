import { ok } from 'assert';

import echo from '../..';
import { url } from '../_test-data';

describe('API register account POW', () => {
	before(async () => {
		await echo.connect(url, {
			connectionTimeout: 30000,
			maxRetries: 5,
			pingTimeout: 3000,
			pingDelay: 10000,
			debug: false,
			apis: ['database', 'registration'],//constants.WS_CONSTANTS.CHAIN_APIS,
		});

	});

	after(async () => await echo.disconnect());

	describe('register account', () => {
		it('register account', () => new Promise(async (resolve, reject) => {
			try {
				let isResolved = false;
				let isPromiseRejectionHandled = false;
				const promise = echo.api.registerAccount(
					'kokoko'+ Date.now(),
					'ECHODvHDsAfk2M8LhYcxLZTbrNJRWT3UH5zxdaWimWc6uZkH',
					'ECHODvHDsAfk2M8LhYcxLZTbrNJRWT3UH5zxdaWimWc6uZkH',
					null,
					() => isResolved = true,
				).catch((err) => {
					if (isPromiseRejectionHandled) throw err;
					reject(err);
				});
				await new Promise((resolve) => setTimeout(() => resolve(), 100));
				await echo.api.getAccountCount();
				ok(!isResolved);
				isPromiseRejectionHandled = true;
				const result = await promise;
				ok(isResolved);
				ok(Array.isArray(result));
				resolve();
			} catch (err) {
				reject(err);
			}
		})).timeout(1e8);
	});

});
