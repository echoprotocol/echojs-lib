import 'mocha';
import { expect } from 'chai';

import echo, { constants, Echo } from '../src/index';
import {
	USE_CACHE_BY_DEFAULT,
	DEFAULT_CACHE_EXPIRATION_TIME,
	DEFAULT_MIN_CACHE_CLEANING_TIME,
	CACHE_MAPS,
} from '../src/constants';

import { url } from './_test-data';

describe('cache', () => {
	describe('options', () => {
		describe('when cache option has not been specified', () => {
			before(async () => echo.connect(url, {}));
			after(async () => echo.disconnect());
			it('should use default options', () => {
				const { isUsed, expirationTime, minCleaningTime } = echo.cache;

				expect(isUsed).to.be.equal(USE_CACHE_BY_DEFAULT);
				expect(expirationTime).to.be.equal(DEFAULT_CACHE_EXPIRATION_TIME);
				expect(minCleaningTime).to.be.equal(DEFAULT_MIN_CACHE_CLEANING_TIME);
			});
		});

		describe('when empty object was specified as cache options', () => {
			before(async () => echo.connect(url, { cache: {} }));
			after(async () => echo.disconnect());
			it('should use default options', () => {
				const { isUsed, expirationTime, minCleaningTime } = echo.cache;

				expect(isUsed).to.be.equal(USE_CACHE_BY_DEFAULT);
				expect(expirationTime).to.be.equal(DEFAULT_CACHE_EXPIRATION_TIME);
				expect(minCleaningTime).to.be.equal(DEFAULT_MIN_CACHE_CLEANING_TIME);
			});
		});

		describe('when null was specified as cache option', () => {
			before(async () => echo.connect(url, { cache: null }));
			after(async () => echo.disconnect());
			it('cache should not be used', () => {
				const { isUsed } = echo.cache;

				expect(isUsed).to.equal(false);
			});
		});

		describe('when used specified options', () => {
			const cache = { isUsed: false, expirationTime: 322, minCleaningTime: 777 };
			before(async () => echo.connect(url, { cache }));
			after(async () => echo.disconnect());
			it('should use specified options', () => {
				const { isUsed, expirationTime, minCleaningTime } = echo.cache;

				expect(isUsed).to.be.equal(cache.isUsed);
				expect(expirationTime).to.be.equal(cache.expirationTime);
				expect(minCleaningTime).to.be.equal(cache.minCleaningTime);
			});
		});
	});

	describe('cleaning', () => {
		const blocksRounds = [1, 2, 3, 4, 5];
		/** @type {import("../types").Echo} */
		const newEcho = new Echo();
		before(async function () {
			this.timeout(25e3);
			await newEcho.connect(url);
			const blockToWait = Math.max(...blocksRounds) + 1;
			while (true) {
				// eslint-disable-next-line no-await-in-loop
				const globalProperties = await newEcho.api.getDynamicGlobalProperties(true);
				const headBlockNumber = globalProperties.head_block_number;
				if (headBlockNumber >= blockToWait) break;
				console.log(`waiting for block #${blockToWait}. current head block number - ${headBlockNumber}`);
				// eslint-disable-next-line no-await-in-loop
				await new Promise((resolve) => setTimeout(() => resolve(), 3e3));
			}
			await newEcho.disconnect();
		});

		afterEach(async () => newEcho.disconnect());

		describe('clean only expired blocks', () => {
			before(async () => {
				await newEcho.connect(url, {
					apis: [
						constants.WS_CONSTANTS.CHAIN_API.DATABASE_API,
					],
					cache: {
						isUsed: false,
						expirationTime: null,
						minCleaningTime: null,
					},
				});
			});

			it('should clean expired blocks', async () => {
				try {
					const promises = [];

					const expiredFromIndex = 3;
					const currentTime = Date.now();
					const notExpiredRoundsTime = currentTime + (5 * 60 * 1000);

					blocksRounds.forEach((round, roundIndex) => {
						promises.push(new Promise((res, rej) => {
							newEcho.api.getBlock(round)
								.then((block) => {
									newEcho.cache.expirations.push({
										time: roundIndex >= expiredFromIndex ? notExpiredRoundsTime : currentTime,
										map: CACHE_MAPS.BLOCKS,
										key: block.round,
									});
									newEcho.cache[CACHE_MAPS.BLOCKS] = newEcho.cache[CACHE_MAPS.BLOCKS]
										.set(block.round, block);
									res(block.round);
								}).catch((err) => {
									rej(err);
								});
						}));
					});

					await Promise.all(promises);

					newEcho.cache.isUsed = true;
					newEcho.cache._removeExpired();

					blocksRounds.forEach((round, roundIndex) => {
						const expiretionIndex = newEcho.cache.expirations
							.findIndex((expiration) => expiration.key === round);
						expect(expiretionIndex).to.be
							.equal(roundIndex >= expiredFromIndex ? roundIndex - expiredFromIndex : -1);
						expect(newEcho.cache.blocks.has(round)).to.be.equal(roundIndex >= expiredFromIndex);
					});
				} catch (e) {
					throw e;
				}
			});
		});

		describe('clean several blocks at once', () => {
			before(async () => {
				await newEcho.connect(url, {
					apis: [
						constants.WS_CONSTANTS.CHAIN_API.DATABASE_API,
					],
					cache: {
						isUsed: false,
						expirationTime: null,
						minCleaningTime: null,
					},
				});
			});

			it('should clean several blocks at once', async () => {
				try {
					const promises = [];

					blocksRounds.forEach((round) => {
						promises.push(new Promise((res, rej) => {
							newEcho.api.getBlock(round)
								.then((block) => {
									newEcho.cache.expirations.push({
										time: Date.now(),
										map: CACHE_MAPS.BLOCKS,
										key: block.round,
									});
									newEcho.cache[CACHE_MAPS.BLOCKS] = newEcho.cache[CACHE_MAPS.BLOCKS]
										.set(block.round, block);
									res(block.round);
								}).catch((err) => {
									rej(err);
								});
						}));
					});

					await Promise.all(promises);

					newEcho.cache.isUsed = true;
					newEcho.cache._removeExpired();

					expect(newEcho.cache.expirations.length).to.be.equal(0);
					expect(newEcho.cache.blocks.size).to.be.equal(0);
				} catch (e) {
					throw e;
				}
			});
		});

		describe('cleaning does not happen more often then "minCleaningTime"', () => {
			before(async () => {
				await newEcho.connect(url, {
					apis: [
						constants.WS_CONSTANTS.CHAIN_API.DATABASE_API,
					],
					cache: {
						isUsed: false,
						expirationTime: null,
						minCleaningTime: 1000,
					},
				});
			});

			it('should not clean more often then minCleaningTime', async () => {
				try {
					const promises = [];
					const expirationTime = 100;
					const tickInterval = 50;

					const tick = (res, callCount = 0, pastCacheSize = newEcho.cache.blocks.size) => {
						const currentCacheSize = newEcho.cache.blocks.size;

						if (pastCacheSize !== currentCacheSize) {
							expect(callCount * tickInterval).to.be.equal(newEcho.cache.minCleaningTime);
							res();
						} else if (currentCacheSize !== 0) {
							setTimeout(() => {
								tick(res, callCount + 1, currentCacheSize);
							}, tickInterval);
						}
					};

					blocksRounds.forEach((round, roundIndex) => {
						promises.push(new Promise((res, rej) => {
							newEcho.api.getBlock(round)
								.then((block) => {
									newEcho.cache.expirations.push({
										time: Date.now() + (roundIndex * expirationTime),
										map: CACHE_MAPS.BLOCKS,
										key: block.round,
									});
									newEcho.cache[CACHE_MAPS.BLOCKS] = newEcho.cache[CACHE_MAPS.BLOCKS]
										.set(block.round, block);
									res(block.round);
								}).catch((err) => {
									rej(err);
								});
						}));
					});

					await Promise.all(promises);

					newEcho.cache.isUsed = true;
					newEcho.cache._removeExpired();

					await new Promise((res, rej) => {
						try {
							tick(res);
						} catch (err) {
							rej(err);
						}
					});

				} catch (e) {
					throw (e);
				}
			});
		}).timeout(5000);

		describe('when isUsed = false, cache is always empty', () => {
			before(async () => {
				await newEcho.connect(url, {
					apis: [
						constants.WS_CONSTANTS.CHAIN_API.DATABASE_API,
					],
					cache: {
						isUsed: false,
						expirationTime: null,
						minCleaningTime: 1000,
					},
				});
			});

			it('cache should be empty', async () => {
				try {
					const promises = [];

					blocksRounds.forEach((round) => {
						promises.push(new Promise((res, rej) => {
							newEcho.api.getBlock(round)
								.then((block) => {
									res(block.round);
								}).catch((err) => {
									rej(err);
								});
						}));
					});

					await Promise.all(promises);

					expect(newEcho.cache.expirations.length).to.be.equal(0);
					expect(newEcho.cache.blocks.size).to.be.equal(0);
				} catch (e) {
					throw e;
				}
			});
		});

		describe('when expirationTime = null, cache is used but never cleared', async () => {
			before(async () => {
				await newEcho.connect(url, {
					apis: [
						constants.WS_CONSTANTS.CHAIN_API.DATABASE_API,
					],
					cache: {
						isUsed: true,
						expirationTime: null,
						minCleaningTime: 1000,
					},
				});
			});

			it('chache should not be cleared', async () => {
				try {
					const promises = [];

					blocksRounds.forEach((round) => {
						promises.push(new Promise((res, rej) => {
							newEcho.api.getBlock(round)
								.then((block) => {
									res(block.round);
								}).catch((err) => {
									rej(err);
								});
						}));
					});

					await Promise.all(promises);

					expect(newEcho.cache.blocks.size).to.be.equal(blocksRounds.length);
					expect(newEcho.cache.timeout).to.equal(null);
				} catch (e) {
					throw e;
				}
			});
		});
	});
});
