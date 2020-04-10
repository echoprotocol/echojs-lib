import "@babel/polyfill";
// import { expect } from 'chai';
// import WS from '../src/echo/ws'
// import WSAPI from '../src/echo/ws-api'
// import Cache from '../src/echo/cache'
// import API from '../src/echo/api'

// import { url } from './_test-data';
// import { ACCOUNT, ASSET, } from '../src/constants/object-types';

// describe('API', () => {
// 	const ws = new WS();
// 	beforeEach(async () => {
// 		await ws.connect(url);
// 	});
// 	afterEach(async () => {
// 		await ws.close();
// 	});

// 	describe('#getBlock()', () => {
// 		it('should get block and save it to cache', async () => {
// 			try {
// 				const wsApi = new WSAPI(ws);
// 				const cache = new Cache();
// 				const api = new API(cache, wsApi);
// 				const blockNumber = 200;
// 				const block = await api.getBlock(blockNumber);

// 				expect(block).to.deep.equal(cache.blocks.get(blockNumber));
// 			} catch (e) {
// 				throw e;
// 			}
// 		}).timeout(5000);
// 	});
// 	describe('#getTransaction()', () => {
// 		it.skip('should get transaction and save it to cache', async () => {
// 			try {
// 				const wsApi = new WSAPI(ws);
// 				const cache = new Cache();
// 				const api = new API(cache, wsApi);
// 				const blockNumber = 0;
// 				const transactionIndex = 0;
// 				const transaction = await api.getTransaction(blockNumber, transactionIndex);

// 				expect(transaction).to.deep.equal(cache.transactionsByBlockAndIndex.get(`${blockNumber}:${transactionIndex}`));
// 			} catch (e) {
// 				throw e;
// 			}
// 		}).timeout(5000);
// 	});
// 	describe('#getAccounts()', () => {
// 		it('should get accounts and save it to cache', async () => {
// 			try {
// 				const wsApi = new WSAPI(ws);
// 				const cache = new Cache();
// 				const api = new API(cache, wsApi);
// 				const accountId1 = `1.${ACCOUNT}.5`;
// 				const accountId2 = `1.${ACCOUNT}.6`;
// 				const accounts = await api.getAccounts([accountId1, accountId2]);

// 				expect(accounts).to.be.an('array');
// 				expect(accounts).to.deep.include(cache.accountsById.get(accountId1));
// 				expect(accounts).to.deep.include(cache.accountsById.get(accountId2));
// 				expect(accounts).to.deep.include(cache.objectsById.get(accountId1));
// 				expect(accounts).to.deep.include(cache.objectsById.get(accountId2));
// 			} catch (e) {
// 				throw e;
// 			}
// 		}).timeout(5000);
// 	});
// 	describe('#getAccountCount()', () => {
// 		it('should get account count', async () => {
// 			try {
// 				const wsApi = new WSAPI(ws);
// 				const cache = new Cache();
// 				const api = new API(cache, wsApi);

// 				const accountCount = await api.getAccountCount();

// 				expect(accountCount).to.be.an('number');
// 			} catch (e) {
// 				throw e;
// 			}
// 		}).timeout(5000);
// 	});
// 	describe('#lookupAssetSymbols()', () => {
// 		it('should get asset by symbol and save it in multi caches', async () => {
// 			try {
// 				const wsApi = new WSAPI(ws);
// 				const cache = new Cache();
// 				const api = new API(cache, wsApi);

// 				const assetKey = 'ECHO';
// 				const assetId = `1.${ASSET}.0`;
// 				const assets = await api.lookupAssetSymbols([assetKey]);

// 				expect(assets).to.be.an('array');
// 				expect(assets).to.deep.include(cache.assetByAssetId.get(assetId));
// 				expect(assets).to.deep.include(cache.objectsById.get(assetId));
// 				expect(assets).to.deep.include(cache.assetBySymbol.get(assetKey));
// 			} catch (e) {
// 				throw e;
// 			}
// 		}).timeout(5000);
// 	});
// 	describe('#getAssets()', () => {
// 		it('should get assets by id and save it in multi caches', async () => {
// 			try {
// 				const wsApi = new WSAPI(ws);
// 				const cache = new Cache();
// 				const api = new API(cache, wsApi);

// 				const assetId1 = `1.${ASSET}.0`;

// 				const assets = await api.getAssets([assetId1]);

// 				expect(assets).to.be.an('array');
// 				expect(assets).to.deep.include(cache.assetByAssetId.get(assetId1));
// 				expect(assets).to.deep.include(cache.objectsById.get(assetId1));
// 			} catch (e) {
// 				throw e;
// 			}
// 		}).timeout(5000);
// 	});
// 	describe('#getObjects()', () => {
// 		it('should get objects by id and save it in multi caches', async () => {
// 			try {
// 				const wsApi = new WSAPI(ws);
// 				const cache = new Cache();
// 				const api = new API(cache, wsApi);

// 				const assetId = `1.${ASSET}.0`;
// 				const accountId = `1.${ACCOUNT}.2`;
// 				const assetSymbol = 'ECHO';

// 				const objects = await api.getObjects([accountId, assetId]);
// 				const assetName = objects[0].name;

// 				expect(objects).to.be.an('array');
// 				expect(objects).to.deep.include(cache.objectsById.get(assetId));
// 				expect(objects).to.deep.include(cache.objectsById.get(accountId));
// 				expect(objects).to.deep.include(cache.assetByAssetId.get(assetId));
// 				expect(objects).to.deep.include(cache.assetBySymbol.get(assetSymbol));
// 				expect(objects).to.deep.include(cache.accountsById.get(accountId));
// 				expect(objects).to.deep.include(cache.accountsByName.get(assetName));
// 			} catch (e) {
// 				throw e;
// 			}
// 		}).timeout(5000);
// 	});
// });
