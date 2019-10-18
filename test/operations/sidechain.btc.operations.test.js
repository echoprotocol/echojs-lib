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
	});

	describe('aggregate', () => {
		it('test', async () => {
			const deposits = new Set();
			const withdrawals = new Set();
			const committeeMemberIdsInScript = new Set();
			const signatures = new Map();

			const transaction = echo.createTransaction();

			transaction.addOperation(constants.OPERATIONS_IDS.SIDECHAIN_BTC_AGGREGATE, {
				committee_member_id: '1.2.10',
				deposits,
				withdrawals,
				transaction_id: '2d94683fa2f8aaae4a6f377d93b875f680adf96b9c3e9577554b742f412fa9ad', //TODO
				aggregation_out_value: 1000,
				sma_address: {
					address: 'msrvud1myzB5gpFds8riorVR87kpr1Ga7k'
				},
				committee_member_ids_in_script: committeeMemberIdsInScript,
				signatures
			});

			transaction.addSigner(privateKey);

            await transaction.broadcast();
		}).timeout(50000);
	});

});
