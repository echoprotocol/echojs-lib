import { Echo, constants } from '../../';
import { privateKey, accountId, url } from '../_test-data';

const { OPERATIONS_IDS } = constants;
const echo = new Echo();

describe('sidechain btc', () => {
	before(() => echo.connect(url));

	after(() => echo.disconnect());

	describe('create address', () => {
		it('test', async () => {

			const transaction = echo.createTransaction();

			transaction.addOperation(constants.OPERATIONS_IDS.SIDECHAIN_BTC_CREATE_ADDRESS, {
            	account: accountId,
            	backup_address: 'msrvud1myzB5gpFds8riorVR87kpr1Ga7k',
			});

			transaction.addSigner(privateKey);

            await transaction.broadcast();
		}).timeout(50000);
	});

	describe('deposit', () => {
		it('test', async () => {
			const txInfo = {
				block_number: 598305,
				tx_id: '7f0baac0a332fd783d252b977e2cd390c6f854cc',
				value: 10,
				vout: 32,
			};

			const transaction = echo.createTransaction();

			transaction.addOperation(constants.OPERATIONS_IDS.SIDECHAIN_BTC_DEPOSIT, {
            	account: accountId,
				backup_address: 'msrvud1myzB5gpFds8riorVR87kpr1Ga7k',
				committee_member_id: '1.2.10',
				intermediate_deposit_id: '1.20.3',
				tx_info: txInfo
			});

			transaction.addSigner(privateKey);

            await transaction.broadcast();
		}).timeout(50000);
	})

});