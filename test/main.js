// import "babel-polyfill";
// import { expect } from 'chai';
// import WS from '../src/echo/ws'
// import WSAPI from '../src/echo/ws-api'
// import Cache from '../src/echo/cache'
// import API from '../src/echo/api'

// const url = 'wss://echo-devnet-node.pixelplex.io/ws';

// describe('API', () => {
//     const ws = new WS();
//     beforeEach(async () => {
//         await ws.connect(url);
//     });
//     afterEach(async () => {
//         await ws.close();
//     });

//     describe('#getBlock()', () => {
//         it('should get block and save it to cache', async () => {
//             try {
//                 const wsApi = new WSAPI(ws);
//                 const cache = new Cache();
//                 const api = new API(cache, wsApi);
//                 const blockNumber = 200;
//                 const block =  await api.getBlock(blockNumber);

//                 expect(block).to.deep.equal(cache.blocks.get(blockNumber));
//             } catch (e) {
//                 throw e;
//             }
//         }).timeout(5000);
//     });
//     describe('#getTransaction()', () => {
//         it('should get transaction and save it to cache', async () => {
//             try {
//                 const wsApi = new WSAPI(ws);
//                 const cache = new Cache();
//                 const api = new API(cache, wsApi);
//                 const blockNumber = 572118;
//                 const transactionIndex = 0;
//                 const transaction = await api.getTransaction(blockNumber, transactionIndex);

//                 expect(transaction).to.deep.equal(cache.transactionsByBlockAndIndex.get(`${blockNumber}:${transactionIndex}`));
//             } catch (e) {
//                 throw e;
//             }
//         }).timeout(5000);
//     });
//     describe('#getAccounts()', () => {
//         it('should get accounts and save it to cache', async () => {
//             try {
//                 const wsApi = new WSAPI(ws);
//                 const cache = new Cache();
//                 const api = new API(cache, wsApi);
//                 const accountId1 = '1.2.60';
//                 const accountId2 = '1.2.61';
//                 const accounts = await api.getAccounts([accountId1, accountId2]);

//                 expect(accounts).to.be.an('array');
//                 expect(accounts).to.deep.include(cache.accountsById.get(accountId1));
//                 expect(accounts).to.deep.include(cache.accountsById.get(accountId2));
//                 expect(accounts).to.deep.include(cache.objectsById.get(accountId1));
//                 expect(accounts).to.deep.include(cache.objectsById.get(accountId2));
//             } catch (e) {
//                 throw e;
//             }
//         }).timeout(5000);
//     });
//     describe('#getAccountCount()', () => {
//         it('should get account', async () => {
//             try {
//                 const wsApi = new WSAPI(ws);
//                 const cache = new Cache();
//                 const api = new API(cache, wsApi);

//                 const accountCount = await api.getAccountCount();

//                 expect(accountCount).to.be.an('number');
//             } catch (e) {
//                 throw e;
//             }
//         }).timeout(5000);
//     });
//     describe('#lookupAssetSymbols()', () => {
//         it('should get asset by symbol and save it in multi caches', async () => {
//             try {
//                 const wsApi = new WSAPI(ws);
//                 const cache = new Cache();
//                 const api = new API(cache, wsApi);

//                 const assetKey = 'ECHO';
//                 const assetId = '1.3.0';
//                 const assets = await api.lookupAssetSymbols([assetKey]);

//                 expect(assets).to.be.an('array');
//                 expect(assets).to.deep.include(cache.assetByAssetId.get(assetId));
//                 expect(assets).to.deep.include(cache.objectsById.get(assetId));
//                 expect(assets).to.deep.include(cache.assetBySymbol.get(assetKey));
//             } catch (e) {
//                 throw e;
//             }
//         }).timeout(5000);
//     });
//     describe('#getAssets()', () => {
//         it('should get assets by id and save it in multi caches', async () => {
//             try {
//                 const wsApi = new WSAPI(ws);
//                 const cache = new Cache();
//                 const api = new API(cache, wsApi);

//                 const assetId1 = '1.3.0';

//                 const assets = await api.getAssets([assetId1]);

//                 expect(assets).to.be.an('array');
//                 expect(assets).to.deep.include(cache.assetByAssetId.get(assetId1));
//                 expect(assets).to.deep.include(cache.objectsById.get(assetId1));
//             } catch (e) {
//                 throw e;
//             }
//         }).timeout(5000);
//     });
// });
