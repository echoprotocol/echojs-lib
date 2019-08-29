import { staticVariant } from './collections';
import ISerializer from './ISerializer';
import { OPERATIONS_IDS, ECHO_ASSET_ID } from '../constants';
import { transfer, account, asset, proposal, committeeMember, vesting, balance } from './protocol';

const operationProps = {
	[OPERATIONS_IDS.TRANSFER]: transfer,
	[OPERATIONS_IDS.ACCOUNT_CREATE]: account.create,
	[OPERATIONS_IDS.ACCOUNT_UPDATE]: account.update,
	[OPERATIONS_IDS.ACCOUNT_WHITELIST]: account.whitelist,
	[OPERATIONS_IDS.ACCOUNT_TRANSFER]: account.transfer,
	[OPERATIONS_IDS.ASSET_CREATE]: asset.create,
	[OPERATIONS_IDS.ASSET_UPDATE]: asset.update,
	[OPERATIONS_IDS.ASSET_UPDATE_BITASSET]: asset.updateBitasset,
	[OPERATIONS_IDS.ASSET_UPDATE_FEED_PRODUCERS]: asset.updateFeedProducers,
	[OPERATIONS_IDS.ASSET_ISSUE]: asset.issue,
	[OPERATIONS_IDS.ASSET_RESERVE]: asset.reserve,
	[OPERATIONS_IDS.ASSET_FUND_FEE_POOL]: asset.fundFeePool,
	[OPERATIONS_IDS.ASSET_PUBLISH_FEED]: asset.publishFeed,
	[OPERATIONS_IDS.PROPOSAL_CREATE]: proposal,
	[OPERATIONS_IDS.PROPOSAL_UPDATE]: proposal.update,
	[OPERATIONS_IDS.PROPOSAL_DELETE]: proposal.delete,
	[OPERATIONS_IDS.COMMITTEE_MEMBER_CREATE]: committeeMember.create,
	[OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE]: committeeMember.update,
	[OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: committeeMember.updateGlobalParameters,
	[OPERATIONS_IDS.VESTING_BALANCE_CREATE]: vesting.balanceCreate,
	[OPERATIONS_IDS.VESTING_BALANCE_WITHDRAW]: vesting.balanceWithdraw,
	[OPERATIONS_IDS.BALANCE_CLAIM]: balance.claim,
	[OPERATIONS_IDS.OVERRIDE_TRANSFER]: new ISerializer(),
	[OPERATIONS_IDS.ASSET_CLAIM_FEES]: new ISerializer(),
	[OPERATIONS_IDS.CONTRACT_CREATE]: new ISerializer(),
	[OPERATIONS_IDS.CONTRACT_CALL]: new ISerializer(),
	[OPERATIONS_IDS.CONTRACT_TRANSFER]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_CHANGE_CONFIG]: new ISerializer(),
	[OPERATIONS_IDS.ACCOUNT_ADDRESS_CREATE]: new ISerializer(),
	[OPERATIONS_IDS.TRANSFER_TO_ADDRESS]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_ETH_CREATE_ADDRESS]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_ETH_APPROVE_ADDRESS]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_ETH_DEPOSIT]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_ETH_WITHDRAW]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_ETH_APPROVE_WITHDRAW]: new ISerializer(),
	[OPERATIONS_IDS.CONTRACT_FUND_POOL]: new ISerializer(),
	[OPERATIONS_IDS.CONTRACT_WHITELIST]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_ETH_ISSUE]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_ETH_BURN]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_ERC20_REGISTER_TOKEN]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_ERC20_DEPOSIT_TOKEN]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_ERC20_WITHDRAW_TOKEN]: new ISerializer(),
	[OPERATIONS_IDS.SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW]: new ISerializer(),
	[OPERATIONS_IDS.CONTRACT_UPDATE]: new ISerializer(),
};

const operationSerializer = staticVariant(operationProps);

/** @augments {ISerializer<any, any>} */
export default class OperationSerializer extends ISerializer {

	/**
	 * @param {any} value
	 * @param {boolean} withUnrequiredFee
	 */
	toRaw(value, withUnrequiredFee) {
		const input = value;
		if (withUnrequiredFee) {
			input[1] = {
				...input[1],
				fee: { asset_id: ECHO_ASSET_ID, amount: 0, ...input[1].fee },
			};
		}
		return operationSerializer.toRaw(input);
	}

	/**
	 * @param {any} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		return operationSerializer.appendToByteBuffer(value, bytebuffer);
	}

}
