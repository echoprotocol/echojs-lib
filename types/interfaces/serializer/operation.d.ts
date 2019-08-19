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
	[OperationId.LIMIT_ORDER_CREATE]: Operations.CreateLimitOrderProps<T>,
	[OperationId.LIMIT_ORDER_CANCEL]: Operations.CancelLimitOrderProps<T>,
	[OperationId.CALL_ORDER_UPDATE]: Operations.CallOrderUpdateProps<T>,
	[OperationId.FILL_ORDER]: Operations.FillOrderProps<T>,
	[OperationId.ACCOUNT_CREATE]: Operations.CreateAccountProps<T>,
	[OperationId.ACCOUNT_UPDATE]: Operations.UpdateAccountProps<T>,
	[OperationId.ACCOUNT_WHITELIST]: Operations.WhitelistAccountProps<T>,
	[OperationId.ACCOUNT_UPGRADE]: Operations.UpgradeAccountProps<T>,
	[OperationId.ACCOUNT_TRANSFER]: Operations.TransferAccountProps<T>,
	[OperationId.ASSET_CREATE]: Operations.CreateAssetProps<T>,
	[OperationId.ASSET_UPDATE]: Operations.UpdateAssetProps<T>,
	[OperationId.ASSET_UPDATE_BITASSET]: Operations.UpdateAssetBitassetProps<T>,
	[OperationId.ASSET_UPDATE_FEED_PRODUCERS]: Operations.UpdateAssetFeedProducersProps<T>,
	[OperationId.ASSET_ISSUE]: Operations.IssueAssetProps<T>,
	[OperationId.ASSET_RESERVE]: Operations.ReserveAssetProps<T>,
	[OperationId.ASSET_FUND_FEE_POOL]: Operations.FundAssetFeePoolProps<T>,
	[OperationId.ASSET_SETTLE]: Operations.SettleAssetProps<T>,
	[OperationId.ASSET_GLOBAL_SETTLE]: Operations.SettleAssetGloballyProps<T>,
	[OperationId.ASSET_PUBLISH_FEED]: Operations.PublishAssetFeedProps<T>,
	[OperationId.PROPOSAL_CREATE]: Operations.CreateProposalProps<T>,
	[OperationId.PROPOSAL_UPDATE]: Operations.UpdateProposalProps<T>,
	[OperationId.PROPOSAL_DELETE]: Operations.DeleteProposalProps<T>,
	[OperationId.WITHDRAW_PERMISSION_CREATE]: Operations.CreateWithdrawPermissionProps<T>,
	[OperationId.WITHDRAW_PERMISSION_UPDATE]: Operations.UpdateWithdrawPermissionProps<T>,
	[OperationId.WITHDRAW_PERMISSION_CLAIM]: Operations.ClaimWithdrawPermissionProps<T>,
	[OperationId.WITHDRAW_PERMISSION_DELETE]: Operations.DeleteWithdrawPermissionProps<T>,
	[OperationId.COMMITTEE_MEMBER_CREATE]: Operations.CreateCommitteeMemberProps<T>,
	[OperationId.COMMITTEE_MEMBER_UPDATE]: Operations.UpdateCommitteeMemberProps<T>,
	[OperationId.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: Operations.UpdateCommitteeMemberGlobalParametersProps<T>,
	[OperationId.VESTING_BALANCE_CREATE]: Operations.CreateVestingBalanceProps<T>,
	[OperationId.VESTING_BALANCE_WITHDRAW]: Operations.WithdrawVestingBalanceProps<T>,
	[OperationId.CUSTOM]: Operations.CustomProps<T>,
	[OperationId.ASSERT]: Operations.AssertProps<T>,
	[OperationId.BALANCE_CLAIM]: Operations.ClaimBalanceProps<T>,
	[OperationId.OVERRIDE_TRANSFER]: Operations.OverrideTransferProps<T>,
	[OperationId.ASSET_SETTLE_CANCEL]: Operations.CancelAssetSettlementProps<T>,
	[OperationId.ASSET_CLAIM_FEES]: Operations.ClaimAssetFeesProps<T>,
	[OperationId.BID_COLLATERAL]: Operations.BidCollateralProps<T>,
	[OperationId.EXECUTE_BID]: Operations.ExecuteBidProps<T>,
	[OperationId.CREATE_CONTRACT]: Operations.CreateContractProps<T>,
	[OperationId.CALL_CONTRACT]: Operations.CallContractProps<T>,
	[OperationId.CONTRACT_TRANSFER]: Operations.ContractTransferProps<T>,
	[OperationId.CHANGE_SIDECHAIN_CONFIG]: Operations.ChangeSidechainConfigProps<T>,
	[OperationId.ACCOUNT_ADDRESS_CREATE]: Operations.CreateAccountAddressProps<T>,
	[OperationId.TRANSFER_TO_ADDRESS]: Operations.TransferToAddressProps<T>,
	[OperationId.GENERATE_ETH_ADDRESS]: Operations.GenerateEthAddressProps<T>,
	[OperationId.CREATE_ETH_ADDRESS]: Operations.CreateEthAddressProps<T>,
	[OperationId.DEPOSIT_ETH]: Operations.DepositEthProps<T>,
	[OperationId.WITHDRAW_ETH]: Operations.WithdrawEthProps<T>,
	[OperationId.APPROVE_WITHDRAW_ETH]: Operations.ApproveEthWithdrawalProps<T>,
	[OperationId.CONTRACT_FUND_POOL]: Operations.FundContractPoolProps<T>,
	[OperationId.CONTRACT_WHITELIST]: Operations.WhitelistContractProps<T>,
	[OperationId.SIDECHAIN_ISSUE]: Operations.IssueSidechainProps<T>,
	[OperationId.SIDECHAIN_BURN]: Operations.BurnSidechainProps<T>,
	[OperationId.REGISTER_ERC20_TOKEN]: Operations.RegisterERC20TokenProps<T>,
	[OperationId.DEPOSIT_ERC20_TOKEN]: Operations.DepositERC20TokenProps<T>,
	[OperationId.WITHDRAW_ERC20_TOKEN]: Operations.WithdrawERC20TokenProps<T>,
	[OperationId.APPROVE_ERC20_TOKEN_WITHDRAW]: Operations.ApproveERC20TokenWithdrawalProps<T>,
	[OperationId.CONTRACT_UPDATE]: Operations.UpdateContractProps<T>,
}[TOperationId]>;
