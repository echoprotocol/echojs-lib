import { staticVariant } from './collections';
import ISerializer from './ISerializer';
import { OPERATIONS_IDS, ECHO_ASSET_ID } from '../constants';
import * as protocol from './protocol';

const operationProps = {
	[OPERATIONS_IDS.TRANSFER]: protocol.transfer.default,
	[OPERATIONS_IDS.ACCOUNT_CREATE]: protocol.account.create,
	[OPERATIONS_IDS.ACCOUNT_UPDATE]: protocol.account.update,
	[OPERATIONS_IDS.ACCOUNT_WHITELIST]: protocol.account.whitelist,
	[OPERATIONS_IDS.ASSET_CREATE]: protocol.asset.create,
	[OPERATIONS_IDS.ASSET_UPDATE]: protocol.asset.update,
	[OPERATIONS_IDS.ASSET_UPDATE_BITASSET]: protocol.asset.updateBitasset,
	[OPERATIONS_IDS.ASSET_UPDATE_FEED_PRODUCERS]: protocol.asset.updateFeedProducers,
	[OPERATIONS_IDS.ASSET_ISSUE]: protocol.asset.issue,
	[OPERATIONS_IDS.ASSET_RESERVE]: protocol.asset.reserve,
	[OPERATIONS_IDS.ASSET_FUND_FEE_POOL]: protocol.asset.fundFeePool,
	[OPERATIONS_IDS.ASSET_PUBLISH_FEED]: protocol.asset.publishFeed,
	[OPERATIONS_IDS.PROPOSAL_CREATE]: protocol.proposal.create,
	[OPERATIONS_IDS.PROPOSAL_UPDATE]: protocol.proposal.update,
	[OPERATIONS_IDS.PROPOSAL_DELETE]: protocol.proposal.delete,
	[OPERATIONS_IDS.COMMITTEE_MEMBER_CREATE]: protocol.committeeMember.create,
	[OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE]: protocol.committeeMember.update,
	[OPERATIONS_IDS.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: protocol.committeeMember.updateGlobalParameters,
	[OPERATIONS_IDS.VESTING_BALANCE_CREATE]: protocol.vesting.balanceCreate,
	[OPERATIONS_IDS.VESTING_BALANCE_WITHDRAW]: protocol.vesting.balanceWithdraw,
	[OPERATIONS_IDS.BALANCE_CLAIM]: protocol.balance.claim,
	[OPERATIONS_IDS.BALANCE_FREEZE]: protocol.balance.freeze,
	[OPERATIONS_IDS.OVERRIDE_TRANSFER]: protocol.transfer.override,
	[OPERATIONS_IDS.ASSET_CLAIM_FEES]: protocol.asset.claimFees,
	[OPERATIONS_IDS.CONTRACT_CREATE]: protocol.contract.create,
	[OPERATIONS_IDS.CONTRACT_CALL]: protocol.contract.call,
	[OPERATIONS_IDS.CONTRACT_TRANSFER]: protocol.contract.transfer,
	[OPERATIONS_IDS.CONTRACT_UPDATE]: protocol.contract.update,
	[OPERATIONS_IDS.ACCOUNT_ADDRESS_CREATE]: protocol.account.addressCreate,
	[OPERATIONS_IDS.TRANSFER_TO_ADDRESS]: protocol.transfer.toAddress,
	[OPERATIONS_IDS.SIDECHAIN_ETH_CREATE_ADDRESS]: protocol.sidechain.eth.createAddress,
	[OPERATIONS_IDS.SIDECHAIN_ETH_APPROVE_ADDRESS]: protocol.sidechain.eth.approveAddress,
	[OPERATIONS_IDS.SIDECHAIN_ETH_DEPOSIT]: protocol.sidechain.eth.deposit,
	[OPERATIONS_IDS.SIDECHAIN_ETH_WITHDRAW]: protocol.sidechain.eth.withdraw,
	[OPERATIONS_IDS.SIDECHAIN_ETH_APPROVE_WITHDRAW]: protocol.sidechain.eth.approveWithdraw,
	[OPERATIONS_IDS.CONTRACT_FUND_POOL]: protocol.contract.fundPool,
	[OPERATIONS_IDS.CONTRACT_WHITELIST]: protocol.contract.whitelist,
	[OPERATIONS_IDS.SIDECHAIN_ISSUE]: protocol.sidechain.issue,
	[OPERATIONS_IDS.SIDECHAIN_BURN]: protocol.sidechain.burn,
	[OPERATIONS_IDS.SIDECHAIN_ERC20_REGISTER_TOKEN]: protocol.sidechain.erc20.registerToken,
	[OPERATIONS_IDS.SIDECHAIN_ERC20_DEPOSIT_TOKEN]: protocol.sidechain.erc20.depositToken,
	[OPERATIONS_IDS.SIDECHAIN_ERC20_WITHDRAW_TOKEN]: protocol.sidechain.erc20.withdrawToken,
	[OPERATIONS_IDS.SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW]: protocol.sidechain.erc20.approveTokenWithdraw,
	[OPERATIONS_IDS.SIDECHAIN_BTC_CREATE_ADDRESS]: protocol.sidechain.btc.createAddress,
	[OPERATIONS_IDS.SIDECHAIN_BTC_INTERMEDIATE_DEPOSIT]: protocol.sidechain.btc.intermediateDeposit,
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

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: any, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) { return operationSerializer.readFromBuffer(buffer, offset); }

}
