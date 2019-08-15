
import 'mocha';
import { expect } from 'chai';

import WS from '../src/echo/ws'
import WSAPI from '../src/echo/ws-api'
import Cache from '../src/echo/cache'
import API from '../src/echo/api'
import echo, { constants } from '../src/index';
import { USE_CACHE_BY_DEFAULT, DEFAULT_CACHE_EXPIRATION_TIME, DEFAULT_MIN_CACHE_CLEANING_TIME, CACHE_MAPS } from '../src/constants';

import { url } from './_test-data';

describe('cache', () => {
    describe('options', () => {
        it('should use default options if cache option has not been specified', () => {
            try {
                const cache = new Cache(undefined);

                const { isUsed, expirationTime, minCleaningTime } = cache;

                expect(isUsed).to.be.equal(USE_CACHE_BY_DEFAULT);
                expect(expirationTime).to.be.equal(DEFAULT_CACHE_EXPIRATION_TIME);
                expect(minCleaningTime).to.be.equal(DEFAULT_MIN_CACHE_CLEANING_TIME);
            } catch (e) {
                throw e;
            };
        });

        it('should use default options if empty object was specified', () => {
            try {
                const cache = new Cache({});

                const { isUsed, expirationTime, minCleaningTime } = cache;

                expect(isUsed).to.be.equal(USE_CACHE_BY_DEFAULT);
                expect(expirationTime).to.be.equal(DEFAULT_CACHE_EXPIRATION_TIME);
                expect(minCleaningTime).to.be.equal(DEFAULT_MIN_CACHE_CLEANING_TIME);     
            } catch (e) {
                throw e;
            }
        });

        it('should not use the cache if null was specified in the relevant option', () => {
            try {
                const cache = new Cache(null);

                const { isUsed } = cache;

                expect(isUsed).to.be.false;
            } catch (e) {
                throw e;
            }
        });

        it('should use default options if its were not defined', () => {
            try {
                const options = {
                    isUsed: undefined,
                    expirationTime: undefined,
                    minCleaningTime: undefined
                }

                const cache = new Cache(options);

                const { isUsed, expirationTime, minCleaningTime } = cache;

                expect(isUsed).to.be.equal(USE_CACHE_BY_DEFAULT);
                expect(expirationTime).to.be.equal(DEFAULT_CACHE_EXPIRATION_TIME);
                expect(minCleaningTime).to.be.equal(DEFAULT_MIN_CACHE_CLEANING_TIME);   
            } catch (e) {
                throw e;
            }
        });

        it('should use specified options', () => {
            try {
                const options = {
                    isUsed: false,
                    expirationTime: 322,
                    minCleaningTime: 777
                }

                const cache = new Cache(options);

                const { isUsed, expirationTime, minCleaningTime } = cache;

                expect(isUsed).to.be.equal(options.isUsed);
                expect(expirationTime).to.be.equal(options.expirationTime);
                expect(minCleaningTime).to.be.equal(options.minCleaningTime);   
            } catch (e) {
                throw e;
            }
        });
    });

    describe('cleaning', () => {
        const blocksRounds = [1, 2, 3, 4, 5];

        afterEach(async () => {
            await echo.disconnect();
        });

        describe('clean only expired blocks', () => {
            before(async () => {
                await echo.connect(url, {
                    apis: [
                        constants.WS_CONSTANTS.DATABASE_API
                    ],
                    cache: {
                        isUsed: false,
                        expirationTime: null,
                        minCleaningTime: null,
                    }
                });
            });

            it('should clean expired blocks', async () => {
                try {
                    const promises = [];

                    const expiredFromIndex = 3;
                    const currentTime = Date.now();
                    const notExpiredRoundsTime = currentTime + 5 * 60 * 1000;

                    blocksRounds.forEach((round, roundIndex) => {
                        promises.push(new Promise((res, rej) => {
                            echo.api.getBlock(round)
                            .then((block) => {
                                echo.cache.expirations.push({ time: roundIndex >= expiredFromIndex ? notExpiredRoundsTime : currentTime, map: CACHE_MAPS.BLOCKS, key: block.round });
                                echo.cache[CACHE_MAPS.BLOCKS] = echo.cache[CACHE_MAPS.BLOCKS].set(block.round, block);
                                res(block.round);
                            }).catch((err) => {
                                rej(err);
                            });
                        }));
                    });

                    await Promise.all(promises);

                    echo.cache.isUsed = true;
                    echo.cache._removeExpired();

                    blocksRounds.forEach((round, roundIndex) => {
                        const expiretionIndex = echo.cache.expirations.findIndex((expiration) => {
                            return expiration.key === round
                        });

                        expect(expiretionIndex).to.be.equal(roundIndex >= expiredFromIndex ? roundIndex - expiredFromIndex : -1);
                        expect(echo.cache.blocks.has(round)).to.be.equal(roundIndex >= expiredFromIndex ? true : false);
                    });
                } catch (e) {
                    throw e;
                }
            })
        });

        describe('clean several blocks at once', () => {
            before(async () => {
                await echo.connect(url, {
                    apis: [
                        constants.WS_CONSTANTS.DATABASE_API
                    ],
                    cache: {
                        isUsed: false,
                        expirationTime: null,
                        minCleaningTime: null,
                    }
                });
            });

            it('should clean several blocks at once', async () => {
                try {
                    const promises = [];

                    blocksRounds.forEach((round) => {
                        promises.push(new Promise((res, rej) => {
                            echo.api.getBlock(round)
                            .then((block) => {
                                echo.cache.expirations.push({ time: Date.now(), map: CACHE_MAPS.BLOCKS, key: block.round });
                                echo.cache[CACHE_MAPS.BLOCKS] = echo.cache[CACHE_MAPS.BLOCKS].set(block.round, block);
                                res(block.round);
                            }).catch((err) => {
                                rej(err);
                            });
                        }));
                    });

                    await Promise.all(promises);

                    echo.cache.isUsed = true;
                    echo.cache._removeExpired();

                    expect(echo.cache.expirations.length).to.be.equal(0);
                    expect(echo.cache.blocks.size).to.be.equal(0);
                } catch (e) {
                    throw e;
                }
            });
        });

        describe('cleaning does not happen more often then "minCleaningTime"', () => {
            before(async () => {
                await echo.connect(url, {
                    apis: [
                        constants.WS_CONSTANTS.DATABASE_API
                    ],
                    cache: {
                        isUsed: false,
                        expirationTime: null,
                        minCleaningTime: 1000,
                    }
                });
            });

            it('should not clean more often then minCleaningTime', async () => {
                try {
                    const promises = [];
                    const expirationTime = 100;
                    const tickInterval = 50;

                    const tick = (res, callCount = 0, pastCacheSize = echo.cache.blocks.size) => {
                        const currentCacheSize = echo.cache.blocks.size;

                        if (pastCacheSize !== currentCacheSize) {
                            expect(callCount * tickInterval).to.be.equal(echo.cache.minCleaningTime);
                            res();
                        } else {
                            if (currentCacheSize !== 0) {
                                setTimeout(() => {
                                    tick(res, callCount + 1, currentCacheSize);
                                }, tickInterval);
                            }
                        }
                    };

                    blocksRounds.forEach((round, roundIndex) => {
                        promises.push(new Promise((res, rej) => {
                            echo.api.getBlock(round)
                            .then((block) => {
                                echo.cache.expirations.push({ time: Date.now() + roundIndex * expirationTime, map: CACHE_MAPS.BLOCKS, key: block.round });
                                echo.cache[CACHE_MAPS.BLOCKS] = echo.cache[CACHE_MAPS.BLOCKS].set(block.round, block);
                                res(block.round);
                            }).catch((err) => {
                                rej(err);
                            });
                        }));
                    });

                    await Promise.all(promises);

                    echo.cache.isUsed = true;
                    echo.cache._removeExpired();
                    
                    await new Promise((res, rej) => {
                        try {
                            tick(res);                        
                        } catch (err) {
                            rej(err);
                        }
                    });

                } catch (e) {
                    throw(e);
                }
            })
        }).timeout(5000);

        describe('when isUsed = false, cache is always empty', () => {
            before(async () => {
                await echo.connect(url, {
                    apis: [
                        constants.WS_CONSTANTS.DATABASE_API
                    ],
                    cache: {
                        isUsed: false,
                        expirationTime: null,
                        minCleaningTime: 1000,
                    }
                });
            });

            it('cache should be empty', async () => {
                try {
                    const promises = [];

                    blocksRounds.forEach((round) => {
                        promises.push(new Promise((res, rej) => {
                            echo.api.getBlock(round)
                            .then((block) => {
                                res(block.round);
                            }).catch((err) => {
                                rej(err);
                            });
                        }));
                    });

                    await Promise.all(promises);

                    expect(echo.cache.expirations.length).to.be.equal(0);
                    expect(echo.cache.blocks.size).to.be.equal(0);
                } catch (e) {
                    throw e;
                }
            })
        });

        describe('when expirationTime = null, cache is used but never cleared', async () => {
            before(async () => {
                await echo.connect(url, {
                    apis: [
                        constants.WS_CONSTANTS.DATABASE_API
                    ],
                    cache: {
                        isUsed: true,
                        expirationTime: null,
                        minCleaningTime: 1000,
                    }
                });
            });

            it('chache should not be cleared', async () => {
                try {
                    const promises = [];

                    blocksRounds.forEach((round) => {
                        promises.push(new Promise((res, rej) => {
                            echo.api.getBlock(round)
                            .then((block) => {
                                res(block.round);
                            }).catch((err) => {
                                rej(err);
                            });
                        }));
                    });

                    await Promise.all(promises);
    
                    expect(echo.cache.blocks.size).to.not.equal(0);
                    expect(echo.cache.timeout).to.be.null;
                } catch (e) {
                    throw e;
                }
            });
        });
    });
});