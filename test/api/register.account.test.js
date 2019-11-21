import { ok } from 'assert';

// eslint-disable-next-line import/no-unresolved, import/extensions
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
			apis: ['database', 'registration'], // constants.WS_CONSTANTS.CHAIN_APIS,
		});

	});

	after(async () => { await echo.disconnect(); });

	describe('register account', () => {
		it('register account', async () => {
			const result = await echo.api.registerAccount(
				`kokoko${Date.now()}`,
				'ECHODvHDsAfk2M8LhYcxLZTbrNJRWT3UH5zxdaWimWc6uZkH',
				'ECHODvHDsAfk2M8LhYcxLZTbrNJRWT3UH5zxdaWimWc6uZkH',
				() => console.log('was broadcasted'),
			);
			ok(Array.isArray(result));
		}).timeout(1e8);
	});

});
