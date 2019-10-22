import { expect } from 'chai';
import { inspect } from 'util';

import echo from '../../src';

import { url } from '../_test-data';

describe('API register account', () => {
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
});
