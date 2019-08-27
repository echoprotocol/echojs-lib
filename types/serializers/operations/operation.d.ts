import * as ByteBuffer from "bytebuffer";
import * as props from "./props";
import ISerializer, { SerializerInput, SerializerOutput } from "../ISerializer";
import OperationId from "../../interfaces/OperationId";

export type OperationPropsSerializer<T extends OperationId> = {
	[OperationId.TRANSFER]: typeof props.transfer,
	[OperationId.ACCOUNT_CREATE]: typeof props.accountCreate,
	[OperationId.ACCOUNT_UPDATE]: typeof props.accountUpdate,
	[OperationId.ACCOUNT_WHITELIST]: typeof props.accountWhitelist,
	[OperationId.ACCOUNT_TRANSFER]: typeof props.accountTransfer,
	[OperationId.ASSET_CREATE]: typeof props.assetCreate,
	[OperationId.ASSET_UPDATE]: typeof props.assetUpdate,
	[OperationId.ASSET_UPDATE_BITASSET]: typeof props.assetUpdateBitasset,
	[OperationId.ASSET_UPDATE_FEED_PRODUCERS]: typeof props.assetUpdateFeedProducers,
	[OperationId.ASSET_ISSUE]: typeof props.assetIssue,
	[OperationId.ASSET_RESERVE]: typeof props.assetReserve,
	[OperationId.ASSET_FUND_FEE_POOL]: typeof props.assetFundFeePool,
	[OperationId.ASSET_PUBLISH_FEED]: typeof props.assetPublishFeed,
	[OperationId.PROPOSAL_CREATE]: typeof props.proposalCreate,
	[OperationId.PROPOSAL_UPDATE]: typeof props.proposalUpdate,
	[OperationId.PROPOSAL_DELETE]: ISerializer,
	[OperationId.COMMITTEE_MEMBER_CREATE]: ISerializer,
	[OperationId.COMMITTEE_MEMBER_UPDATE]: ISerializer,
	[OperationId.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: ISerializer,
	[OperationId.VESTING_BALANCE_CREATE]: ISerializer,
	[OperationId.VESTING_BALANCE_WITHDRAW]: ISerializer,
	[OperationId.BALANCE_CLAIM]: ISerializer,
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

type TInput<T extends OperationId, TWithUnrequiredFee extends boolean> = [
	T,
	TWithUnrequiredFee extends false ?
		OperationInput<T> :
		Omit<OperationInput<T>, 'fee'> & { fee?: Partial<OperationInput<T>['fee']> },
];

type TOutput<T extends OperationId> = [T, SerializerOutput<OperationPropsSerializer<T>>];

export default class OperationSerializer extends ISerializer<
	TInput<OperationId, boolean>,
	TOutput<OperationId>
> {
	toRaw<T extends OperationId, TWithUnrequiredFee extends boolean>(
		value: TInput<T, TWithUnrequiredFee>,
		...options: TWithUnrequiredFee extends true ? [true] : [],
	): TOutput<T>;

	appendToByteBuffer<T extends OperationId>(value: TInput<T, false>, bytebuffer: ByteBuffer): void;
}
