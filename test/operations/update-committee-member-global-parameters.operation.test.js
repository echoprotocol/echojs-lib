import { Echo, OPERATIONS_IDS } from "../../src";
import { fail, strictEqual, ok } from "assert";
import { url } from "../_test-data";

describe('update committee member global parameters', () => {
	const echo = new Echo();
	before(async () => await echo.connect(url));
	after(async () => await echo.disconnect());
	describe('when fee schedule parameters element value is invalid', () => {
		/** @type {Error} */
		let serializationError;
		it('serialization should rejects', () => {
			try {
				echo.createTransaction().addOperation(OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS, {
					new_parameters: {
						current_fees: {
							parameters: [[OPERATIONS_IDS.TRANSFER, null]],
							scale: 0,
						},
						maintenance_interval: 0,
						maintenance_skip_slots: 0,
						committee_proposal_review_period: 0,
						maximum_transaction_size: 0,
						maximum_block_size: 0,
						maximum_time_until_expiration: 0,
						maximum_proposal_lifetime: 0,
						maximum_asset_whitelist_authorities: 0,
						maximum_asset_feed_publishers: 0,
						maximum_committee_count: 0,
						maximum_authority_membership: 0,
						reserve_percent_of_fee: 0,
						network_percent_of_fee: 0,
						cashback_vesting_period_seconds: 0,
						max_predicate_opcode: 0,
						accounts_per_fee_scale: 0,
						account_fee_scale_bitshifts: 0,
						max_authority_depth: 0,
						echorand_config: {
							_time_net_1mb: 0,
							_time_net_256b: 0,
							_creator_count: 0,
							_verifier_count: 0,
							_ok_threshold: 0,
							_max_bba_steps: 0,
							_gc1_delay: 0,
						},
						sidechain_config: {
							echo_contract_id: '1.14.0',
							echo_vote_method: '',
							echo_sign_method: '',
							echo_transfer_topic: '',
							echo_transfer_ready_topic: '',
							eth_contract_address: '',
							eth_committee_method: '',
							eth_transfer_topic: '',
						},
						gas_price: {
							price: 0,
							gas_amount: 0,
						},
					}
				});
			} catch (error) {
				serializationError = error;
				return;
			}
			fail('should rejects');
		});
		it('instance of Error', function () {
			if (!serializationError) this.skip();
			ok(serializationError instanceof Error);
		});
		const expectedErrorMessage = [
			'operation with id 18',
			'key "new_parameters"',
			'key "current_fees"',
			'key "parameters"',
			'set element with index 0',
			'static variant',
			'serializable object is not a object',
		].join(': ');
		it(`with message "${expectedErrorMessage}"`, function () {
			if (!serializationError || !(serializationError instanceof Error)) this.skip();
			else strictEqual(serializationError.message, expectedErrorMessage);
		});
	});
});
