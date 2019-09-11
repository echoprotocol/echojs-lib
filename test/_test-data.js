import { PrivateKey, constants } from "../";

export const privateKey = PrivateKey.fromWif('5KkYp8qdQBaRmLqLz8WVrGjzkt7E13qVcr7cpdLowgJ1mjRyDx2');
export const accountName = 'nathan';
export const accountId = `1.${constants.OBJECT_TYPES.ACCOUNT}.10`;
export const contractId = `1.${constants.OBJECT_TYPES.CONTRACT}.0`;

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
	"signatures": [
		"20250405e4ebd9fc4d0bcee9b4ca1a6f5b566bc291ba8853c20041e36252a25a085cfea453edd312ffd24334b2fd22cadda3ad1f3d7f45efa2534e100f2bbb5a9d"
	]
};

export const transaction2 = {
	'ref_block_num': 27117,
	'ref_block_prefix': 1741405489,
	'expiration': '2019-07-16T14:39:20',
	'operations': [
		[
			0,
			{
				'fee': {
					'amount': '2000000',
					'asset_id': '1.3.0'
				},
				'from': '1.2.67',
				'to': '1.2.57',
				'amount': {
					'amount': '100',
					'asset_id': '1.3.0'
				},
				'extensions': []
			}
		]
	],
	'extensions': []
};
