import { strictEqual, ok } from 'assert';
import BigNumber from 'bignumber.js';
import ByteBuffer from 'bytebuffer';
import * as ed25519 from 'ed25519.js';
import bs58 from 'bs58'

import { Echo, constants } from '../../src';
import { transfer } from '../../src/echo/operations';
import PublicKey from '../../src/crypto/public-key';
import Transaction from '../../src/echo/transaction';
import ED25519 from '../../src/crypto/ed25519'
import { privateKey, accountId, url } from '../_test-data';
import PrivateKey from '../../src/crypto/private-key'
const { OPERATIONS_IDS } = constants;
// import bs58 from 'bs58'
const echo = new Echo();

describe('transfer', () => {
	before(() => echo.connect(url));

	after(() => echo.disconnect());

	describe('- transfer', () => {
		it('test', async () => {


			const transaction = new Transaction(echo.api);
			transaction.addOperation('transfer', {
				from: accountId,
				to: '1.2.10',
				amount: { asset_id: '1.3.0', amount: 1 },
			});

			transaction.addSigner(privateKey);

			const result = await transaction.broadcast();


		}).timeout(50000);
	});

	describe('successful validation', () => {
		it('full object', () => {
			transfer.validate([OPERATIONS_IDS.TRANSFER, {
				fee: { asset_id: '1.3.1', amount: 20 },
				from: '1.2.123',
				to: '1.2.456',
				amount: { asset_id: '1.3.2', amount: 30 },
	// 			memo: {
	// 				from: 'ECHO6tMhKMDpynSsLyFL3gk2gZi4xMayficom97fZQKh64FHtCpV7D',
	// 				to: PublicKey.fromStringOrThrow('ECHO8gP5V1F9cudUHxxoDb66BwiEPUB4ZQmwgtLXDrXaQAuJWb921w'),
	// 				nonce: new BigNumber('0xfedcba9876543210'),
	// 				message: 'test_message',
	// 			},
			}]);
		});
	});

	describe('converting to bytebuffer', () => {
		it('minimal object', () => {
			const transaction = new Transaction(echo.api);
			transaction.addOperation('transfer', {
				// FIXME: remove optional fee
				fee: { asset_id: '1.3.1', amount: 20 },
				from: '1.2.123',
				to: '1.2.456',
				amount: { asset_id: '1.3.2', amount: 30 },
			});
			const result = transaction.toByteBuffer();
			ok(result instanceof ByteBuffer);
			strictEqual(result.toHex(), '1400000000000000017bc8031e00000000000000020000');
		});
	});
});
