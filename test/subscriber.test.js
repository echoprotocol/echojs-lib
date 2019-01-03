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

	describe('setEchorandSubscribe', () => {
		it('is not a function', async () => {
			try {
				await echo.subscriber.setEchorandSubscribe(1);
			} catch (err) {
				expect(err.message).to.equal('Callback is not a function');
			}
		});

		it('reconnect', (done) => {
			let isCalled = false;
			let isReconnected = false;

			echo.subscriber.setEchorandSubscribe((result) => {
				if (!isCalled && isReconnected) {
					done();
					isCalled = true;
				}
			}).then(() => echo.reconnect()).then(() => {
				isReconnected = true;
			});
		}).timeout(30 * 1000);


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
			});
		}).timeout(30 * 1000);

	});

	describe('removeEchorandSubscribe', () => {
		it('test', async () => {
			const callback = () => {};
			await echo.subscriber.setEchorandSubscribe(callback);
			echo.subscriber.removeEchorandSubscribe(callback);
		});
	});

	after(() => {
		echo.disconnect();
	});
});
