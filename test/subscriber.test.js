import { ok, deepStrictEqual, strictEqual } from 'assert';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { url, accountId, privateKey } from './_test-data';
import { shouldReject } from './_test-utils';
import { Echo, OPERATIONS_IDS, constants } from '..';

import { ACCOUNT, CONTRACT } from '../src/constants/object-types';
import { IMPLEMENTATION_OBJECT_TYPE_ID } from '../src/constants/chain-types';

chai.use(spies);

describe('SUBSCRIBER', () => {
	describe('setStatusSubscribe', () => {
		describe('when invalid status provided', () => {
			const echo = new Echo();
			shouldReject(async () => await echo.subscriber.setStatusSubscribe('conn', () => {}), 'Invalid status');
		});

		describe('when subscribed, but not connected', () => {
			const echo = new Echo();
			let connected = false;
			let disconnected = false;
			it('should not rejects', async () => {
				await Promise.all([
					echo.subscriber.setStatusSubscribe('connect', () => connected = true),
					echo.subscriber.setStatusSubscribe('disconnect', () => disconnected = true),
				]);
			});
			it('should not emits "connect" event', () => ok(!connected));
			it('should not emits "disconnected" event', () => ok(!disconnected));
		});

		describe('when subscribed on "connect" event', () => {
			const echo = new Echo();
			let connected = false;
			after(async () => await echo.disconnect());
			it('should not rejects', async () => {
				await echo.subscriber.setStatusSubscribe('connect', () => connected = true);
			});
			it('should not emits before connect', () => ok(!connected));
			it('should not rejects on connect', async () => await echo.connect(url));
			it('should emits after connect', () => ok(connected));
		});

		describe('when subscribed on "disconnect" event', () => {
			const echo = new Echo();
			let disconnected = false;
			it('should not rejects', async () => {
				await echo.subscriber.setStatusSubscribe('disconnect', () => disconnected = true);
			});
			it('should not emits before connect', () => ok(!disconnected));
			it('should not rejects on connect', async () => await echo.connect(url));
			it('should not emits after connect', () => ok(!disconnected));
			it('should not rejects on disconnect', async () => await echo.disconnect());
			it('should emits after disconnect', () => ok(disconnected));
		});

		describe('when connected on "connect" and "disconnect"', () => {
			const echo = new Echo();
			const STATUS = { CONNECTED: 'CONNECTED', DISCONNECTED: 'DISCONNECTED' };
			const events = [];
			after(async () => await echo.disconnect());
			it('should not rejects', async () => {
				await Promise.all([
					echo.subscriber.setStatusSubscribe('connect', () => events.push(STATUS.CONNECTED)),
					echo.subscriber.setStatusSubscribe('disconnect', () => events.push(STATUS.DISCONNECTED)),
				]);
			});
			it('should not emits "connect" event before connect', () => ok(!events.includes(STATUS.CONNECTED)));
			it('should not emits "disconnect" event before connect', () => ok(!events.includes(STATUS.DISCONNECTED)));
			it('should not rejects on connect', async () => await echo.connect(url));
			it('should emits single event "connect"', () => deepStrictEqual(events, [STATUS.CONNECTED]));
			it('should not rejects on reconnect', async () => await echo.reconnect());
			it('should emits "disconnect" event on reconnect', () => strictEqual(events[1], STATUS.DISCONNECTED));
			it('should emits "connect" event after reconnect', () => strictEqual(events[2], STATUS.CONNECTED));
			it('should not emits more events', function () {
				if (events.length < 3) this.skip();
				strictEqual(events.length, 3);
			});
		});
	});

	let echo = new Echo();

	describe('echorand', () => {
		describe('setEchorandSubscribe', () => {
			it('is not a function', async () => {
				try {
					await echo.connect(url, { apis: constants.WS_CONSTANTS.CHAIN_APIS });
					await echo.subscriber.setEchorandSubscribe(1);
				} catch (err) {
					expect(err.message).to.equal('Callback is not a function');
				}
			});

			it.skip('reconnect', (done) => {
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


			it('test', async () => {
				let emitted = false;
				let onEmit;
				const onceEmitted = new Promise((resolve) => onEmit = resolve);
				echo.subscriber.setEchorandSubscribe((result) => {
					expect(result).to.be.an('array').that.is.not.empty;
					expect(result[0]).to.be.an('object').that.is.not.empty;
					expect(result[0].type).to.be.a('string');
					expect(result[0].round).to.be.a('number');
					if (!emitted) {
						onEmit();
						emitted = true;
					}
				});
				await echo.createTransaction().addOperation(OPERATIONS_IDS.TRANSFER, {
					amount: { asset_id: '1.3.0', amount: 1 },
					extensions: [],
					from: accountId,
					to: '1.2.11',
				}).addSigner(privateKey).broadcast();
				await onceEmitted;
			}).timeout(30 * 1000);

		});

		describe('removeEchorandSubscribe', () => {
			it('test', async () => {
				const callback = () => {};
				await echo.subscriber.setEchorandSubscribe(callback);
				echo.subscriber.removeEchorandSubscribe(callback);
			});
		});
	});

	describe('block', () => {
		describe('setBlockApplySubscribe', () => {
			const accountToTransfer = '1.2.11';
			before(async function () {
				this.timeout(30e3);
				ok(accountToTransfer !== accountId);
				if (!echo.isConnected) await echo.connect(url, { apis: constants.WS_CONSTANTS.CHAIN_APIS });
			});

			it('is not a function', async () => {
				try {
					await echo.subscriber.setBlockApplySubscribe(1);
				} catch (err) {
					expect(err.message).to.equal('Callback is not a function');
				}
			});

			it.skip('reconnect', (done) => {
				let isCalled = false;
				let isReconnected = false;

				echo.subscriber.setBlockApplySubscribe(() => {
					if (!isCalled && isReconnected) {
						done();
						isCalled = true;
					}
				}).then(() => echo.reconnect()).then(() => {
					isReconnected = true;
				});
			}).timeout(30 * 1000);


			it('test', async () => {
				let emitted = false;
				let onInited;
				const onceEmitted = new Promise((resolve) => onInited = resolve);

				echo.subscriber.setBlockApplySubscribe((result) => {
					expect(result).to.be.an('array').that.is.not.empty;
					expect(result[0]).to.be.an('string').that.is.not.empty;

					if (!emitted) {
						emitted = true;
						onInited();
					}
				});
				// create transaction to trigger block producing
				await echo.createTransaction().addOperation(OPERATIONS_IDS.TRANSFER, {
					amount: { asset_id: '1.3.0', amount: 1 },
					extensions: [],
					from: accountId,
					to: accountToTransfer,
				}).addSigner(privateKey).broadcast();
				await onceEmitted;
			}).timeout(30 * 1000);

		});

		describe('removeBlockApplySubscribe', () => {
			it('test', async () => {
				const callback = () => {};
				await echo.subscriber.setBlockApplySubscribe(callback);
				echo.subscriber.removeBlockApplySubscribe(callback);
			});
		});
	});

	describe('account', () => {
		describe('setAccountSubscribe', () => {
			it('is not a function', async () => {
				try {
					await echo.subscriber.setBlockApplySubscribe(1);
				} catch (err) {
					expect(err.message).to.equal('Callback is not a function');
				}
			});

			it('accounts should be an array', async () => {
				try {
					const callback = () => {};
					await echo.subscriber.setAccountSubscribe(callback, 1);
				} catch (err) {
					expect(err.message).to.equal('Accounts should be an array');
				}
			});

			it('accounts length should be more then 0', async () => {
				try {
					const callback = () => {};
					const accounts = [];
					await echo.subscriber.setAccountSubscribe(callback, accounts);
				} catch (err) {
					expect(err.message).to.equal('Accounts length should be more then 0');
				}
			});

			it('accounts should contain valid account ids', async () => {
				try {
					const callback = () => {};
					const accounts = [1];
					await echo.subscriber.setAccountSubscribe(callback, accounts);
				} catch (err) {
					expect(err.message).to.equal('Accounts should contain valid account ids');
				}
			});

			it.skip('reconnect', (done) => {
				let isCalled = false;
				let isReconnected = false;

				echo.subscriber.setAccountSubscribe(() => {
					if (!isCalled && isReconnected) {
						done();
						isCalled = true;
					}
				}, [`1.${ACCOUNT}.1`]).then(() => echo.reconnect()).then(() => {
					isReconnected = true;
				});
			}).timeout(30 * 1000);


			it.skip('test', (done) => {
				let isCalled = false;

				echo.subscriber.setAccountSubscribe((result) => {
					expect(result).to.be.an('object').that.is.not.empty;

					if (!isCalled) {
						done();
						isCalled = true;
					}
				}, [`1.${ACCOUNT}.16`]);
			}).timeout(300 * 1000);

		});

		describe('removeAccountSubscribe', () => {
			it('test', async () => {
				const callback = () => {};
				await echo.subscriber.setAccountSubscribe(callback, [`1.${ACCOUNT}.1`]);
				echo.subscriber.removeAccountSubscribe(callback);
			});
		});
	});

	describe('global', () => {
		describe('setGlobalSubscribe', () => {
			it('test', async () => {
				let emitted = false;
				let onEmit;
				const onceEmitted = new Promise((resolve) => onEmit = resolve);
				echo.subscriber.setGlobalSubscribe((result) => {
					if (result[0] && result[0].id === `2.${IMPLEMENTATION_OBJECT_TYPE_ID.DYNAMIC_GLOBAL_PROPERTY}.0`) {
						expect(result).to.be.an('array').that.is.not.empty;
						expect(result[0]).to.be.an('object').that.is.not.empty;
						expect(result[0].id).to.be.a('string');
						expect(result[0].head_block_number).to.be.a('number');

						if (!emitted) {
							emitted = true;
							onEmit();
						}
					}
				});
				await echo.createTransaction().addOperation(OPERATIONS_IDS.TRANSFER, {
					amount: { amount: 1, asset_id: '1.3.0' },
					extensions: [],
					from: accountId,
					to: '1.2.11',
				}).addSigner(privateKey).broadcast();
				await onceEmitted;
			}).timeout(30 * 1000);
		});

		describe('removeGlobalSubscribe', () => {
			it('test', async () => {
				const callback = () => {};
				await echo.subscriber.setGlobalSubscribe(callback);
				echo.subscriber.removeGlobalSubscribe(callback);
			});
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

	describe.skip('setStatusSubscribe', () => {
		it('status - connect', async () => {
			const spy = chai.spy(() => {});

			echo.subscriber.setStatusSubscribe('connect', spy);
			await echo.reconnect();
			expect(spy).to.have.been.called(1);
		});

		it('status - disconnect', async () => {
			const spy = chai.spy(() => {});

			echo.subscriber.setStatusSubscribe('disconnect', spy);
			await echo.reconnect();
			expect(spy).to.have.been.called(1);
		});

	});

	describe.skip('removeStatusSubscribe', () => {

		it('status - connect',  async () => {
			const spy = chai.spy(() => {});

			const { length } = echo.subscriber.subscribers.connect;
			echo.subscriber.setStatusSubscribe('connect', spy);
			echo.subscriber.removeStatusSubscribe('connect', spy);
			await echo.reconnect();
			expect(echo.subscriber.subscribers.connect.length).to.equal(length);
			expect(spy).to.not.have.been.called();
		});

		it('status - disconnect', async () => {
			const spy = chai.spy(() => {});

			const { length } = echo.subscriber.subscribers.disconnect;
			echo.subscriber.setStatusSubscribe('disconnect', spy);
			echo.subscriber.removeStatusSubscribe('disconnect', spy);
			await echo.reconnect();
			expect(echo.subscriber.subscribers.disconnect.length).to.equal(length);
			expect(spy).to.not.have.been.called();
		});
	});

	describe('setContractSubscribe', () => {
		it('test', async () => {
			await echo.subscriber.setContractSubscribe([`1.${CONTRACT}.23`], () => {});
			expect(echo.subscriber.subscribers.contract.length).to.equal(1);
		});
	});

	describe('removeContractSubscribe', () => {
		it('test', async () => {
			const callback = () => {};
			await echo.subscriber.setContractSubscribe([`1.${CONTRACT}.23`], callback);

			const { length } = echo.subscriber.subscribers.contract;
			await echo.subscriber.removeContractSubscribe(callback);
			expect(echo.subscriber.subscribers.contract.length).to.equal(length - 1);
		});
	});

	after(async () => {
		if (echo.isConnected) await echo.disconnect();
	});
});
