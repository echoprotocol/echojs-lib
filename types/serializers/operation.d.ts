import * as ByteBuffer from 'bytebuffer';
import ISerializer, { SerializerInput, SerializerOutput } from './ISerializer';
import OperationId from '../interfaces/OperationId';
import * as protocol from './protocol';

export type OperationPropsSerializer<T extends OperationId> = {
	[OperationId.TRANSFER]: typeof protocol.transfer.default,
	[OperationId.ACCOUNT_CREATE]: typeof protocol.account.create,
	[OperationId.ACCOUNT_UPDATE]: typeof protocol.account.update,
	[OperationId.ACCOUNT_WHITELIST]: typeof protocol.account.whitelist,
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
	[OperationId.COMMITTEE_MEMBER_ACTIVATE]: typeof protocol.committeeMember.activate,
	[OperationId.COMMITTEE_MEMBER_DEACTIVATE]: typeof protocol.committeeMember.deactivate,
	[OperationId.COMMITTEE_FROZEN_BALANCE_DEPOSIT]: typeof protocol.committeeFrozenBalance.deposit,
	[OperationId.COMMITTEE_FROZEN_BALANCE_WITHDRAW]: typeof protocol.committeeFrozenBalance.withdraw,
	[OperationId.VESTING_BALANCE_CREATE]: typeof protocol.vesting.balanceCreate,
	[OperationId.VESTING_BALANCE_WITHDRAW]: typeof protocol.vesting.balanceWithdraw,
	[OperationId.BALANCE_CLAIM]: typeof protocol.balance.claim,
	[OperationId.BALANCE_FREEZE]: typeof protocol.balance.freeze,
	[OperationId.BALANCE_UNFREEZE]: typeof protocol.balance.unfreeze,
	[OperationId.REQUEST_BALANCE_UNFREEZE]: typeof protocol.balance.requestUnfreeze,
	[OperationId.OVERRIDE_TRANSFER]: typeof protocol.transfer.override,
	[OperationId.ASSET_CLAIM_FEES]: typeof protocol.asset.claimFees,
	[OperationId.CONTRACT_CREATE]: typeof protocol.contract.create,
	[OperationId.CONTRACT_CALL]: typeof protocol.contract.call,
	[OperationId.CONTRACT_INTERNAL_CREATE]: typeof protocol.contract.internalCreate,
	[OperationId.CONTRACT_INTERNAL_CALL]: typeof protocol.contract.internalCall,
	[OperationId.CONTRACT_SELFDESTRUCT]: typeof protocol.contract.selfdestruct,
	[OperationId.CONTRACT_UPDATE]: typeof protocol.contract.update,
	[OperationId.ACCOUNT_ADDRESS_CREATE]: typeof protocol.account.addressCreate,
	[OperationId.TRANSFER_TO_ADDRESS]: typeof protocol.transfer.toAddress,
	[OperationId.SIDECHAIN_ETH_CREATE_ADDRESS]: typeof protocol.sidechain.eth.createAddress,
	[OperationId.SIDECHAIN_ETH_APPROVE_ADDRESS]: typeof protocol.sidechain.eth.approveAddress,
	[OperationId.SIDECHAIN_ETH_DEPOSIT]: typeof protocol.sidechain.eth.deposit,
	[OperationId.SIDECHAIN_ETH_SEND_DEPOSIT]: typeof protocol.sidechain.eth.sendDeposit,
	[OperationId.SIDECHAIN_ETH_WITHDRAW]: typeof protocol.sidechain.eth.withdraw,
	[OperationId.SIDECHAIN_ETH_SEND_WITHDRAW]: typeof protocol.sidechain.eth.sendWithdraw,
	[OperationId.SIDECHAIN_ETH_APPROVE_WITHDRAW]: typeof protocol.sidechain.eth.approveWithdraw,
	[OperationId.SIDECHAIN_ETH_UPDATE_CONTRACT_ADDRESS]: typeof protocol.sidechain.eth.updateContractAddress,
	[OperationId.CONTRACT_FUND_POOL]: typeof protocol.contract.fundPool,
	[OperationId.CONTRACT_WHITELIST]: typeof protocol.contract.whitelist,
	[OperationId.SIDECHAIN_ISSUE]: typeof protocol.sidechain.issue,
	[OperationId.SIDECHAIN_BURN]: typeof protocol.sidechain.burn,
	[OperationId.SIDECHAIN_ERC20_REGISTER_TOKEN]: typeof protocol.sidechain.erc20.registerToken,
	[OperationId.SIDECHAIN_ERC20_DEPOSIT_TOKEN]: typeof protocol.sidechain.erc20.depositToken,
	[OperationId.SIDECHAIN_ERC20_SEND_DEPOSIT_TOKEN]: typeof protocol.sidechain.erc20.sendDepositToken,
	[OperationId.SIDECHAIN_ERC20_WITHDRAW_TOKEN]: typeof protocol.sidechain.erc20.withdrawToken,
	[OperationId.SIDECHAIN_ERC20_SEND_WITHDRAW_TOKEN]: typeof protocol.sidechain.erc20.withdrawToken,
	[OperationId.SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW]: typeof protocol.sidechain.erc20.approveTokenWithdraw,
	[OperationId.SIDECHAIN_ERC20_ISSUE]: typeof protocol.sidechain.erc20.issue,
	[OperationId.SIDECHAIN_ERC20_BURN]: typeof protocol.sidechain.erc20.burn,
	[OperationId.SIDECHAIN_BTC_CREATE_ADDRESS]: typeof protocol.sidechain.btc.createAddress,
	[OperationId.SIDECHAIN_BTC_CREATE_INTERMEDIATE_DEPOSIT]: typeof protocol.sidechain.btc.createIntermediateDeposit,
	[OperationId.SIDECHAIN_BTC_INTERMEDIATE_DEPOSIT]: typeof protocol.sidechain.btc.intermediateDeposit,
	[OperationId.SIDECHAIN_BTC_DEPOSIT]: typeof protocol.sidechain.btc.deposit,
	[OperationId.SIDECHAIN_BTC_WITHDRAW]: typeof protocol.sidechain.btc.withdraw,
	[OperationId.SIDECHAIN_BTC_AGGREGATE]: typeof protocol.sidechain.btc.aggregate,
	[OperationId.SIDECHAIN_BTC_APPROVE_AGGREGATE]: typeof protocol.sidechain.btc.approveAggregate,
	[OperationId.BLOCK_REWARD]: typeof protocol.blockReward,
	[OperationId.EVM_ADDRESS_REGISTER]: typeof protocol.evmAddress,
	[OperationId.DID_CREATE_OPERATION]: typeof protocol.did.create,
	[OperationId.DID_UPDATE_OPERATION]: typeof protocol.did.update,
	[OperationId.DID_DELETE_OPERATION]: typeof protocol.did.delete,
}[T];

type OperationInput<T extends OperationId> = SerializerInput<OperationPropsSerializer<T>>;

export type TOperationInput<T extends OperationId, TWithUnrequiredFee extends boolean> = [
	T,
	TWithUnrequiredFee extends false ?
		OperationInput<T> :
		Omit<OperationInput<T>, 'fee'> & { fee?: Partial<OperationInput<T>['fee']> }
];

export type TOperationOutput<T extends OperationId> = [T, SerializerOutput<OperationPropsSerializer<T>>];

export default class OperationSerializer extends ISerializer<
	TOperationInput<OperationId, boolean>,
	TOperationOutput<OperationId>
> {
	toRaw<T extends OperationId>(value: TOperationInput<T, false>): TOperationOutput<T>;
	toRaw<T extends OperationId>(value: TOperationInput<T, true>, withUnrequiredFee: true): TOperationOutput<T>;
	appendToByteBuffer<T extends OperationId>(value: TOperationInput<T, false>, bytebuffer: ByteBuffer): void;

	readFromBuffer<T extends OperationId>(
		buffer: Buffer,
		offset?: number,
	): { res: TOperationOutput<T>, newOffset: number };
}
