import { deepStrictEqual, strictEqual } from 'assert';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { url, privateKey, accountId, contractId } from './_test-data';
import { Echo, constants } from '../src';

import { BASE, ACCOUNT, ASSET, CONTRACT } from '../src/constants/object-types';
import { IMPLEMENTATION_OBJECT_TYPE } from '../src/constants/chain-types';

chai.use(spies);

describe.skip('SUBSCRIBER', () => {
	let echo = new Echo();

	before(async () => {
		await echo.connect(
			url,
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

	describe('_updateObject', () => {
		describe.skip('isOperationHistoryId', () => {
			it('save contractId and history in cache', async () => {
				strictEqual(echo.subscriber.cache.contractHistoryByContractId.get(contractId), undefined);
				const [opRes] = await echo.createTransaction().addOperation(constants.OPERATIONS_IDS.CALL_CONTRACT, {
					registrar: accountId,
					value: { asset_id: `1.${ASSET}.0`, amount: 0 },
					code: '86be3f80' + '0000000000000000000000000000000000000000000000000000000000000001',
					callee: contractId,
				}).addSigner(privateKey).broadcast();
				await new Promise((resolve) => setTimeout(() => resolve(), 100));
				const history = echo.subscriber.cache.contractHistoryByContractId.get(contractId);
				const lastAddedHistory = history[history.length - 1].toJS();
				strictEqual(lastAddedHistory.block_num, opRes.block_num);
				deepStrictEqual(lastAddedHistory.result, opRes.trx.operation_results[0]);
				deepStrictEqual(lastAddedHistory.op, opRes.trx.operations[0]);
				deepStrictEqual(lastAddedHistory.extensions, opRes.trx.extensions);
				strictEqual(lastAddedHistory.trx_in_block, opRes.trx_num);
			}).timeout(10000);
		});
	});

	describe('echorand', () => {
        describe('setEchorandSubscribe', () => {
            it('is not a function', async () => {
                try {
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
	});

    describe('block', () => {
        describe('setBlockApplySubscribe', () => {
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


            it('test', (done) => {
                let isCalled = false;

                echo.subscriber.setBlockApplySubscribe((result) => {
                    expect(result).to.be.an('array').that.is.not.empty;
                    expect(result[0]).to.be.an('string').that.is.not.empty;

                    if (!isCalled) {
                        done();
                        isCalled = true;
                    }
                });
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
            it('test', (done) => {
                let isCalled = false;

                echo.api.getObjects([`2.${IMPLEMENTATION_OBJECT_TYPE.DYNAMIC_GLOBAL_PROPERTY}.0`]);

                echo.subscriber.setGlobalSubscribe((result) => {
                    if (result[0] && result[0].id === `2.${IMPLEMENTATION_OBJECT_TYPE.DYNAMIC_GLOBAL_PROPERTY}.0`) {
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

	describe.skip('setMarketSubscribe', () => {
		it('invalid asset', async () => {
			try {
				await echo.subscriber.setMarketSubscribe(1, 2, () => {});
			} catch (err) {
				expect(err.message).to.equal('Invalid asset ID');
			}
		});

		it('test', async () => {
			await echo.subscriber.setMarketSubscribe(`1.${ASSET}.0`, `1.${ASSET}.1`, () => {});
			expect(echo.subscriber.subscribers.market[`1.${ASSET}.0_1.${ASSET}.1`].length).to.equal(1);
		});
	});

	describe.skip('removeMarketSubscribe', () => {

		it('invalid asset',  async () => {
			try {
				const callback = () => {};
				await echo.subscriber.setMarketSubscribe(`1.${ASSET}.0', '1.${ASSET}.1`, callback);
				await echo.subscriber.removeMarketSubscribe(1, 2, callback);
			} catch (err) {
				expect(err.message).to.equal('Invalid asset ID');
			}
		});

		it('not such subscription', async () => {
			const callback = () => {};
			await echo.subscriber.setMarketSubscribe(`1.${ASSET}.0', '1.${ASSET}.1`, callback);

			const { length } = echo.subscriber.subscribers.market[`1.${ASSET}.0_1.${ASSET}.1`];
			await echo.subscriber.removeMarketSubscribe(`1.${ASSET}.0`, `1.${ASSET}.2`, callback);
			expect(echo.subscriber.subscribers.market[`1.${ASSET}.0_1.${ASSET}.1`].length).to.equal(length);
		});

		it('test', async () => {
			const callback = () => {};
			await echo.subscriber.setMarketSubscribe(`1.${ASSET}.0`, `1.${ASSET}.1`, callback);

			const { length } = echo.subscriber.subscribers.market[`1.${ASSET}.0_1.${ASSET}.1`];
			await echo.subscriber.removeMarketSubscribe(`1.${ASSET}.0`, `1.${ASSET}.1`, callback);
			expect(echo.subscriber.subscribers.market[`1.${ASSET}.0_1.${ASSET}.1`].length).to.equal(length - 1);
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

	describe('setContractLogsSubscribe', () => {
		it('test', async () => {
			await echo.subscriber.setContractLogsSubscribe(`1.${CONTRACT}.0`, () => {});
			expect(echo.subscriber.subscribers.logs[`1.${CONTRACT}.0`].length).to.equal(1);
		});
	});

	describe('removeContractLogsSubscribe', () => {
		it('test', async () => {
			const callback = () => {};
			await echo.subscriber.setContractLogsSubscribe(`1.${CONTRACT}.0`, callback);

			const { length } = echo.subscriber.subscribers.logs[`1.${CONTRACT}.0`];
			await echo.subscriber.removeContractLogsSubscribe(`1.${CONTRACT}.0`, callback);
			expect(echo.subscriber.subscribers.logs[`1.${CONTRACT}.0`].length).to.equal(length - 1);
		});
	});

	after(async () => {
		await echo.disconnect();
	});
});
