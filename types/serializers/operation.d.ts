import * as ByteBuffer from 'bytebuffer';
import ISerializer, { SerializerInput, SerializerOutput } from './ISerializer';
import OperationId from '../interfaces/OperationId';
import { transfer, account, asset, proposal, committeeMember, vesting, balance } from './protocol';

export type OperationPropsSerializer<T extends OperationId> = {
	[OperationId.TRANSFER]: typeof transfer,
	[OperationId.ACCOUNT_CREATE]: typeof account.create,
	[OperationId.ACCOUNT_UPDATE]: typeof account.update,
	[OperationId.ACCOUNT_WHITELIST]: typeof account.whitelist,
	[OperationId.ACCOUNT_TRANSFER]: typeof account.transfer,
	[OperationId.ASSET_CREATE]: typeof asset.create,
	[OperationId.ASSET_UPDATE]: typeof asset.update,
	[OperationId.ASSET_UPDATE_BITASSET]: typeof asset.updateBitasset,
	[OperationId.ASSET_UPDATE_FEED_PRODUCERS]: typeof asset.updateFeedProducers,
	[OperationId.ASSET_ISSUE]: typeof asset.issue,
	[OperationId.ASSET_RESERVE]: typeof asset.reserve,
	[OperationId.ASSET_FUND_FEE_POOL]: typeof asset.fundFeePool,
	[OperationId.ASSET_PUBLISH_FEED]: typeof asset.publishFeed,
	[OperationId.PROPOSAL_CREATE]: typeof proposal.create,
	[OperationId.PROPOSAL_UPDATE]: typeof proposal.update,
	[OperationId.PROPOSAL_DELETE]: typeof proposal.delete,
	[OperationId.COMMITTEE_MEMBER_CREATE]: typeof committeeMember.create,
	[OperationId.COMMITTEE_MEMBER_UPDATE]: typeof committeeMember.update,
	[OperationId.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: typeof committeeMember.updateGlobalParameters,
	[OperationId.VESTING_BALANCE_CREATE]: typeof vesting.balanceCreate,
	[OperationId.VESTING_BALANCE_WITHDRAW]: typeof vesting.balanceWithdraw,
	[OperationId.BALANCE_CLAIM]: typeof balance.claim,
	[OperationId.OVERRIDE_TRANSFER]: ISerializer,
	[OperationId.ASSET_CLAIM_FEES]: ISerializer,
	[OperationId.CONTRACT_CREATE]: ISerializer,
	[OperationId.CONTRACT_CALL]: ISerializer,
	[OperationId.CONTRACT_TRANSFER]: ISerializer,
	[OperationId.SIDECHAIN_CHANGE_CONFIG]: ISerializer,
	[OperationId.ACCOUNT_ADDRESS_CREATE]: ISerializer,
	[OperationId.TRANSFER_TO_ADDRESS]: ISerializer,
	[OperationId.SIDECHAIN_ETH_CREATE_ADDRESS]: ISerializer,
	[OperationId.SIDECHAIN_ETH_APPROVE_ADDRESS]: ISerializer,
	[OperationId.SIDECHAIN_ETH_DEPOSIT]: ISerializer,
	[OperationId.SIDECHAIN_ETH_WITHDRAW]: ISerializer,
	[OperationId.SIDECHAIN_ETH_APPROVE_WITHDRAW]: ISerializer,
	[OperationId.CONTRACT_FUND_POOL]: ISerializer,
	[OperationId.CONTRACT_WHITELIST]: ISerializer,
	[OperationId.SIDECHAIN_ETH_ISSUE]: ISerializer,
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
