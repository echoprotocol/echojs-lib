
import 'mocha';
import { expect } from 'chai';

import WS from '../src/echo/ws'
import WSAPI from '../src/echo/ws-api'
import Cache from '../src/echo/cache'
import API from '../src/echo/api'
import { constants } from '../src/index';
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

        it('should use specified options', () => {
            try {
                const randomOptions = {
                    isUsed: Math.round(Math.random()) ? Math.round(Math.random()) ? true : false : undefined,
                    expirationTime: Math.round(Math.random()) ? Math.round(Math.random() * 60) * 60 * 1000 : undefined,
                    minCleaningTime: Math.round(Math.random()) ? Math.round(Math.random() * 60) * 60 * 1000 : undefined
                }

                const cache = new Cache(randomOptions);

                const { isUsed, expirationTime, minCleaningTime } = cache;

                expect(isUsed).to.be.equal(randomOptions.isUsed === undefined ? USE_CACHE_BY_DEFAULT : randomOptions.isUsed);
                expect(expirationTime).to.be.equal(randomOptions.expirationTime === undefined ? DEFAULT_CACHE_EXPIRATION_TIME : randomOptions.expirationTime);
                expect(minCleaningTime).to.be.equal(randomOptions.minCleaningTime === undefined ? DEFAULT_MIN_CACHE_CLEANING_TIME : randomOptions.minCleaningTime);   
            } catch (e) {
                throw e;
            }
        });

    });

    describe('cleaning', () => {
        const ws = new WS();

        const blocksRounds = [250, 300, 350, 400, 450];

        const options = {
            apis: [
                constants.WS_CONSTANTS.DATABASE_API
            ]
        };

        let cacheOptions = {
            isUsed: false,
            expirationTime: null,
            minCleaningTime: null,
        };
        
        beforeEach(async () => {
            await ws.connect(url, options);
        });

        afterEach(async () => {
            await ws.close();
        });

        it('clean only expired blocks', async () => {
            try {
				const wsApi = new WSAPI(ws);
				const cache = new Cache(cacheOptions);
                const api = new API(cache, wsApi);

                const promises = [];

                const expiredFromIndex = 3;
                const currentTime = Date.now();
                const notExpiredRoundsTime = currentTime + 5 * 60 * 1000;

                blocksRounds.forEach((round, roundIndex) => {
                    promises.push(new Promise((res, rej) => {
                        api.getBlock(round)
                        .then((block) => {
                            cache.expirations.push({ time: roundIndex >= expiredFromIndex ? notExpiredRoundsTime : currentTime, map: CACHE_MAPS.BLOCKS, key: block.round });
                            cache[CACHE_MAPS.BLOCKS] = cache[CACHE_MAPS.BLOCKS].set(block.round, block);
                            res(block.round);
                        }).catch((err) => {
                            rej(err);
                        });
                    }));
                });

                await Promise.all(promises);

                cache.isUsed = true;
                cache._removeExpired();

                blocksRounds.forEach((round, roundIndex) => {
                    const expiretionIndex = cache.expirations.findIndex((expiration) => {
                        return expiration.key === round
                    });
                    
                    expect(expiretionIndex).to.be.equal(roundIndex >= expiredFromIndex ? roundIndex - expiredFromIndex : -1);
                    expect(cache.blocks.has(round)).to.be.equal(roundIndex >= expiredFromIndex ? true : false);
                });
            } catch (e) {
                throw e;
            }
        });

        it('clean several blocks at once', async () => {
            try {
                cacheOptions = {
                    ...cacheOptions,
                    isUsed: false
                }

				const wsApi = new WSAPI(ws);
                const cache = new Cache(cacheOptions);
                const api = new API(cache, wsApi);

                const promises = [];

                blocksRounds.forEach((round) => {
                    promises.push(new Promise((res, rej) => {
                        api.getBlock(round)
                        .then((block) => {
                            cache.expirations.push({ time: Date.now(), map: CACHE_MAPS.BLOCKS, key: block.round });
                            cache[CACHE_MAPS.BLOCKS] = cache[CACHE_MAPS.BLOCKS].set(block.round, block);
                            res(block.round);
                        }).catch((err) => {
                            rej(err);
                        });
                    }));
                });

                await Promise.all(promises);

                cache.isUsed = true;
                cache._removeExpired();

                expect(cache.expirations.length).to.be.equal(0);
                expect(cache.blocks.size).to.be.equal(0);
            } catch (e) {
                throw e;
            }
        });

        it('cleaning does not happen more often then "minCleaningTime"', async () => {         
            try {
                cacheOptions = {
                    ...cacheOptions,
                    isUsed: false,
                    minCleaningTime: 1000
                };
    
                const wsApi = new WSAPI(ws);
                const cache = new Cache(cacheOptions);
                const api = new API(cache, wsApi);
    
                const promises = [];
                const expirationTime = 100;
                const tickInterval = 50;
    
                const tick = (res, callCount = 0, pastCacheSize = cache.blocks.size) => {
                    const currentCacheSize = cache.blocks.size;
    
                    if (pastCacheSize !== currentCacheSize) {
                        expect(callCount * tickInterval).to.be.equal(cacheOptions.minCleaningTime);
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
                        api.getBlock(round)
                        .then((block) => {
                            cache.expirations.push({ time: Date.now() + roundIndex * expirationTime, map: CACHE_MAPS.BLOCKS, key: block.round });
                            cache[CACHE_MAPS.BLOCKS] = cache[CACHE_MAPS.BLOCKS].set(block.round, block);
                            res(block.round);
                        }).catch((err) => {
                            rej(err);
                        });
                    }));
                });
    
                await Promise.all(promises);
    
                cache.isUsed = true;
                cache._removeExpired();
    
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
        }).timeout(5000);

        it('when isUsed = false, cache is always empty', async () => {
            try {
                cacheOptions = {
                    ...cacheOptions,
                    isUsed: false
                };
    
                const wsApi = new WSAPI(ws);
                const cache = new Cache(cacheOptions);
                const api = new API(cache, wsApi);

                const promises = [];

                blocksRounds.forEach((round) => {
                    promises.push(new Promise((res, rej) => {
                        api.getBlock(round)
                        .then((block) => {
                            res(block.round);
                        }).catch((err) => {
                            rej(err);
                        });
                    }));
                });

                await Promise.all(promises);

                expect(cache.expirations.length).to.be.equal(0);
                expect(cache.blocks.size).to.be.equal(0);
            } catch (e) {
                throw e;
            }
        });

        it('when expirationTime = null, cache is used but never cleared', async () => {
            cacheOptions = {
                ...cacheOptions,
                isUsed: true
            };

            const wsApi = new WSAPI(ws);
            const cache = new Cache(cacheOptions);
            const api = new API(cache, wsApi);

            const promises = [];

            blocksRounds.forEach((round) => {
                promises.push(new Promise((res, rej) => {
                    api.getBlock(round)
                    .then((block) => {
                        res(block.round);
                    }).catch((err) => {
                        rej(err);
                    });
                }));
            });

            await Promise.all(promises);

            expect(cache.blocks.size).to.not.equal(0);
        });
    });
});
