import { strictEqual, ok } from 'assert';
import BigNumber from 'bignumber.js';
import ByteBuffer from 'bytebuffer';
import * as ed25519 from 'ed25519.js';
import bs58 from 'bs58';

import { Echo, constants } from '../../src';
import { transfer } from '../../src/echo/operations';
import PublicKey from '../../src/crypto/public-key';
import Transaction from '../../src/echo/transaction';
import ED25519 from '../../src/crypto/ed25519';
import { privateKey, accountId, url } from '../_test-data';
import PrivateKey from '../../src/crypto/private-key';
import testExtensionsField from './_testExtensionsField';

import { ACCOUNT, ASSET} from '../../src/constants/object-types';

const { OPERATIONS_IDS } = constants;
// import bs58 from 'bs58'
const echo = new Echo();

describe('transfer', () => {
	before(() => echo.connect(url));

	after(() => echo.disconnect());

	describe('- transfer', () => {
		it('test', async () => {

			const transaction = new Transaction(echo.api);

			transaction.addOperation(constants.OPERATIONS_IDS.TRANSFER, {
				from: accountId,
				to: `1.${ACCOUNT}.9`,
				amount: {
					asset_id: `1.${ASSET}.0`,
					amount: 1
				},
			});

			transaction.addSigner(privateKey);

			const result = await transaction.broadcast();

		}).timeout(50000);
	});

	describe('successful validation', () => {
		it('full object', () => {
			transfer.validate([OPERATIONS_IDS.TRANSFER, {
				fee: {
					asset_id: `1.${ASSET}.1`,
					amount: 20
				},
				from: `1.${ACCOUNT}.123`,
				to: `1.${ACCOUNT}.456`,
				amount: {
					asset_id: `1.${ASSET}.2`,
					amount: 30
				},
			}]);
		});
	});

	describe('converting to bytebuffer', () => {
		it('minimal object', () => {
			const transaction = new Transaction(echo.api);
			transaction.addOperation('transfer', {
				// FIXME: remove optional fee
				fee: {
					asset_id: `1.${ASSET}.1`,
					amount: 20
				},
				from: `1.${ACCOUNT}.123`,
				to: `1.${ACCOUNT}.456`,
				amount: {
					asset_id: `1.${ASSET}.2`,
					amount: 30
				},
			});
			const result = transaction.toByteBuffer();
			ok(result instanceof ByteBuffer);
			strictEqual(result.toHex(), '1400000000000000017bc8031e000000000000000200');
		});
	});

	testExtensionsField(echo, OPERATIONS_IDS.TRANSFER, (extensions) => ({
		from: accountId,
		to: '1.2.10',
		amount: { asset_id: '1.3.0', amount: 1 },
		extensions,
	}));
});
