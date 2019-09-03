import { PrivateKey } from "../src";

export const privateKey = PrivateKey.fromWif('5KkYp8qdQBaRmLqLz8WVrGjzkt7E13qVcr7cpdLowgJ1mjRyDx2');
export const accountName = 'nathan';
export const accountId = '1.2.11';
export const contractId = '1.14.0';

export const url = 'ws://127.0.0.1:6311';

export const ED_PRIVATE = '5eePidTGLR7ecWiQB1b7osm1iMDfQo2HKAzfyN4QDma4';
export const ED_PRIVATE_WITHOUT_PREFIX = '5eePidTGLR7ecWiQB1b7osm1iMDfQo2HKAzfyN4QDma4';
export const WIF = '5JLi3M4H9qY3FMTyGW9TCC92ebbqNo36sUHwJqpKxvJMWN2XwbH';

export const transaction = {
	"ref_block_num": 26515,
	"ref_block_prefix": 2209215247,
	"expiration": "2019-07-16T14:08:55",
	"operations": [
		[
			0,
			{
				"fee": {
					"amount": "2000000",
					"asset_id": "1.3.0"
				},
				"from": "1.2.67",
				"to": "1.2.56",
				"amount": {
					"amount": "100",
					"asset_id": "1.3.0"
				},
				"extensions": []
			}
		]
	],
	"extensions": [],
	// "signatures": [
	// 	"203d2b45b7ed61b9a4f2765114d11b02918300e2ff1396b115053c0226fa181ebf102d3b33f46fae62baa01e9acbe41f18491e33a7477c8404d953a948cff5981e"
	// ]
};

export const transaction2 = {
	"ref_block_num": 26515,
	"ref_block_prefix": 2209215247,
	"expiration": "2019-07-16T14:08:55",
	"operations": [
		[
			0,
			{
				"fee": {
					"amount": "2000000",
					"asset_id": "1.3.0"
				},
				"from": "1.2.67",
				"to": "1.2.56",
				"amount": {
					"amount": "100",
					"asset_id": "1.3.0"
				},
				"extensions": []
			}
		]
	],
	"extensions": []
};
