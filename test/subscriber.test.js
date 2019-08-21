import chai, { expect } from 'chai';
import spies from 'chai-spies';

import echo, { Echo, constants } from '../src';
import { STATUS } from '../src/constants/ws-constants';
import { url, privateKey, accountId, contractId } from './_test-data';

import { rejects, ok } from 'assert';

chai.use(spies);

describe('SUBSCRIBER', () => {
	describe('subscriptions', async () => {
		it('Error', async () => {
			const echo = new Echo();
			await echo.connect(url);
			const options = {
				fee: {
					asset_id: '1.3.0'
				},
				registrar: accountId,
				value: {
					asset_id: '1.3.0',
					amount: 0
				},
				code: '86be3f80' + '0000000000000000000000000000000000000000000000000000000000000001',
				callee: contractId
			};

			const tx = await echo.createTransaction();
			await tx.addOperation(constants.OPERATIONS_IDS.CALL_CONTRACT, options);
			await tx.addSigner(privateKey);
			await tx.broadcast();

			await new Promise((resolve) => setTimeout(() => resolve(), 0));
			await echo.subscriber.cache.contractHistoryByContractId.get(contractId);
			await echo.disconnect();
			await new Promise((resolve) => setTimeout(() => resolve(), 0/*3e3*/));
		}).timeout(20000);
	});

	describe('subscriptions', () => {

		let isResolved = false;
		const onConnected = () => { isResolved = true; };
		let checkOnDisconnected = false;
		const onDisconnected = () => { checkOnDisconnected = true; };

		describe('when invalid status provided', () => {
			it('should rejects', async () => {
				await rejects(async () => {
					await echo.subscriber.setStatusSubscribe('conn', () => onConnected());
				}, new Error('Invalid status'));
				ok(isResolved === false);
			});
		});

		describe('when valid status provided', () => {
			it('should not rejects', async () => {
				await echo.subscriber.setStatusSubscribe('connect', () => onConnected());
				await echo.subscriber.setStatusSubscribe('disconnect', () => onDisconnected());
				ok(isResolved === false);
				ok(checkOnDisconnected === false);
			});
		});

		describe('success, subscription should emits on connect', () => {
			it('should emits on connect', async () => {
				ok(isResolved === false);
				ok(checkOnDisconnected === false);
				await echo.connect(url);
				ok(isResolved === true);
				ok(checkOnDisconnected === false);
			});
		});

		describe('success, subscription should emits on reconnect', () => {
			it('should emits on reconnect', async () => {
				let checkConnectCb = false;
				const onReconnected = () => { checkConnectCb = true; };
				await echo.subscriber.setStatusSubscribe('connect', () => onReconnected());
				ok(checkConnectCb === false);
				await echo.reconnect();
				ok(checkConnectCb === false);
				ok(checkOnDisconnected === false);
			});
		});

		describe('success, subscription should emits on disconnect', () => {
			it('should emits on disconnect', async () => {
				ok(checkOnDisconnected === false);
				await echo.disconnect();
				ok(checkOnDisconnected === true);
			});
		});

		describe('success, subscription should emits on connect after disconnect', () => {
			it('should emits on connect after disconnect', async () => {
				isResolved = false;
				await echo.subscriber.setStatusSubscribe('connect', () => onConnected());
				ok(isResolved === false);
				await echo.connect(url);
				ok(isResolved === true);
				await echo.disconnect();
			});
		});
	});

	let echo = new Echo();

	describe('echorand', () => {
        describe('setEchorandSubscribe', () => {
            it('is not a function', async () => {
                try {
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
                }, ['1.2.1']).then(() => echo.reconnect()).then(() => {
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
                }, ['1.2.16']);
            }).timeout(300 * 1000);

        });

        describe('removeAccountSubscribe', () => {
            it('test', async () => {
                const callback = () => {};
                await echo.subscriber.setAccountSubscribe(callback, ['1.2.1']);
                echo.subscriber.removeAccountSubscribe(callback);
            });
        });
	});

    describe('global', () => {
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

	describe('setMarketSubscribe', () => {
		it('invalid asset', async () => {
			try {
				await echo.subscriber.setMarketSubscribe(1, 2, () => {});
			} catch (err) {
				expect(err.message).to.equal('Invalid asset ID');
			}
		});

		it('test', async () => {
			await echo.subscriber.setMarketSubscribe('1.3.0', '1.3.1', () => {});
			expect(echo.subscriber.subscribers.market['1.3.0_1.3.1'].length).to.equal(1);
		});
	});

	describe('removeMarketSubscribe', () => {

		it('invalid asset',  async () => {
			try {
				const callback = () => {};
				await echo.subscriber.setMarketSubscribe('1.3.0', '1.3.1', callback);
				await echo.subscriber.removeMarketSubscribe(1, 2, callback);
			} catch (err) {
				expect(err.message).to.equal('Invalid asset ID');
			}
		});

		it('not such subscription', async () => {
			const callback = () => {};
			await echo.subscriber.setMarketSubscribe('1.3.0', '1.3.1', callback);

			const { length } = echo.subscriber.subscribers.market['1.3.0_1.3.1'];
			await echo.subscriber.removeMarketSubscribe('1.3.0', '1.3.2', callback);
			expect(echo.subscriber.subscribers.market['1.3.0_1.3.1'].length).to.equal(length);
		});

		it('test', async () => {
			const callback = () => {};
			await echo.subscriber.setMarketSubscribe('1.3.0', '1.3.1', callback);

			const { length } = echo.subscriber.subscribers.market['1.3.0_1.3.1'];
			await echo.subscriber.removeMarketSubscribe('1.3.0', '1.3.1', callback);
			expect(echo.subscriber.subscribers.market['1.3.0_1.3.1'].length).to.equal(length - 1);
		});
	});

    describe('setContractSubscribe', () => {
        it('test', async () => {
            await echo.subscriber.setContractSubscribe(['1.14.23'], () => {});
            expect(echo.subscriber.subscribers.contract.length).to.equal(1);
        });
    });

    describe('removeContractSubscribe', () => {
        it('test', async () => {
            const callback = () => {};
            await echo.subscriber.setContractSubscribe(['1.14.23'], callback);

            const { length } = echo.subscriber.subscribers.contract;
            await echo.subscriber.removeContractSubscribe(callback);
            expect(echo.subscriber.subscribers.contract.length).to.equal(length - 1);
        });
    });

	describe('setContractLogsSubscribe', () => {
		it('test', async () => {
			await echo.subscriber.setContractLogsSubscribe('1.14.0', () => {});
			expect(echo.subscriber.subscribers.logs['1.14.0'].length).to.equal(1);
		});
	});

	describe('removeContractLogsSubscribe', () => {
		it('test', async () => {
			const callback = () => {};
			await echo.subscriber.setContractLogsSubscribe('1.14.0', callback);

			const { length } = echo.subscriber.subscribers.logs['1.14.0'];
			await echo.subscriber.removeContractLogsSubscribe('1.14.0', callback);
			expect(echo.subscriber.subscribers.logs['1.14.0'].length).to.equal(length - 1);
		});
	});

	after(async () => {
		await echo.disconnect();
	});
});
