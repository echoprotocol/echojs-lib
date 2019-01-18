import { expect } from 'chai';
import WS from '../src/echo/ws'
import WSAPI from '../src/echo/ws-api'
import Cache from '../src/echo/cache'
import API from '../src/echo/api'

import { inspect } from 'util';

import echo, { constants } from '../src';

// const url = 'wss://echo-devnet-node.pixelplex.io/ws';
const url = 'ws://195.201.164.54:6311';

describe('API', () => {
	describe('ASSET API', () => {
		before(async () => {
			await echo.connect(url, {
				connectionTimeout: 5000,
				maxRetries: 5,
				pingTimeout: 3000,
				pingInterval: 3000,
				debug: false,
				apis: constants.WS_CONSTANTS.CHAIN_APIS,
			});
		});

		describe('- get asset holders (start = 1, limit = 1)', () => {
			it('test', async () => {
				const result = await echo.api.getAssetHolders(constants.CORE_ASSET_ID, 1, 1);

				expect(result).to.be.an('array').that.is.not.empty;
				expect(result[0]).to.be.an('object').that.is.not.empty;
				expect(result[0].name).to.be.a('string');
				expect(result[0].account_id).to.be.a('string');
				expect(result[0].amount).to.be.a('string');
			});
		});

		describe('- get asset holders count', () => {
			it('test', async () => {
				const result = await echo.api.getAssetHoldersCount(constants.CORE_ASSET_ID);

				expect(result).to.be.a('number');
			});
		});

		describe('- get all asset holders', () => {
			it('test', async () => {
				const result = await echo.api.getAllAssetHolders();

				expect(result).to.be.an('array').that.is.not.empty;
				expect(result[0]).to.be.an('object').that.is.not.empty;
				expect(result[0].asset_id).to.be.a('string');
				expect(result[0].count).to.be.a('number');
			});
		});

		after(() => {
			echo.disconnect();
		});

	});

    describe('database', () => {
        const ws = new WS();
        beforeEach(async () => {
            await ws.connect(url, { debug: false,  apis: ['database', 'network_broadcast', 'history', 'registration', 'asset', 'login', 'network_node']});
        });
        afterEach(async () => {
            await ws.close();
        });

        describe('configs', () => {
            describe('#getChainProperties()', () => {
                it('should get chain properties', async () => {
                    try {
                        const wsApi = new WSAPI(ws);
                        const cache = new Cache();
                        const api = new API(cache, wsApi);

                        const chainProperties =  await api.getChainProperties();
                        console.log(chainProperties)
                        expect(chainProperties).to.be.an('object');
                        expect(chainProperties).to.deep.equal(cache.chainProperties.toJS());
                    } catch (e) {
                        throw e;
                    }
                }).timeout(5000);
            });
            describe('#getGlobalProperties()', () => {
                it('should get global properties', async () => {
                    try {
                        const wsApi = new WSAPI(ws);
                        const cache = new Cache();
                        const api = new API(cache, wsApi);

                        const globalProperties =  await api.getGlobalProperties();

                        expect(globalProperties).to.be.an('object');
                        expect(globalProperties).to.deep.equal(cache.globalProperties.toJS());
                    } catch (e) {
                        throw e;
                    }
                }).timeout(5000);
            });
            describe('#getConfig()', () => {
                it('should get config properties', async () => {
                    try {
                        const wsApi = new WSAPI(ws);
                        const cache = new Cache();
                        const api = new API(cache, wsApi);

                        const config =  await api.getConfig();

                        expect(config).to.be.an('object');
                        expect(config).to.deep.equal(cache.config.toJS());
                    } catch (e) {
                        throw e;
                    }
                }).timeout(5000);
            });
            describe('#getChainId()', () => {
                it('should get chain id', async () => {
                    try {
                        const wsApi = new WSAPI(ws);
                        const cache = new Cache();
                        const api = new API(cache, wsApi);

                        const chainId = await api.getChainId();

                        expect(chainId).to.be.an('string');
                    } catch (e) {
                        throw e;
                    }
                }).timeout(5000);
            });
            describe('#getDynamicGlobalProperties()', () => {
                it('should get dynamic global properties', async () => {
                    try {
                        const wsApi = new WSAPI(ws);
                        const cache = new Cache();
                        const api = new API(cache, wsApi);

                        const dynamicGlobalProperties = await api.getDynamicGlobalProperties();

                        expect(dynamicGlobalProperties).to.be.an('object');
                        expect(dynamicGlobalProperties).to.deep.equal(cache.dynamicGlobalProperties.toJS());
                    } catch (e) {
                        throw e;
                    }
                }).timeout(5000);
            });
        });

        describe('#getBlock()', () => {
            it('should get block and save it to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);
                    const blockNumber = 20;
                    const block =  await api.getBlock(blockNumber);

                    expect(block).to.deep.equal(cache.blocks.get(blockNumber).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe.skip('#getTransaction()', () => {
            it('should get transaction and save it to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);
                    const blockNumber = 205378;
                    const transactionIndex = 0;
                    const transaction = await api.getTransaction(blockNumber, transactionIndex);

                    expect(transaction).to.deep.equal(cache.transactionsByBlockAndIndex.get(`${blockNumber}:${transactionIndex}`).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAccounts()', () => {
            it('should get accounts and save it to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);
                    const accountId1 = '1.2.5';
                    const accountId2 = '1.2.6';
                    const accounts = await api.getAccounts([accountId1, accountId2]);

                    expect(accounts).to.be.an('array');

                    expect(accounts[0]).to.deep.equal(cache.accountsById.get(accountId1).toJS());
                    expect(accounts[0]).to.deep.equal(cache.objectsById.get(accountId1).toJS());
                    expect(accounts[1]).to.deep.equal(cache.accountsById.get(accountId2).toJS());
                    expect(accounts[1]).to.deep.equal(cache.objectsById.get(accountId2).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getFullAccounts()', () => {
            it('should get accounts and save it to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);
                    const accountId1 = '1.2.5';
                    const accountId2 = '1.2.6';

                    const accounts = await api.getFullAccounts([accountId1, accountId2]);

                    expect(accounts).to.be.an('array');

                    expect(accounts[0]).to.deep.equal(cache.fullAccounts.get(accountId1).toJS());
                    expect(cache.accountsById.get(accountId1)).to.be.an('object');
                    expect(cache.objectsById.get(accountId1)).to.be.an('object');

                    expect(accounts[1]).to.deep.equal(cache.fullAccounts.get(accountId2).toJS());
                    expect(cache.accountsById.get(accountId2)).to.be.an('object');
                    expect(cache.objectsById.get(accountId2)).to.be.an('object');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAccountCount()', () => {
            it('should get account count', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountCount = await api.getAccountCount();

                    expect(accountCount).to.be.an('number');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#lookupAssetSymbols()', () => {
            it('should get asset by symbol and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const assetKey = 'ECHO';
                    const assetId = '1.3.0';
                    const assets = await api.lookupAssetSymbols([assetKey]);

                    expect(assets).to.be.an('array');

                    expect(assets[0]).to.deep.equal(cache.assetByAssetId.get(assetId).toJS());
                    expect(assets[0]).to.deep.equal(cache.objectsById.get(assetId).toJS());
                    expect(assets[0]).to.deep.equal(cache.assetBySymbol.get(assetKey).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAssets()', () => {
            it('should get assets by id and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const assetId1 = '1.3.0';

                    const assets = await api.getAssets([assetId1]);

                    expect(assets).to.be.an('array');
                    expect(assets[0]).to.deep.equal(cache.assetByAssetId.get(assetId1).toJS());
                    expect(assets[0]).to.deep.equal(cache.objectsById.get(assetId1).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getObjects()', () => {
            it('should get objects by id and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountId = '1.2.2';
                    const assetId = '1.3.0';
                    const witnessId = '1.6.0';
                    const assetSymbol = 'ECHO';

                    const objects = await api.getObjects([accountId, assetId, witnessId]);

                    const accountName = objects[0].name;
                    const witnessAccountId = objects[2].witness_account;
                    const witnessVoteId = objects[2].vote_id;

                    expect(objects).to.be.an('array');

                    expect(objects[0]).to.deep.equal(cache.accountsById.get(accountId).toJS());
                    expect(objects[0]).to.deep.equal(cache.objectsById.get(accountId).toJS());
                    expect(accountId).to.equal(cache.accountsByName.get(accountName));
                    expect(objects[1]).to.deep.equal(cache.objectsById.get(assetId).toJS());
                    expect(objects[1]).to.deep.equal(cache.assetByAssetId.get(assetId).toJS());
                    expect(objects[1]).to.deep.equal(cache.assetBySymbol.get(assetSymbol).toJS());
                    expect(objects[2]).to.deep.equal(cache.objectsById.get(witnessId).toJS());
                    expect(objects[2]).to.deep.equal(cache.witnessByWitnessId.get(witnessId).toJS());
                    expect(objects[2]).to.deep.equal(cache.witnessByAccountId.get(witnessAccountId).toJS());
                    expect(objects[2]).to.deep.equal(cache.objectsByVoteId.get(witnessVoteId).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getCommitteeMembers()', () => {
            it('should get committee member by id and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const committeeMember = '1.5.1';

                    const objects = await api.getCommitteeMembers([committeeMember]);

                    expect(objects).to.be.an('array');
                    expect(objects[0]).to.deep.equal(cache.objectsById.get(committeeMember).toJS());
                    expect(objects[0]).to.deep.equal(cache.committeeMembersByCommitteeMemberId.get(committeeMember).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAccountByName()', () => {
            it('should get account by name and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountName = 'relaxed-committee-account';

                    const account = await api.getAccountByName(accountName, true);

                    expect(account).to.exist;

                    const { id } = account;

                    expect(account).to.deep.equal(cache.objectsById.get(id).toJS());
                    expect(account).to.deep.equal(cache.accountsById.get(id).toJS());
                    expect(id).to.equal(cache.accountsByName.get(accountName));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getWitnesses()', () => {
            it('should get witnesses by id and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const witnessId = '1.6.0';

                    const objects = await api.getWitnesses([witnessId]);

                    expect(objects).to.be.an('array');

                    expect(objects[0]).to.deep.equal(cache.objectsById.get(witnessId).toJS());
                    expect(objects[0]).to.deep.equal(cache.witnessByWitnessId.get(witnessId).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAllContracts()', () => {
            it('should get all contracts', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const contracts = await api.getAllContracts();
                    expect(contracts).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#lookupAccounts()', () => {
            it('should get account by name and limit', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const lowerBoundName = 't';

                    const accounts = await api.lookupAccounts(lowerBoundName);
                    expect(accounts).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#listAssets()', () => {
            it('should get assets by name and limit', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const lowerBoundSymbol = 'E';

                    const assets = await api.listAssets(lowerBoundSymbol);
                    expect(assets).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getBlockHeader()', () => {
            it('should get block header by block number', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const blockNumber = 200;
                    const blockHeader =  await api.getBlockHeader(blockNumber);

                    expect(blockHeader).to.deep.equal(cache.blockHeadersByBlockNumber.get(blockNumber).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe.skip('#getContract()', () => {
            it('should get contract', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const contractId = '1.16.0';
                    const contract =  await api.getContract(contractId);

                    expect(contract).to.deep.equal(cache.fullContractsByContractId.get(contractId));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe.skip('#getContracts()', () => {
            it('should get contracts', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const contractId = '1.16.0';
                    const contracts =  await api.getContracts([contractId]);

                    expect(contracts.get(0)).to.deep.equal(cache.contractsByContractId.get(contractId));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#registerAccount()', () => {
            it('should throw an user already exist error', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountName = 'test101';
                    const ownerKey = 'ECHO59St8wBpta2ZREBnA3dQQTVFBrEcx5UK12Tm5geG7kv7Hwyzyc';
                    const activeKey = 'ECHO59St8wBpta2ZREBnA3dQQTVFBrEcx5UK12Tm5geG7kv7Hwyzyc';
                    const memo = 'ECHO59St8wBpta2ZREBnA3dQQTVFBrEcx5UK12Tm5geG7kv7Hwyzyc';
                    const echoRandKey = 'DET3vw54ewEd7G8aKGHSzC5QbKpGhWEaRH1EvscHMbwZNVW';

                    await api.registerAccount(accountName, ownerKey, activeKey, memo, echoRandKey);

                    expect.fail(null, null, 'registerAccount() did not reject with an error')
                } catch (_) {}
            }).timeout(5000);
        });
        describe('#lookupVoteIds()', () => {
            it('should get vote by id and save to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const committeeVoteId = '0:1';
                    const witnessVoteId = '1:0';

                    const objects = await api.lookupVoteIds([committeeVoteId, witnessVoteId]);

                    expect(objects).to.be.an('array');

                    const committeeAccountId = objects[0].committee_member_account;
                    const committeeId = objects[0].id;

                    expect(objects[0]).to.deep.equal(cache.objectsById.get(committeeId).toJS());
                    expect(objects[0]).to.deep.equal(cache.committeeMembersByCommitteeMemberId.get(committeeId).toJS());
                    expect(objects[0]).to.deep.equal(cache.committeeMembersByAccountId.get(committeeAccountId).toJS());
                    expect(objects[0]).to.deep.equal(cache.objectsByVoteId.get(committeeVoteId).toJS());


                    const witnessAccountId = objects[1].witness_account;
                    const witnessId = objects[1].id;

                    expect(objects[1]).to.deep.equal(cache.objectsById.get(witnessId).toJS());
                    expect(objects[1]).to.deep.equal(cache.witnessByWitnessId.get(witnessId).toJS());
                    expect(objects[1]).to.deep.equal(cache.witnessByAccountId.get(witnessAccountId).toJS());
                    expect(objects[1]).to.deep.equal(cache.objectsByVoteId.get(witnessVoteId).toJS());

                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getCommitteeMembers()', () => {
            it('should get committee by id and save to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const id = '1.5.0';

                    const objects = await api.getCommitteeMembers([id]);

                    expect(objects).to.be.an('array');

                    const accountId = objects[0].committee_member_account;
                    const voteId = objects[0].vote_id;

                    expect(objects[0]).to.deep.equal(cache.objectsById.get(id).toJS());
                    expect(objects[0]).to.deep.equal(cache.committeeMembersByCommitteeMemberId.get(id).toJS());
                    expect(objects[0]).to.deep.equal(cache.committeeMembersByAccountId.get(accountId).toJS());
                    expect(objects[0]).to.deep.equal(cache.objectsByVoteId.get(voteId).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getCommitteeMemberByAccount()', () => {
            it('should get committee by account id and save to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountId = '1.2.6';

                    const object = await api.getCommitteeMemberByAccount(accountId);

                    expect(object).to.be.an('object');

                    const id = object.id;
                    const voteId = object.vote_id;

                    expect(object).to.deep.equal(cache.objectsById.get(id).toJS());
                    expect(object).to.deep.equal(cache.committeeMembersByCommitteeMemberId.get(id).toJS());
                    expect(object).to.deep.equal(cache.committeeMembersByAccountId.get(accountId).toJS());
                    expect(object).to.deep.equal(cache.objectsByVoteId.get(voteId).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getWitnesses()', () => {
            it('should get witnesses by id and save to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const id = '1.6.0';

                    const objects = await api.getWitnesses([id]);

                    expect(objects).to.be.an('array');

                    const accountId = objects[0].witness_account;
                    const voteId = objects[0].vote_id;

                    expect(objects[0]).to.deep.equal(cache.objectsById.get(id).toJS());
                    expect(objects[0]).to.deep.equal(cache.witnessByWitnessId.get(id).toJS());
                    expect(objects[0]).to.deep.equal(cache.witnessByAccountId.get(accountId).toJS());
                    expect(objects[0]).to.deep.equal(cache.objectsByVoteId.get(voteId).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getCommitteeMemberByAccount()', () => {
            it('should get witnesses by account id and save to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountId = '1.2.0';

                    const object = await api.getWitnessByAccount(accountId);

                    expect(object).to.be.an('object');

                    const id = object.id;
                    const voteId = object.vote_id;

                    expect(object).to.deep.equal(cache.objectsById.get(id).toJS());
                    expect(object).to.deep.equal(cache.witnessByWitnessId.get(id).toJS());
                    expect(object).to.deep.equal(cache.witnessByAccountId.get(accountId).toJS());
                    expect(object).to.deep.equal(cache.objectsByVoteId.get(voteId).toJS());
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
    });

    describe('history', () => {
        const ws = new WS();
        beforeEach(async () => {
            await ws.connect(url, { apis: ['database', 'network_broadcast', 'history', 'registration', 'asset', 'login']});
        });
        afterEach(async () => {
            await ws.close();
        });
        describe('#getAccountHistory()', () => {
            it('should get account history', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountId = '1.2.2';

                    const history = await api.getAccountHistory(accountId);
                    expect(history).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getRelativeAccountHistory()', () => {
            it('should get relative account history', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountId = '1.2.0';
                    const start = 0;
                    const stop = 0;
                    const limit = 10;

                    const history = await api.getRelativeAccountHistory(accountId, stop, limit, start);
                    expect(history).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAccountHistoryOperations()', () => {
            it('should get account history operations', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountId = '1.2.0';
                    const operationId = 0;
                    const start = '1.11.0';
                    const stop = '1.11.0';
                    const limit = 10;

                    const history = await api.getAccountHistoryOperations(accountId, operationId, start, stop, limit);
                    expect(history).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe.skip('#getContractHistory()', () => {
            it('should get contract history', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const contractId = '1.16.1';
                    const start = '1.11.0';
                    const stop = '1.11.0';
                    const limit = 10;

                    const history = await api.getContractHistory(contractId, stop, limit, start);
                    expect(history).to.be.an('object');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
    });
});
