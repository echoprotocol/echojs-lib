import { expect } from 'chai';

import { Echo } from '../index';

describe('SUBSCRIBER', () => {
	let echo = new Echo();

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

	describe('echorand', () => {
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

            it('reconnect', (done) => {
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
                }, ['1.2.1']);
            }).timeout(30 * 1000);

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


	after(async () => {
		await echo.disconnect();
	});
});
