import assert from 'assert';
import { expect } from 'chai';

import echo, { constants } from '../index';

describe('SUBSCRIBER', () => {
	before(async () => {
		await echo.connect('ws://195.201.164.54:6311', {
			connectionTimeout: 5000,
			maxRetries: 5,
			pingTimeout: 3000,
			pingInterval: 3000,
			debug: false,
			apis: ['database', 'network_broadcast', 'history', 'registration', 'asset', 'login', 'network_node']
		});
	});


	describe('setEchorandSubscribe / removeEchorandSubscribe', () => {
		let index;

		it('test', (done) => {
			let isCalled = false;

			echo.subscriber.setEchorandSubscribe((result) => {
				expect(result).to.be.an('array').that.is.not.empty;
				expect(result[0]).to.be.an('object').that.is.not.empty;
				expect(result[0].type).to.be.a('number');
				expect(result[0].round).to.be.a('number');

				if (!isCalled) {
					done();
					isCalled = true;
				}
			}).then((i) => {
				index = i;
			});
		}).timeout(30 * 1000);

		after(() => {
			echo.subscriber.removeEchorandSubscribe(index);
		});
	});

	after(() => {
		echo.disconnect();
	});
});
