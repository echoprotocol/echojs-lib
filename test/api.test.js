import { expect } from 'chai';
import Cache from '../src/echo/cache';
import API from '../src/echo/api';

import echo, { constants } from '../src';
import { DEFAULT_CHAIN_APIS, CHAIN_API } from '../src/constants/ws-constants';

import { url, accountId } from './_test-data';
import { deepStrictEqual } from 'assert';
import { shouldReject } from './_test-utils';
import { WsProvider } from '../src/echo/providers';
import EchoApiEngine from '../src/echo/engine';

describe('API', () => {
	describe('API CONNECTION', () => {
		describe('when apis are provided', () => {
			const apis = [CHAIN_API.DATABASE_API, CHAIN_API.ASSET_API];
			before(async () => await echo.connect(url, { apis }));
			after(async () => await echo.disconnect());
			it('only provided apis should be connected', () => deepStrictEqual(echo.apis, new Set(apis)));
			describe('when provided api used', () => {
				it('should succeed', async () => await echo.api.getBlock(1));
			});
			describe('when not provided api used', () => {
				const expectedErrorMessage = [
					'history API is not available',
					'try to specify this in connection option called "apis"',
				].join(', ');
				shouldReject(async () => {
					await echo.api.getAccountHistory('1.2.1');
				}, expectedErrorMessage, 'with expected message');
			});
		});

		describe('when apis options is not provided', () => {
			before(async () => await echo.connect(url, {}));
			after(async () => await echo.disconnect());
			it('only default apis should be connected', () => deepStrictEqual(echo.apis, new Set(DEFAULT_CHAIN_APIS)));
			describe('when deafult api used', () => {
				it('should succed', async () => await echo.api.getBlock(1));
			});
			describe('when not default api used', () => {
				const expectedErrorMessage = [
					'asset API is not available',
					'try to specify this in connection option called "apis"',
				].join(', ');
				shouldReject(async () => {
					await echo.api.getAllAssetHolders();
				}, expectedErrorMessage, 'with expected message');
			});
		});

		describe('when used nonexistent api', () => {
			const expectedErrorMessage = 'Parameter apis is invalid';
			shouldReject(async () => {
				await echo.connect(url, { apis: ['nonexistent'] });
			}, expectedErrorMessage);
		});

		describe('when reconnected', () => {
			const apis = [...DEFAULT_CHAIN_APIS.slice(1), CHAIN_API.ASSET_API];
			before(async () => {
				await echo.connect(url, { apis });
				await echo.reconnect();
			});
			after(async () => await echo.disconnect());
			it('only provided apis should be connected', () => deepStrictEqual(echo.apis, new Set(apis)));
			describe('when provided api used', () => {
				it('should succeed', async () => await echo.api.getAllAssetHolders());
			});
			describe('when provided api used', () => {
				it('should succeed', async () => await echo.api.getAccountHistory(accountId));
			});
			describe('when not nonprovided api used', () => {
				const expectedErrorMessage = [
					'database API is not available',
					'try to specify this in connection option called "apis"',
				].join(', ');
				shouldReject(async () => {
					await echo.api.getBlock(1)
				}, expectedErrorMessage, 'with expected message');
			});
		});
	});

	describe('ASSET API', () => {
		before(async () => {
			await echo.connect(url, {
				connectionTimeout: 5000,
				maxRetries: 5,
				pingTimeout: 3000,
				pingDelay: 10000,
				debug: false,
				apis: constants.WS_CONSTANTS.CHAIN_APIS,
			});
		});

		describe('- get asset holders (start = 0, limit = 1)', () => {
			it('test', async () => {
				const result = await echo.api.getAssetHolders(constants.CORE_ASSET_ID, 0, 1);

				expect(result)
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[0])
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result[0].name)
					.to
					.be
					.a('string');
				expect(result[0].account_id)
					.to
					.be
					.a('string');
				// TODO: amount can be string
				// expect(result[0].amount)
				// 	.to
				// 	.be
				// 	.a('number');
			});
		});

		describe('- get asset holders count', () => {
			it('test', async () => {
				const result = await echo.api.getAssetHoldersCount(constants.CORE_ASSET_ID);

				expect(result)
					.to
					.be
					.a('number');
			});
		});

		describe('- get all asset holders', () => {
			it('test', async () => {
				const result = await echo.api.getAllAssetHolders();

				expect(result)
					.to
					.be
					.an('array').that.is.not.empty;
				expect(result[0])
					.to
					.be
					.an('object').that.is.not.empty;
				expect(result[0].asset_id)
					.to
					.be
					.a('string');
				expect(result[0].count)
					.to
					.be
					.a('number');
			});
		});

		after(() => {
			echo.disconnect();
		});

	});

	describe('database', () => {
		const wsProvider = new WsProvider();
		beforeEach(async () => {
			await wsProvider.connect(url, {
				debug: false,
				apis: constants.WS_CONSTANTS.CHAIN_APIS
			});
		});
		afterEach(async () => {
			await wsProvider.close();
		});

		describe('configs', () => {
			describe('#getChainProperties()', () => {
				it('should get chain properties', async () => {
					try {
						const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
						await engine.init();
						const cache = new Cache();
						const api = new API(cache, engine);

						const chainProperties = await api.getChainProperties();

						expect(chainProperties)
							.to
							.be
							.an('object');
						expect(chainProperties)
							.to
							.deep
							.equal(cache.chainProperties.toJS());
					} catch (e) {
						throw e;
					}
				})
					.timeout(5000);
			});
			describe('#getGlobalProperties()', () => {
				it('should get global properties', async () => {
					try {
						const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
						await engine.init();
						const cache = new Cache();
						const api = new API(cache, engine);

						const globalProperties = await api.getGlobalProperties();

						expect(globalProperties)
							.to
							.be
							.an('object');
						expect(globalProperties)
							.to
							.deep
							.equal(cache.globalProperties.toJS());
					} catch (e) {
						throw e;
					}
				})
					.timeout(5000);
			});
			describe('#getConfig()', () => {
				it('should get config properties', async () => {
					try {
						const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
						await engine.init();
						const cache = new Cache();
						const api = new API(cache, engine);

						const config = await api.getConfig();

						expect(config)
							.to
							.be
							.an('object');
						expect(config)
							.to
							.deep
							.equal(cache.config.toJS());
					} catch (e) {
						throw e;
					}
				})
					.timeout(5000);
			});
			describe('#getChainId()', () => {
				it('should get chain id', async () => {
					try {
						const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
						await engine.init();
						const cache = new Cache();
						const api = new API(cache, engine);

						const chainId = await api.getChainId();
						expect(chainId)
							.to
							.be
							.an('string');
					} catch (e) {
						throw e;
					}
				})
					.timeout(5000);
			});
			describe('#getDynamicGlobalProperties()', () => {
				it('should get dynamic global properties', async () => {
					try {
						const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
						await engine.init();
						const cache = new Cache();
						const api = new API(cache, engine);

						const dynamicGlobalProperties = await api.getDynamicGlobalProperties();

						expect(dynamicGlobalProperties)
							.to
							.be
							.an('object');
						expect(dynamicGlobalProperties)
							.to
							.deep
							.equal(cache.dynamicGlobalProperties.toJS());
					} catch (e) {
						throw e;
					}
				})
					.timeout(5000);
			});
		});

		describe('#getBlock()', () => {
			it('should get block and save it to cache', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);
					const blockNumber = 2;
					const block = await api.getBlock(blockNumber);

					expect(block)
						.to
						.deep
						.equal(cache.blocks.get(blockNumber)
							.toJS());
				} catch (e) {
					console.log(e);
					throw e;
				}
			}).timeout(5000);
		});
		describe.skip('#getTransaction()', () => {
			it('should get transaction and save it to cache', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);
					const blockNumber = 205378;
					const transactionIndex = 0;
					const transaction = await api.getTransaction(blockNumber, transactionIndex);

					expect(transaction)
						.to
						.deep
						.equal(cache.transactionsByBlockAndIndex.get(`${blockNumber}:${transactionIndex}`)
							.toJS());
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getAccounts()', () => {
			it('should get accounts and save it to cache', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);
					const accountId1 = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ACCOUNT}.5`;
					const accountId2 = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ACCOUNT}.6`;
					const accounts = await api.getAccounts([accountId1, accountId2]);

					expect(accounts)
						.to
						.be
						.an('array');

					expect(accounts[0])
						.to
						.deep
						.equal(cache.accountsById.get(accountId1)
							.toJS());
					expect(accounts[0])
						.to
						.deep
						.equal(cache.objectsById.get(accountId1)
							.toJS());
					expect(accounts[1])
						.to
						.deep
						.equal(cache.accountsById.get(accountId2)
							.toJS());
					expect(accounts[1])
						.to
						.deep
						.equal(cache.objectsById.get(accountId2)
							.toJS());
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getFullAccounts()', () => {
			it('should get accounts and save it to cache', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API, CHAIN_API.HISTORY_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);
					const accountId1 = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ACCOUNT}.5`;
					const accountId2 = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ACCOUNT}.6`;

					const accounts = await api.getFullAccounts([accountId1, accountId2]);

					expect(accounts)
						.to
						.be
						.an('array');

					expect(accounts[0])
						.to
						.deep
						.equal(cache.fullAccounts.get(accountId1)
							.toJS());
					expect(cache.accountsById.get(accountId1))
						.to
						.be
						.an('object');
					expect(cache.objectsById.get(accountId1))
						.to
						.be
						.an('object');

					expect(accounts[1])
						.to
						.deep
						.equal(cache.fullAccounts.get(accountId2)
							.toJS());
					expect(cache.accountsById.get(accountId2))
						.to
						.be
						.an('object');
					expect(cache.objectsById.get(accountId2))
						.to
						.be
						.an('object');
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getAccountCount()', () => {
			it('should get account count', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const accountCount = await api.getAccountCount();

					expect(accountCount)
						.to
						.be
						.an('number');
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#lookupAssetSymbols()', () => {
			it('should get asset by symbol and save it in multi caches', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const assetKey = 'ECHO';
					const assetId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ASSET}.0`;
					const assets = await api.lookupAssetSymbols([assetKey]);

					expect(assets)
						.to
						.be
						.an('array');

					expect(assets[0])
						.to
						.deep
						.equal(cache.assetByAssetId.get(assetId)
							.toJS());
					expect(assets[0])
						.to
						.deep
						.equal(cache.objectsById.get(assetId)
							.toJS());
					expect(assets[0])
						.to
						.deep
						.equal(cache.assetBySymbol.get(assetKey)
							.toJS());
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getAssets()', () => {
			it('should get assets by id and save it in multi caches', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const assetId1 = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ASSET}.0`;

					const assets = await api.getAssets([assetId1]);

					expect(assets)
						.to
						.be
						.an('array');
					expect(assets[0])
						.to
						.deep
						.equal(cache.assetByAssetId.get(assetId1)
							.toJS());
					expect(assets[0])
						.to
						.deep
						.equal(cache.objectsById.get(assetId1)
							.toJS());
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getObjects()', () => {
			it('should get objects by id and save it in multi caches', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const accountId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ACCOUNT}.2`;
					const assetId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ASSET}.0`;
					const assetSymbol = 'ECHO';

					const objects = await api.getObjects([accountId, assetId]);

					const accountName = objects[0].name;

					expect(objects)
						.to
						.be
						.an('array');

					expect(objects[0])
						.to
						.deep
						.equal(cache.accountsById.get(accountId)
							.toJS());
					expect(objects[0])
						.to
						.deep
						.equal(cache.objectsById.get(accountId)
							.toJS());
					expect(accountId)
						.to
						.equal(cache.accountsByName.get(accountName));
					expect(objects[1])
						.to
						.deep
						.equal(cache.objectsById.get(assetId)
							.toJS());
					expect(objects[1])
						.to
						.deep
						.equal(cache.assetByAssetId.get(assetId)
							.toJS());
					expect(objects[1])
						.to
						.deep
						.equal(cache.assetBySymbol.get(assetSymbol)
							.toJS());
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getObjects()', () => {
			it('should get objects by id and save it in multi caches', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const accountId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ACCOUNT}.2`;
					const assetId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ASSET}.0`;
					const assetSymbol = 'ECHO';

					const objects = await api.getObjects([accountId, assetId]);

					const accountName = objects[0].name;

					expect(objects)
						.to
						.be
						.an('array');

					expect(objects[0])
						.to
						.deep
						.equal(cache.accountsById.get(accountId)
							.toJS());
					expect(objects[0])
						.to
						.deep
						.equal(cache.objectsById.get(accountId)
							.toJS());
					expect(accountId)
						.to
						.equal(cache.accountsByName.get(accountName));
					expect(objects[1])
						.to
						.deep
						.equal(cache.objectsById.get(assetId)
							.toJS());
					expect(objects[1])
						.to
						.deep
						.equal(cache.assetByAssetId.get(assetId)
							.toJS());
					expect(objects[1])
						.to
						.deep
						.equal(cache.assetBySymbol.get(assetSymbol)
							.toJS());
				} catch (e) {
					throw e;
				}
			})
				.timeout(15000);
		});
		describe('#getCommitteeMembers()', () => {
			it('should get committee member by id and save it in multi caches', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const committeeMember = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.COMMITTEE_MEMBER}.1`;

					const objects = await api.getCommitteeMembers([committeeMember]);

					expect(objects)
						.to
						.be
						.an('array');
					expect(objects[0])
						.to
						.deep
						.equal(cache.objectsById.get(committeeMember)
							.toJS());
					expect(objects[0])
						.to
						.deep
						.equal(cache.committeeMembersByCommitteeMemberId.get(committeeMember)
							.toJS());
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getAccountByName()', () => {
			it('should get account by name and save it in multi caches', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const accountName = 'relaxed-committee-account';

					const account = await api.getAccountByName(accountName, true);

					expect(account).to.exist;

					const { id } = account;

					expect(account)
						.to
						.deep
						.equal(cache.objectsById.get(id)
							.toJS());
					expect(account)
						.to
						.deep
						.equal(cache.accountsById.get(id)
							.toJS());
					expect(id)
						.to
						.equal(cache.accountsByName.get(accountName));
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#lookupAccounts()', () => {
			it('should get account by name and limit', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const lowerBoundName = 't';

					const accounts = await api.lookupAccounts(lowerBoundName);
					expect(accounts)
						.to
						.be
						.an('array');
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#listAssets()', () => {
			it('should get assets by name and limit', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const lowerBoundSymbol = 'E';

					const assets = await api.listAssets(lowerBoundSymbol);
					expect(assets)
						.to
						.be
						.an('array');
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getBlockHeader()', () => {
			it('should get block header by block number', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const blockNumber = 2;
					const blockHeader = await api.getBlockHeader(blockNumber);

					expect(blockHeader)
						.to
						.deep
						.equal(cache.blockHeadersByBlockNumber.get(blockNumber)
							.toJS());
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe.skip('#getFullContract()', () => {
			it('should get contract', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const contractId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.CONTRACT}.0`;
					const contract = await api.getFullContract(contractId);

					expect(contract)
						.to
						.deep
						.equal(cache.fullContractsByContractId.get(contractId)
							.toJS());
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe.skip('#getContracts()', () => {
			it('should get contracts', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const contractId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.CONTRACT}.0`;
					const contracts = await api.getContracts([contractId]);

					expect(contracts.get(0))
						.to
						.deep
						.equal(cache.contractsByContractId.get(contractId));
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#requestRegistrationTask', () => {
			it('should get registration task', async() => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API, CHAIN_API.REGISTRATION_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const task = await api.requestRegistrationTask();

					expect(task)
						.to
						.be
						.an('object');
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getCommitteeMembers()', () => {
			it('should get committee by id and save to cache', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const id = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.COMMITTEE_MEMBER}.1`;

					const objects = await api.getCommitteeMembers([id]);

					expect(objects)
						.to
						.be
						.an('array');

					const accountId = objects[0].committee_member_account;
					const voteId = objects[0].vote_id;

					expect(objects[0])
						.to
						.deep
						.equal(cache.objectsById.get(id)
							.toJS());
					expect(objects[0])
						.to
						.deep
						.equal(cache.committeeMembersByCommitteeMemberId.get(id)
							.toJS());
					expect(objects[0])
						.to
						.deep
						.equal(cache.committeeMembersByAccountId.get(accountId)
							.toJS());
					expect(objects[0])
						.to
						.deep
						.equal(cache.objectsByVoteId.get(voteId)
							.toJS());
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getCommitteeMemberByAccount()', () => {
			it('should get committee by account id and save to cache', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const accountId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ACCOUNT}.6`;

					const object = await api.getCommitteeMemberByAccount(accountId);

					expect(object)
						.to
						.be
						.an('object');

					const id = object.id;
					const voteId = object.vote_id;

					expect(object)
						.to
						.deep
						.equal(cache.objectsById.get(id)
							.toJS());
					expect(object)
						.to
						.deep
						.equal(cache.committeeMembersByCommitteeMemberId.get(id)
							.toJS());
					expect(object)
						.to
						.deep
						.equal(cache.committeeMembersByAccountId.get(accountId)
							.toJS());
					expect(object)
						.to
						.deep
						.equal(cache.objectsByVoteId.get(voteId)
							.toJS());
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getCommitteeFrozenBalance()', () =>{
			it('should get committee frozen balance by committee member id', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const committeeMemberId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.COMMITTEE_MEMBER}.1`;

					const object = await api.getCommitteeFrozenBalance(committeeMemberId);

					expect(object)
						.to
						.be
						.an('object');

					const { asset_id, amount } = object;

					expect(asset_id)
						.to
						.be
						.an('string').that.is.not.empty;
					expect(amount)
						.to
						.be
						.an('number');
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getBtcAddress()', () => {
			it('should get btc address by account id', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const accountId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ACCOUNT}.6`;

					const btcAddress = await api.getBtcAddress(accountId);

					expect(btcAddress)
						.to
						.be
						.an('null');;
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});

		// TODO:: return 76a9148768abc89249471f990fdf33029ac6c733603a258763ac6775532102c16e97132e72738c9c0163656348cd1be03521de17efeb07e496e74
		// 2ac84512e2102c16e97132e72738c9c0163656348cd1be03521de17efeb07e496e742ac84512e2102c16e97132e72738c9c0163656348cd1be03521de17efeb07e4
		// 96e742ac84512e2102c16e97132e72738c9c0163656348cd1be03521de17efeb07e496e742ac84512e2102c16e97132e72738c9c0163656348cd1be03521de17efe
		// b07e496e742ac84512e21026b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b56ae68
		describe.skip('#getBtcDepositScript()', () => {
			it('should get null because script with this deposit id does not exist', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const btcAddressId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.BTC_ADDRESS}.1`;

					const script = await api.getBtcDepositScript(btcAddressId);

					expect(script)
						.to
						.be
						.an('null');;
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
	});

	describe('history', () => {
		const wsProvider = new WsProvider();
		beforeEach(async () => {
			await wsProvider.connect(url, {
				apis: ['database', 'network_broadcast', 'history', 'registration', 'asset', 'login'],
			});
		});
		afterEach(async () => {
			await wsProvider.close();
		});
		describe('#getAccountHistory()', () => {
			it('should get account history', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API, CHAIN_API.HISTORY_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const accountId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ACCOUNT}.2`;

					const history = await api.getAccountHistory(accountId);
					expect(history)
						.to
						.be
						.an('array');
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getRelativeAccountHistory()', () => {
			it('should get relative account history', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API, CHAIN_API.HISTORY_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const accountId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ACCOUNT}.0`;
					const start = 0;
					const stop = 0;
					const limit = 10;

					const history = await api.getRelativeAccountHistory(accountId, stop, limit, start);
					expect(history)
						.to
						.be
						.an('array');
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getAccountHistoryOperations()', () => {
			it('should get account history operations', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API, CHAIN_API.HISTORY_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const accountId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ACCOUNT}.0`;
					const operationId = 0;
					const start = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.OPERATION_HISTORY}.0`;
					const stop = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.OPERATION_HISTORY}.0`;
					const limit = 10;

					const history = await api.getAccountHistoryOperations(accountId, operationId, start, stop, limit);
					expect(history)
						.to
						.be
						.an('array');
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe.skip('#getContractHistory()', () => {
			it('should get contract history', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const contractId = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.CONTRACT}.1`;
					const start = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.OPERATION_HISTORY}.0`;
					const stop = `1.${constants.PROTOCOL_OBJECT_TYPE_ID.OPERATION_HISTORY}.0`;
					const limit = 10;

					const history = await api.getContractHistory(contractId, stop, limit, start);
					expect(history)
						.to
						.be
						.an('object');
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
		describe('#getRegistrar()', () => {
			it('should get registrarId', async () => {
				try {
					const engine = new EchoApiEngine([CHAIN_API.DATABASE_API, CHAIN_API.REGISTRATION_API], wsProvider);
					await engine.init();
					const cache = new Cache();
					const api = new API(cache, engine);

					const registrar = await api.getRegistrar();
					expect(registrar)
						.to
						.be
						.an('string');
				} catch (e) {
					throw e;
				}
			})
				.timeout(5000);
		});
	});

	require('./api/index.api.test');
});
