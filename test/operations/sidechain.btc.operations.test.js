import { rejects } from 'assert';
import { Echo, constants } from '../../';
import { privateKey, accountId, url } from '../_test-data';
import { BTC_INTERMEDIATE_DEPOSIT } from '../../src/constants/object-types';

const echo = new Echo();

describe('sidechain btc', () => {
	before(() => echo.connect(url));

	after(() => echo.disconnect());

	let btcAddressId;	

	describe('when we broadcast SIDECHAIN_BTC_CREATE_ADDRESS operation', () => {
		it('should create address', async () => {

			const transaction = echo.createTransaction();

			transaction.addOperation(constants.OPERATIONS_IDS.SIDECHAIN_BTC_CREATE_ADDRESS, {
            	account: accountId,
            	backup_address: 'msrvud1myzB5gpFds8riorVR87kpr1Ga7k',
			});

			transaction.addSigner(privateKey);

            const result = await transaction.broadcast();
			btcAddressId = result[0].trx.operation_results[0][1];
			
		}).timeout(50000);
	});

	describe('when we broadcast SIDECHAIN_BTC_CREATE_INTERMEDIATE_DEPOSIT operation', () => {

		it('should create intermediate deposit', async () => {
			const txInfo = {
				block_number: 598305,				
				out: {
					tx_id: '4ce18f49ba153a51bcda9bb80d7f978e3de6e81b5fc326f00465464530c052f4',
					index: 1,
					amount: 100000000,
				},
			};

			const transaction = echo.createTransaction();

			transaction.addOperation(constants.OPERATIONS_IDS.SIDECHAIN_BTC_CREATE_INTERMEDIATE_DEPOSIT, {
				committee_member_id: accountId,
				account: accountId,
				btc_address_id: btcAddressId,
				tx_info: txInfo,
			});

			transaction.addSigner(privateKey);

			await transaction.broadcast();


		}).timeout(50000);
	})

	describe('when we broadcast SIDECHAIN_BTC_DEPOSIT operation', () => {
		it('should create deposit', async () => {
			const txInfo = {
				block_number: 0,				
				out: {
					tx_id: '4ce18f49ba153a51bcda9bb80d7f978e3de6e81b5fc326f00465464530c052f4',
					index: 1,
					amount: 100000000,
				},
			};

			const transaction = echo.createTransaction();

			transaction.addOperation(constants.OPERATIONS_IDS.SIDECHAIN_BTC_DEPOSIT, {
				committee_member_id: accountId,
            	account: accountId,
				intermediate_deposit_id: `1.${BTC_INTERMEDIATE_DEPOSIT}.0`,
				tx_info: txInfo
			});

			transaction.addSigner(privateKey);

			await transaction.broadcast();

		}).timeout(50000);
	});

	describe('when we broadcast SIDECHAIN_BTC_AGGREGATE operation', () => {
		it('should throw an error sma_out > fee', async () => {
			const deposits = new Set();
			const withdrawals = new Set();
			const committeeMemberIdsInScript = new Set();
			const signatures = new Map();

			const transaction = echo.createTransaction();

			transaction.addOperation(constants.OPERATIONS_IDS.SIDECHAIN_BTC_AGGREGATE, {
				committee_member_id: '1.2.10',
				deposits,
				withdrawals,
				transaction_id: '0b46f5ce1865c14ea78a00197b40d88573b32c9a5a09c68ca60dcfebe37e0db8', //TODO
				aggregation_out_value: 1000,
				sma_address: {
					address: 'msrvud1myzB5gpFds8riorVR87kpr1Ga7k'
				},
				committee_member_ids_in_script: committeeMemberIdsInScript,
				signatures
			});

			transaction.addSigner(privateKey);

			await rejects(
				async () => await transaction.broadcast(),
				{
					message: 'Assert Exception: sma_out > fee: ',
				}
			  );
		}).timeout(50000);
	});

});
