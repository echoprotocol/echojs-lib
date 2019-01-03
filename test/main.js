import "babel-polyfill";
import { expect } from 'chai';
import WS from '../src/echo/ws'
import WSAPI from '../src/echo/ws-api'
import Cache from '../src/echo/cache'
import API from '../src/echo/api'

// const url = 'wss://echo-devnet-node.pixelplex.io/ws';
const url = 'ws://195.201.164.54:6311';

describe('API', () => {
    const ws = new WS();
    beforeEach(async () => {
        await ws.connect(url, { apis: ['database', 'network_broadcast', 'history', 'registration', 'asset', 'login']});
    });
    afterEach(async () => {
        await ws.close();
    });

    describe('#getBlock()', () => {
        it('should get block and save it to cache', async () => {
            try {
                const wsApi = new WSAPI(ws);
                const cache = new Cache();
                const api = new API(cache, wsApi);
                const blockNumber = 200;
                const block =  await api.getBlock(blockNumber);

                expect(block).to.deep.equal(cache.blocks.get(blockNumber));
            } catch (e) {
                throw e;
            }
        }).timeout(5000);
    });
    describe('#getTransaction()', () => {
        it.skip('should get transaction and save it to cache', async () => {
            try {
                const wsApi = new WSAPI(ws);
                const cache = new Cache();
                const api = new API(cache, wsApi);
                const blockNumber = 0;
                const transactionIndex = 0;
                const transaction = await api.getTransaction(blockNumber, transactionIndex);

                expect(transaction).to.deep.equal(cache.transactionsByBlockAndIndex.get(`${blockNumber}:${transactionIndex}`));
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
                expect(accounts).to.deep.include(cache.accountsById.get(accountId1));
                expect(accounts).to.deep.include(cache.accountsById.get(accountId2));
                expect(accounts).to.deep.include(cache.objectsById.get(accountId1));
                expect(accounts).to.deep.include(cache.objectsById.get(accountId2));
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
                expect(assets).to.deep.include(cache.assetByAssetId.get(assetId));
                expect(assets).to.deep.include(cache.objectsById.get(assetId));
                expect(assets).to.deep.include(cache.assetBySymbol.get(assetKey));
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
                expect(assets).to.deep.include(cache.assetByAssetId.get(assetId1));
                expect(assets).to.deep.include(cache.objectsById.get(assetId1));
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

                const assetId = '1.3.0';
                const accountId = '1.2.2';
                const assetSymbol = 'ECHO';

                const objects = await api.getObjects([accountId, assetId]);

                const assetName = objects[0].name;

                expect(objects).to.be.an('array');
                expect(objects).to.deep.include(cache.objectsById.get(assetId));
                expect(objects).to.deep.include(cache.objectsById.get(accountId));
                expect(objects).to.deep.include(cache.assetByAssetId.get(assetId));
                expect(objects).to.deep.include(cache.assetBySymbol.get(assetSymbol));
                expect(objects).to.deep.include(cache.accountsById.get(accountId));
                expect(objects).to.deep.include(cache.accountsByName.get(assetName));
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
                expect(objects).to.deep.include(cache.objectsById.get(committeeMember));
                expect(objects).to.deep.include(cache.committeeMembersByCommitteeMemberId.get(committeeMember));
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

                const accountName = 'test1012';

                const account = await api.getAccountByName(accountName);

                expect(account).to.exist;

                const { id } = account;

                expect(account).to.deep.equal(cache.objectsById.get(id));
                expect(account).to.deep.equal(cache.accountsById.get(id));
                expect(account).to.deep.equal(cache.accountsByName.get(accountName));
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

                const witnessId = '1.6.1';

                const objects = await api.getWitnesses([witnessId]);

                expect(objects).to.be.an('array');
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
    describe.skip('#getObjects()', () => {
        it('should get objects by id and save it in multi caches', async () => {
            try {
                const wsApi = new WSAPI(ws);
                const cache = new Cache();
                const api = new API(cache, wsApi);

                const accountName = 'teqst112f21';
                const ownerKey = 'ECHOCV';
                const activeKey = 'ECHO6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';
                const memoKey = 'ECHO6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';
                const echoRandKey = 'DETDvH';

                const answer = await api.registerAccount(accountName, ownerKey, activeKey, memoKey, echoRandKey);
                // expect(objects).to.be.an('array');
            } catch (e) {
                throw e;
            }
        }).timeout(5000);
    });
});