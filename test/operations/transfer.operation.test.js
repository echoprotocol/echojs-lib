import { transfer } from '../../src/echo/operations';
import PublicKey from '../../src/crypto/public-key';
import BigNumber from 'bignumber.js';

describe('transfer', () => {
	// describe('failure creation', () => { });
	describe('successful validation', () => {
		it('full object', () => {
			transfer.validate([0, {
				fee: { asset_id: '1.3.1', amount: 20 },
				from: '1.2.123',
				to: '1.2.456',
				amount: { asset_id: '1.3.2', amount: 30 },
				memo: {
					from: 'ECHO6tMhKMDpynSsLyFL3gk2gZi4xMayficom97fZQKh64FHtCpV7D',
					to: PublicKey.fromStringOrThrow('ECHO8gP5V1F9cudUHxxoDb66BwiEPUB4ZQmwgtLXDrXaQAuJWb921w'),
					nonce: new BigNumber('0xfedcba9876543210'),
					message: 'test_message',
				},
			}]);
		});
	});
});
