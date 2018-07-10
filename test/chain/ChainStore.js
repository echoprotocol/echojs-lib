import assert from 'assert';
import { Apis, ChainConfig } from 'echojs-ws';
import { ChainStore } from '../../lib';

let coreAsset;

describe('ChainStore', () => {
	// Connect once for all tests
	before(() =>
		/* use wss://echo-devnet-node.pixelplex.io/ws if no local node is available */
		 Apis.instance('wss://echo-devnet-node.pixelplex.io/ws', true).init_promise.then((result) => {
			coreAsset = result[0].network.core_asset;
			return ChainStore.init();
		}));

	// Unsubscribe everything after each test
	afterEach(() => {
		ChainStore.subscribers = new Set();
		ChainStore.clearCache();
	});

	after(() => {
		ChainConfig.reset();
	});

	describe('Subscriptions', () => {

		it('Asset not found', () => new Promise(((resolve) => {
			ChainStore.subscribe(() => {
				if (ChainStore.getAsset(coreAsset) !== undefined) {
					assert(ChainStore.getAsset('NOTFOUND') === null);
					resolve();
				}
			});
			assert(ChainStore.getAsset('NOTFOUND') === undefined);
		})));

		it('Asset by name', () => new Promise(((resolve) => {
			ChainStore.subscribe(() => {
				if (ChainStore.getAsset(coreAsset) !== undefined) {
					assert(ChainStore.getAsset(coreAsset) != null);
					resolve();
				}
			});
			assert(ChainStore.getAsset(coreAsset) === undefined);
		})));

		it('Asset by id', () => new Promise(((resolve) => {
			ChainStore.subscribe(() => {
				if (ChainStore.getAsset('1.3.0') !== undefined) {
					assert(ChainStore.getAsset('1.3.0') != null);
					resolve();
				}
			});
			assert(ChainStore.getAsset('1.3.0') === undefined);
		})));

		it('Object by id', () => new Promise(((resolve) => {
			ChainStore.subscribe(() => {
				if (ChainStore.getObject('2.0.0') !== undefined) {
					assert(ChainStore.getObject('2.0.0') != null);
					resolve();
				}
			});
			assert(ChainStore.getObject('2.0.0') === undefined);
		})));

		it('Account by id', () => new Promise(((resolve) => {
			ChainStore.subscribe(() => {
				if (ChainStore.getAccount('1.2.0') !== undefined) {
					assert(ChainStore.getAccount('1.2.0') != null);
					resolve();
				}
			});
			assert(ChainStore.getAccount('1.2.0') === undefined);
		})));

		it('Account by name', () => new Promise(((resolve) => {
			ChainStore.subscribe(() => {
				if (ChainStore.getAccount('proxy-to-self') !== undefined) {
					assert(ChainStore.getAccount('proxy-to-self') != null);
					resolve();
				}
			});
			assert(ChainStore.getAccount('proxy-to-self') === undefined);
		})));
	});
});
