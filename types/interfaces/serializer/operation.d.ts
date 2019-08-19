import OperationId from "../OperationId";
import * as Operations from "./operations";
import serialization from "./serialization";
import { UndefinedOptional } from "../../__helpers";

export default Operation;
type Operation<TOperationId extends OperationId, T extends serialization> =
	UndefinedOptional<TOperationId extends any ? [TOperationId, OperationProps<TOperationId, T>] : never>

export type AnyOperation<T extends serialization> = UndefinedOptional<Operation<OperationId, T>>

export type OperationProps<TOperationId extends OperationId, T extends serialization> = UndefinedOptional<{
	[OperationId.TRANSFER]: Operations.TransferProps<T>,
	[OperationId.ACCOUNT_CREATE]: Operations.CreateAccountProps<T>,
	[OperationId.ACCOUNT_UPDATE]: Operations.UpdateAccountProps<T>,
	[OperationId.ACCOUNT_WHITELIST]: Operations.WhitelistAccountProps<T>,
	[OperationId.ACCOUNT_TRANSFER]: Operations.TransferAccountProps<T>,
	[OperationId.ASSET_CREATE]: Operations.CreateAssetProps<T>,
	[OperationId.ASSET_UPDATE]: Operations.UpdateAssetProps<T>,
	[OperationId.ASSET_UPDATE_BITASSET]: Operations.UpdateAssetBitassetProps<T>,
	[OperationId.ASSET_UPDATE_FEED_PRODUCERS]: Operations.UpdateAssetFeedProducersProps<T>,
	[OperationId.ASSET_ISSUE]: Operations.IssueAssetProps<T>,
	[OperationId.ASSET_RESERVE]: Operations.ReserveAssetProps<T>,
	[OperationId.ASSET_FUND_FEE_POOL]: Operations.FundAssetFeePoolProps<T>,
	[OperationId.ASSET_PUBLISH_FEED]: Operations.PublishAssetFeedProps<T>,
	[OperationId.PROPOSAL_CREATE]: Operations.CreateProposalProps<T>,
	[OperationId.PROPOSAL_UPDATE]: Operations.UpdateProposalProps<T>,
	[OperationId.PROPOSAL_DELETE]: Operations.DeleteProposalProps<T>,
	[OperationId.COMMITTEE_MEMBER_CREATE]: Operations.CreateCommitteeMemberProps<T>,
	[OperationId.COMMITTEE_MEMBER_UPDATE]: Operations.UpdateCommitteeMemberProps<T>,
	[OperationId.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: Operations.UpdateCommitteeMemberGlobalParametersProps<T>,
	[OperationId.VESTING_BALANCE_CREATE]: Operations.CreateVestingBalanceProps<T>,
	[OperationId.VESTING_BALANCE_WITHDRAW]: Operations.WithdrawVestingBalanceProps<T>,
	[OperationId.BALANCE_CLAIM]: Operations.ClaimBalanceProps<T>,
	[OperationId.OVERRIDE_TRANSFER]: Operations.OverrideTransferProps<T>,
	[OperationId.ASSET_CLAIM_FEES]: Operations.ClaimAssetFeesProps<T>,
	[OperationId.CONTRACT_CREATE]: Operations.CreateContractProps<T>,
	[OperationId.CONTRACT_CALL]: Operations.CallContractProps<T>,
	[OperationId.CONTRACT_TRANSFER]: Operations.ContractTransferProps<T>,
	[OperationId.SIDECHAIN_CHANGE_CONFIG]: Operations.ChangeSidechainConfigProps<T>,
	[OperationId.ACCOUNT_ADDRESS_CREATE]: Operations.CreateAccountAddressProps<T>,
	[OperationId.TRANSFER_TO_ADDRESS]: Operations.TransferToAddressProps<T>,
	[OperationId.SIDECHAIN_ETH_CREATE_ADDRESS]: Operations.CreateSidechainEthAddressProps<T>,
	[OperationId.SIDECHAIN_ETH_APPROVE_ADDRESS]: Operations.ApproveSidechainEthAddressProps<T>,
	[OperationId.SIDECHAIN_ETH_DEPOSIT]: Operations.DepositSidechainEthProps<T>,
	[OperationId.SIDECHAIN_ETH_WITHDRAW]: Operations.WithdrawSidechainEthProps<T>,
	[OperationId.SIDECHAIN_ETH_APPROVE_WITHDRAW]: Operations.ApproveSidechainEthWithdrawalProps<T>,
	[OperationId.CONTRACT_FUND_POOL]: Operations.FundContractPoolProps<T>,
	[OperationId.CONTRACT_WHITELIST]: Operations.WhitelistContractProps<T>,
	[OperationId.SIDECHAIN_ETH_ISSUE]: Operations.IssueSidechainEthProps<T>,
	[OperationId.SIDECHAIN_ETH_BURN]: Operations.BurnSidechainEthProps<T>,
	[OperationId.SIDECHAIN_ERC20_REGISTER_TOKEN]: Operations.RegisterSidechainERC20TokenProps<T>,
	[OperationId.SIDECHAIN_ERC20_DEPOSIT_TOKEN]: Operations.DepositSidechainERC20TokenProps<T>,
	[OperationId.SIDECHAIN_ERC20_WITHDRAW_TOKEN]: Operations.WithdrawSidechainERC20TokenProps<T>,
	[OperationId.SIDECHAIN_ERC20_APPROVE_TOKEN_WITHDRAW]: Operations.ApproveSidechainERC20TokenWithdrawalProps<T>,
	[OperationId.CONTRACT_UPDATE]: Operations.UpdateContractProps<T>,
}[TOperationId]>;
