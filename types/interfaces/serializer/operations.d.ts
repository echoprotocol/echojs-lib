import * as basic_type from "./basic-types";
import * as composit_type from "./composit-types";
import Operation, { AnyOperation } from "./operation";
import predicate from "./predicate";
import serialization, { serialization_input } from "./serialization";
import { vesting_policy, VestingPolicyInitializer } from "./vesting-policy";
import OperationId from "../OperationId";

export interface TransferProps<T extends serialization> {
	fee: composit_type.asset<T>,
	from: basic_type.account_id,
	to: basic_type.account_id,
	amount: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface CreateLimitOrderProps<T extends serialization> {
	fee: composit_type.asset<T>,
	seller: basic_type.account_id,
	amount_to_sell: composit_type.asset<T>,
	min_to_receive: composit_type.asset<T>,
	expiration: basic_type.time_point_sec<T>,
	fill_or_kill: basic_type.bool,
	extensions: composit_type.extensions<T>,
}

export interface CancelLimitOrderProps<T extends serialization> {
	fee: composit_type.asset<T>,
	fee_paying_account: basic_type.account_id,
	order: basic_type.limit_order_id,
	extensions: composit_type.extensions<T>,
}

export interface CallOrderUpdateProps<T extends serialization> {
	fee: composit_type.asset<T>,
	funding_account: basic_type.account_id,
	delta_collateral: composit_type.asset<T>,
	delta_debt: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface FillOrderProps<T extends serialization> {
	fee: composit_type.asset<T>,
	order_id: basic_type.object_id,
	account_id: basic_type.account_id,
	pays: composit_type.asset<T>,
	receives: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface CreateAccountProps<T extends serialization> {
	fee: composit_type.asset<T>,
	registrar: basic_type.account_id,
	referrer: basic_type.account_id,
	referrer_percent: basic_type.uint16<T>,
	name: string,
	active: composit_type.authority<T>,
	echorand_key: basic_type.public_key<T>,
	options: composit_type.account_options<T>,
	extensions: composit_type.extensions<T>,
}

export interface UpdateAccountProps<T extends serialization> {
	fee: composit_type.asset<T>,
	account: basic_type.account_id,
	active: basic_type.optional<composit_type.authority<T>>,
	echorand_key: basic_type.optional<basic_type.public_key<T>>,
	new_options: basic_type.optional<composit_type.account_options<T>>,
	extensions: composit_type.extensions<T>,
}

export interface WhitelistAccountProps<T extends serialization> {
	fee: composit_type.asset<T>,
	authorizing_account: basic_type.account_id,
	account_to_list: basic_type.account_id,
	new_listing: basic_type.uint8<T>,
	extensions: composit_type.extensions<T>,
}

export interface UpgradeAccountProps<T extends serialization> {
	fee: composit_type.asset<T>,
	account_to_upgrade: basic_type.account_id,
	upgrade_to_lifetime_member: basic_type.bool,
	extensions: composit_type.extensions<T>,
}

export interface TransferAccountProps<T extends serialization> {
	fee: composit_type.asset<T>,
	account_id: basic_type.account_id,
	new_owner: basic_type.account_id,
	extensions: composit_type.extensions<T>,
}

export interface CreateAssetProps<T extends serialization> {
	fee: composit_type.asset<T>,
	issuer: basic_type.account_id,
	symbol: string,
	precision: basic_type.uint8<T>,
	common_options: composit_type.asset_options<T>,
	bitasset_opts: basic_type.optional<composit_type.bitasset_options<T>>,
	is_prediction_market: basic_type.bool,
	extensions: composit_type.extensions<T>,
}

export interface UpdateAssetProps<T extends serialization> {
	fee: composit_type.asset<T>,
	issuer: basic_type.account_id,
	asset_to_update: basic_type.asset_id,
	new_issuer: basic_type.optional<basic_type.account_id>,
	new_options: composit_type.asset_options<T>,
	extensions: composit_type.extensions<T>,
}

export interface UpdateAssetBitassetProps<T extends serialization> {
	fee: composit_type.asset<T>,
	issuer: basic_type.account_id,
	asset_to_update: basic_type.asset_id,
	new_options: composit_type.bitasset_options<T>,
	extensions: composit_type.extensions<T>,
}

export interface UpdateAssetFeedProducersProps<T extends serialization> {
	fee: composit_type.asset<T>,
	issuer: basic_type.account_id,
	asset_to_update: basic_type.asset_id,
	new_feed_producers: basic_type.set<basic_type.account_id>,
	extensions: composit_type.extensions<T>,
}

export interface IssueAssetProps<T extends serialization> {
	fee: composit_type.asset<T>,
	issuer: basic_type.account_id,
	asset_to_issue: composit_type.asset<T>,
	issue_to_account: basic_type.account_id,
	extensions: composit_type.extensions<T>,
}

export interface ReserveAssetProps<T extends serialization> {
	fee: composit_type.asset<T>,
	payer: basic_type.account_id,
	amount_to_reserve: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface FundAssetFeePoolProps<T extends serialization> {
	fee: composit_type.asset<T>,
	from_account: basic_type.account_id,
	asset_id: basic_type.asset_id,
	amount: basic_type.int64<T>,
	extensions: composit_type.extensions<T>,
}

export interface SettleAssetProps<T extends serialization> {
	fee: composit_type.asset<T>,
	account: basic_type.account_id,
	amount: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface SettleAssetGloballyProps<T extends serialization> {
	fee: composit_type.asset<T>,
	issuer: basic_type.account_id,
	asset_to_settle: basic_type.asset_id,
	settle_price: composit_type.price<T>,
	extensions: composit_type.extensions<T>,
}

export interface PublishAssetFeedProps<T extends serialization> {
	fee: composit_type.asset<T>,
	publisher: basic_type.account_id,
	asset_id: basic_type.asset_id,
	feed: composit_type.price_feed<T>,
	extensions: composit_type.extensions<T>,
}

export interface CreateProposalProps<T extends serialization> {
	fee: composit_type.asset<T>,
	fee_paying_account: basic_type.account_id,
	expiration_time: basic_type.time_point_sec<T>,
	proposed_ops: AnyOperation<T>[],
	review_period_seconds: basic_type.optional<basic_type.uint32<T>>,
	extensions: composit_type.extensions<T>,
}

export interface UpdateProposalProps<T extends serialization> {
	fee: composit_type.asset<T>,
	fee_paying_account: basic_type.account_id,
	proposal: basic_type.proposal_id,
	active_approvals_to_add: basic_type.set<basic_type.account_id>,
	active_approvals_to_remove: basic_type.set<basic_type.account_id>,
	owner_approvals_to_add: basic_type.set<basic_type.account_id>,
	owner_approvals_to_remove: basic_type.set<basic_type.account_id>,
	key_approvals_to_add: basic_type.set<basic_type.public_key<T>>,
	key_approvals_to_remove: basic_type.set<basic_type.public_key<T>>,
	extensions: composit_type.extensions<T>,
}

export interface DeleteProposalProps<T extends serialization> {
	fee: composit_type.asset<T>,
	fee_paying_account: basic_type.account_id,
	using_owner_authority: basic_type.bool,
	proposal: basic_type.proposal_id,
	extensions: composit_type.extensions<T>,
}

export interface CreateWithdrawPermissionProps<T extends serialization> {
	fee: composit_type.asset<T>,
	withdraw_from_account: basic_type.account_id,
	authorized_account: basic_type.account_id,
	withdrawal_limit: composit_type.asset<T>,
	withdrawal_period_sec: basic_type.uint32<T>,
	periods_until_expiration: basic_type.uint32<T>,
	period_start_time: basic_type.time_point_sec<T>,
}

export interface UpdateWithdrawPermissionProps<T extends serialization> {
	fee: composit_type.asset<T>,
	withdraw_from_account: basic_type.account_id,
	authorized_account: basic_type.account_id,
	permission_to_update: basic_type.withdraw_permission_id,
	withdrawal_limit: composit_type.asset<T>,
	withdrawal_period_sec: basic_type.uint32<T>,
	period_start_time: basic_type.time_point_sec<T>,
	periods_until_expiration: basic_type.uint32<T>,
}

export interface ClaimWithdrawPermissionProps<T extends serialization> {
	fee: composit_type.asset<T>,
	withdraw_permission: basic_type.withdraw_permission_id,
	withdraw_from_account: basic_type.account_id,
	withdraw_to_account: basic_type.account_id,
	amount_to_withdraw: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface DeleteWithdrawPermissionProps<T extends serialization> {
	fee: composit_type.asset<T>,
	withdraw_from_account: basic_type.account_id,
	authorized_account: basic_type.account_id,
	withdrawal_permission: basic_type.withdraw_permission_id,
	extensions: composit_type.extensions<T>,
}

export interface CreateCommitteeMemberProps<T extends serialization> {
	fee: composit_type.asset<T>,
	committee_member_account: basic_type.account_id,
	url: string,
	extensions: composit_type.extensions<T>,
}

export interface UpdateCommitteeMemberProps<T extends serialization> {
	fee: composit_type.asset<T>,
	committee_member: basic_type.committee_member_id,
	committee_member_account: basic_type.account_id,
	new_url: basic_type.optional<string>,
	extensions: composit_type.extensions<T>,
}

export interface UpdateCommitteeMemberGlobalParametersProps<T extends serialization> {
	fee: composit_type.asset<T>,
	new_parameters: composit_type.chain_parameters<T>,
	extensions: composit_type.extensions<T>,
}

export interface CreateVestingBalanceProps<
	T extends serialization,
	TVestingPolicyInitializer extends VestingPolicyInitializer = VestingPolicyInitializer,
	> {
	fee: composit_type.asset<T>,
	creator: basic_type.account_id,
	owner: basic_type.account_id,
	amount: composit_type.asset<T>,
	policy: vesting_policy<TVestingPolicyInitializer, T>,
	extensions: composit_type.extensions<T>,
}

export interface WithdrawVestingBalanceProps<T extends serialization> {
	fee: composit_type.asset<T>,
	vesting_balance: basic_type.vesting_balance_id,
	owner: basic_type.account_id,
	amount: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface CustomProps<T extends serialization> {
	fee: composit_type.asset<T>,
	payer: basic_type.account_id,
	required_auths: basic_type.set<basic_type.account_id>,
	id: basic_type.uint16<T>,
	data: basic_type.bytes<T>,
	extensions: composit_type.extensions<T>,
}

export interface AssertProps<T extends serialization> {
	fee: composit_type.asset<T>,
	fee_paying_account: basic_type.account_id,
	predicates: predicate<T>[],
	required_auths: basic_type.set<basic_type.account_id>,
	extensions: composit_type.extensions<T>,
}

export interface ClaimBalanceProps<T extends serialization> {
	fee: composit_type.asset<T>,
	deposit_to_account: basic_type.account_id,
	balance_to_claim: basic_type.balance_id,
	balance_owner_key: basic_type.public_key<T>,
	total_claimed: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface OverrideTransferProps<T extends serialization> {
	fee: composit_type.asset<T>,
	issuer: basic_type.account_id,
	from: basic_type.account_id,
	to: basic_type.account_id,
	amount: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface CancelAssetSettlementProps<T extends serialization> {
	fee: composit_type.asset<T>,
	settlement: basic_type.force_settlement_id,
	account: basic_type.account_id,
	amount: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface ClaimAssetFeesProps<T extends serialization> {
	fee: composit_type.asset<T>,
	issuer: basic_type.account_id,
	amount_to_claim: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface BidCollateralProps<T extends serialization> {
	fee: composit_type.asset<T>,
	bidder: basic_type.account_id,
	additional_collateral: composit_type.asset<T>,
	debt_covered: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface ExecuteBidProps<T extends serialization> {
	fee: composit_type.asset<T>,
	bidder: basic_type.account_id,
	debt: composit_type.asset<T>,
	collateral: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface CreateContractProps<T extends serialization> {
	fee: composit_type.asset<T>,
	registrar: basic_type.account_id,
	value: composit_type.asset<T>,
	code: string,
	supported_asset_id: basic_type.optional<basic_type.asset_id>,
	eth_accuracy: basic_type.bool,
	extensions: composit_type.extensions<T>,
}

export interface CallContractProps<T extends serialization> {
	fee: composit_type.asset<T>,
	registrar: basic_type.account_id,
	value: composit_type.asset<T>,
	code: string,
	callee: basic_type.contract_id,
	extensions: composit_type.extensions<T>,
}

export interface ContractTransferProps<T extends serialization> {
	fee: composit_type.asset<T>,
	from: basic_type.contract_id,
	to: basic_type.account_id | basic_type.contract_id,
	amount: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface ChangeSidechainConfigProps<T extends serialization> {
	fee: composit_type.asset<T>,
	from: basic_type.contract_id,
	amount: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface CreateAccountAddressProps<T extends serialization> {
	fee: composit_type.asset<T>,
	owner: basic_type.account_id,
	label: string,
	extensions: composit_type.extensions<T>,
}

export interface TransferToAddressProps<T extends serialization> {
	fee: composit_type.asset<T>,
	from: basic_type.account_id,
	to: string,
	amount: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface GenerateEthAddressProps<T extends serialization> {
	fee: composit_type.asset<T>,
	account: basic_type.account_id,
	extensions: composit_type.extensions<T>,
}

export interface CreateEthAddressProps<T extends serialization> {
	fee: composit_type.asset<T>,
	account: basic_type.account_id,
	committee_member_id: basic_type.committee_member_id,
	extensions: composit_type.extensions<T>,
}

export interface DepositEthProps<T extends serialization> {
	fee: composit_type.asset<T>,
	committee_member_id: basic_type.committee_member_id,
	from: basic_type.account_id,
	amount: composit_type.asset<T>,
}

export interface WithdrawEthProps<T extends serialization> {
	fee: composit_type.asset<T>,
	account: basic_type.account_id,
	eth_addr: string,
	value: basic_type.uint64<T>,
	extensions: composit_type.extensions<T>,
}

export interface ApproveEthWithdrawalProps<T extends serialization> {
	fee: composit_type.asset<T>,
	committee_member_id: basic_type.committee_member_id,
	extensions: composit_type.extensions<T>,
}

export interface FundContractPoolProps<T extends serialization> {
	fee: composit_type.asset<T>,
	sender: basic_type.account_id,
	contract: basic_type.contract_id,
	amount: composit_type.asset<T>,
	extensions: composit_type.extensions<T>,
}

export interface WhitelistContractProps<T extends serialization> {
	fee: composit_type.asset<T>,
	sender: basic_type.account_id,
	contract: basic_type.contract_id,
	extensions: composit_type.extensions<T>,
}

export interface IssueSidechainProps<T extends serialization> {
	fee: composit_type.asset<T>,
	amount: composit_type.asset<T>,
	account: basic_type.account_id,
	deposit_id: basic_type.eth_deposit_id,
	extensions: composit_type.extensions<T>,
}

export interface BurnSidechainProps<T extends serialization> {
	fee: composit_type.asset<T>,
	amount: composit_type.asset<T>,
	account: basic_type.account_id,
	withdraw_id: basic_type.eth_deposit_id,
	extensions: composit_type.extensions<T>,
}

export interface RegisterERC20TokenProps<T extends serialization> {
	fee: composit_type.asset<T>,
	account: basic_type.account_id,
	eth_addr: basic_type.eth_address_id,
	extensions: composit_type.extensions<T>,
}

export interface DepositERC20TokenProps<T extends serialization> {
	fee: composit_type.asset<T>,
	committee_member_id: basic_type.account_id,
	erc20_token_addr: basic_type.eth_address_id,
	transaction_hash: basic_type.uint32<T>,
	extensions: composit_type.extensions<T>,
}

export interface WithdrawERC20TokenProps<T extends serialization> {
	fee: composit_type.asset<T>,
	account: basic_type.account_id,
	to: basic_type.eth_address_id,
	erc20_token: basic_type.erc20_token_id,
	extensions: composit_type.extensions<T>,
}

export interface ApproveERC20TokenWithdrawalProps<T extends serialization> {
	fee: composit_type.asset<T>,
	committee_member_id: basic_type.account_id,
	to: basic_type.eth_address_id,
	transaction_hash: basic_type.uint32<T>,
	extensions: composit_type.extensions<T>,
}

export interface UpdateContractProps<T extends serialization> {
	fee: composit_type.asset<T>,
	sender: basic_type.account_id,
	contract: basic_type.contract_id,
	extensions: composit_type.extensions<T>,
}
