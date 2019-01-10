import assert from 'assert';
import { expect } from 'chai';

import echo, { constants } from '../index';

describe('SUBSCRIBER', () => {
	before(async () => {
		await echo.connect(
			'ws://195.201.164.54:6311',
			{
				apis: [
					'database',
					'network_broadcast',
					'history',
					'registration',
					'asset',
					'login',
					'network_node',
				],
			},
		);
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
				expect(result[0].type).to.be.a('string');
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

	describe('setGlobalSubscribe', () => {
		it('test', (done) => {
			let isCalled = false;

			echo.api.getObjects(['2.1.0']);

			echo.subscriber.setGlobalSubscribe((result) => {
				if (result[0] && result[0].id === '2.1.0') {
					expect(result).to.be.an('array').that.is.not.empty;
					expect(result[0]).to.be.an('object').that.is.not.empty;
					expect(result[0].id).to.be.a('string');
					expect(result[0].head_block_number).to.be.a('number');

					if (!isCalled) {
						done();
						isCalled = true;
					}
				}
			});
		}).timeout(30 * 1000);
	});

	describe('removeGlobalSubscribe', () => {
		it('test', async () => {
			const callback = () => {};
			await echo.subscriber.setGlobalSubscribe(callback);
			echo.subscriber.removeGlobalSubscribe(callback);
		});
	});

	describe('setPendingTransactionSubscribe', () => {
		it('is not a function', async () => {
			try {
				await echo.subscriber.setPendingTransactionSubscribe(1);
			} catch (err) {
				expect(err.message).to.equal('Callback is not a function');
			}
		});

		it('test', (done) => {
			/* callback test will be available, when transaction builder will be merged */
			// let isCalled = false;

			expect(echo.subscriber.subscriptions.transaction).to.be.false;
			expect(echo.subscriber.subscribers.transaction).to.be.an('array').that.is.empty;

			echo.subscriber.setPendingTransactionSubscribe((result) => {
				// expect(result).to.be.an('array').that.is.not.empty;
				// expect(result[0]).to.be.an('object').that.is.not.empty;
				// expect(result[0].type).to.be.a('number');
				// expect(result[0].round).to.be.a('number');
				//
				// if (!isCalled) {
				// 	done();
				// 	isCalled = true;
				// }
			}).then(() => {
				expect(echo.subscriber.subscriptions.transaction).to.be.true;
				expect(echo.subscriber.subscribers.transaction).to.be.an('array').that.is.not.empty;
				done();
			});
		}).timeout(30 * 1000);

	});

	describe('removePendingTransactionSubscribe', () => {
		it('test', async () => {
			const { length } = echo.subscriber.subscribers.transaction;

			const callback = () => {};
			await echo.subscriber.setPendingTransactionSubscribe(callback);
			echo.subscriber.removePendingTransactionSubscribe(callback);

			expect(echo.subscriber.subscribers.transaction.length).to.equal(length);
		});
	});

	after(async () => {
		await echo.disconnect();
	});
});
