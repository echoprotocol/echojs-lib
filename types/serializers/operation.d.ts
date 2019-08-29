import * as ByteBuffer from 'bytebuffer';
import ISerializer, { SerializerInput, SerializerOutput } from './ISerializer';
import OperationId from '../interfaces/OperationId';
import * as protocol from './protocol';

export type OperationPropsSerializer<T extends OperationId> = {
	[OperationId.TRANSFER]: typeof protocol.transfer.default,
	[OperationId.ACCOUNT_CREATE]: typeof protocol.account.create,
	[OperationId.ACCOUNT_UPDATE]: typeof protocol.account.update,
	[OperationId.ACCOUNT_WHITELIST]: typeof protocol.account.whitelist,
	[OperationId.ACCOUNT_TRANSFER]: typeof protocol.account.transfer,
	[OperationId.ASSET_CREATE]: typeof protocol.asset.create,
	[OperationId.ASSET_UPDATE]: typeof protocol.asset.update,
	[OperationId.ASSET_UPDATE_BITASSET]: typeof protocol.asset.updateBitasset,
	[OperationId.ASSET_UPDATE_FEED_PRODUCERS]: typeof protocol.asset.updateFeedProducers,
	[OperationId.ASSET_ISSUE]: typeof protocol.asset.issue,
	[OperationId.ASSET_RESERVE]: typeof protocol.asset.reserve,
	[OperationId.ASSET_FUND_FEE_POOL]: typeof protocol.asset.fundFeePool,
	[OperationId.ASSET_PUBLISH_FEED]: typeof protocol.asset.publishFeed,
	[OperationId.PROPOSAL_CREATE]: typeof protocol.proposal.create,
	[OperationId.PROPOSAL_UPDATE]: typeof protocol.proposal.update,
	[OperationId.PROPOSAL_DELETE]: typeof protocol.proposal.delete,
	[OperationId.COMMITTEE_MEMBER_CREATE]: typeof protocol.committeeMember.create,
	[OperationId.COMMITTEE_MEMBER_UPDATE]: typeof protocol.committeeMember.update,
	[OperationId.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: typeof protocol.committeeMember.updateGlobalParameters,
	[OperationId.VESTING_BALANCE_CREATE]: typeof protocol.vesting.balanceCreate,
	[OperationId.VESTING_BALANCE_WITHDRAW]: typeof protocol.vesting.balanceWithdraw,
	[OperationId.BALANCE_CLAIM]: typeof protocol.balance.claim,
	[OperationId.OVERRIDE_TRANSFER]: typeof protocol.transfer.override,
	[OperationId.ASSET_CLAIM_FEES]: typeof protocol.asset.claimFees,
	[OperationId.CONTRACT_CREATE]: typeof protocol.contract.create,
	[OperationId.CONTRACT_CALL]: typeof protocol.contract.call,
	[OperationId.CONTRACT_TRANSFER]: typeof protocol.contract.transfer,
	[OperationId.SIDECHAIN_CHANGE_CONFIG]: typeof protocol.sidechain.changeConfig,
	[OperationId.ACCOUNT_ADDRESS_CREATE]: typeof protocol.account.addressCreate,
	[OperationId.TRANSFER_TO_ADDRESS]: typeof protocol.transfer.toAddress,
	[OperationId.SIDECHAIN_ETH_CREATE_ADDRESS]: typeof protocol.sidechain.ethCreateAddress,
	[OperationId.SIDECHAIN_ETH_APPROVE_ADDRESS]: typeof protocol.sidechain.ethApproveAddress,
	[OperationId.SIDECHAIN_ETH_DEPOSIT]: typeof protocol.sidechain.ethDeposit,
	[OperationId.SIDECHAIN_ETH_WITHDRAW]: typeof protocol.sidechain.ethWithdraw,
	[OperationId.SIDECHAIN_ETH_APPROVE_WITHDRAW]: typeof protocol.sidechain.ethApproveWithdraw,
	[OperationId.CONTRACT_FUND_POOL]: typeof protocol.contract.fundPool,
	[OperationId.CONTRACT_WHITELIST]: typeof protocol.contract.whitelist,
	[OperationId.SIDECHAIN_ETH_ISSUE]: typeof protocol.sidechain.ethIssue,
	[OperationId.SIDECHAIN_ETH_BURN]: ISerializer,
	[OperationId.SIDECHAIN_ERC20_REGISTER_TOKEN]: ISerializer,
	[OperationId.SIDECHAIN_ERC20_DEPOSIT_TOKEN]: ISerializer,
	[OperationId.SIDECHAIN_ERC20_WITHDRAW_TOKEN]: ISerializer,
	[OperationId.SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW]: ISerializer,
	[OperationId.CONTRACT_UPDATE]: ISerializer,
}[T];

type OperationInput<T extends OperationId> = SerializerInput<OperationPropsSerializer<T>>;

export type TOperationInput<T extends OperationId, TWithUnrequiredFee extends boolean> = [
	T,
	TWithUnrequiredFee extends false ? OperationInput<T> : (
		'fee' extends keyof OperationInput<T> ?
			Omit<OperationInput<T>, 'fee'> & { fee?: Partial<OperationInput<T>['fee']> } :
			OperationInput<T>
	),
];

export type TOperationOutput<T extends OperationId> = [T, SerializerOutput<OperationPropsSerializer<T>>];

export default class OperationSerializer extends ISerializer<
	TOperationInput<OperationId, boolean>,
	TOperationOutput<OperationId>
> {
	toRaw<T extends OperationId>(value: TOperationInput<T, false>): TOperationOutput<T>;
	toRaw<T extends OperationId>(value: TOperationInput<T, true>, withUnrequiredFee: true): TOperationOutput<T>;
	appendToByteBuffer<T extends OperationId>(value: TOperationInput<T, false>, bytebuffer: ByteBuffer): void;
}
