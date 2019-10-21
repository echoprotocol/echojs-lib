import { expect } from 'chai';
import { ok } from 'assert';

import echo from '../../src';

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

	describe('register account pow', () => {
		it('register account', async () => {

				const result = await echo.api.registerAccountPow(
					'kokoko'+ Date.now(),
					'ECHODvHDsAfk2M8LhYcxLZTbrNJRWT3UH5zxdaWimWc6uZkH',
					'ECHODvHDsAfk2M8LhYcxLZTbrNJRWT3UH5zxdaWimWc6uZkH',
					() => {
						console.log('was broadcasted');
					}
				)

				ok(Array.isArray(result));
		}).timeout(1e8);
	});

});
