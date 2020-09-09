import {
	accountOptionsSerializer,
	accountCreateOperationPropsSerializer,
	accountUpdateOperationPropsSerializer,
	accountWhitelistOperationPropsSerializer,
	accountAddressCreateOperationPropsSerializer,
} from './account';

import {
	assetOptionsSerializer,
	bitassetOptionsSerializer,
	assetCreateOperationPropsSerializer,
	assetUpdateOperationPropsSerializer,
	assetUpdateBitassetOperationPropsSerializer,
	assetUpdateFeedProducersOperationPropsSerializer,
	assetIssueOperationPropsSerializer,
	assetReserveOperationPropsSerializer,
	assetFundFeePoolOperationPropsSerializer,
	assetPublishFeedOperationPropsSerializer,
	assetClaimFeesOperationPropsSerializer,
} from './asset';

import {
	balanceClaimOperationPropsSerializer,
	balanceFreezeOperationPropsSerializer,
	balanceUnfreezeOperationPropsSerializer,
	requestBalanceUnfreezeOperation,
} from './balance';

import {
	committeeMemberCreateOperationPropsSerializer,
	committeeMemberUpdateOperationPropsSerializer,
	committeeMemberUpdateGlobalParametersOperationPropsSerializer,
	committeeMemberActivateOperationPropsSerializer,
	committeeMemberDeactivateOperationPropsSerializer,
} from './committee_member';

import {
	committeeFrozenBalanceDepositOperationPropSerializer,
	committeeFrozenBalanceWithdrawOperationPropSerializer,
} from './committee_frozen_balance';

import {
	contractBaseOperationPropsSerializer,
	contractCreateOperationPropsSerializer,
	contractCallOperationPropsSerializer,
	contractInternalCreateOperationPropsSerializer,
	contractInternalCallOperationPropsSerializer,
	contractSelfdestructOperationPropsSerializer,
	contractFundPoolOperationPropsSerializer,
	contractWhitelistOperationPropsSerializer,
	contractUpdateOperationPropsSerializer,
} from './contract';

import * as economy from './economy';

import {
	proposalCreateOperationPropsSerializer,
	proposalUpdateOperationPropsSerializer,
	proposalDeleteOperationPropsSerializer,
} from './proposal';

import * as _sidechain from './sidechain';

import {
	overrideTransferOperationPropsSerializer,
	transferOperationPropsSerializer,
	transferToAddressOperationPropsSerializer,
} from './transfer';

import {
	vestingBalanceCreateOperationPropsSerializer,
	vestingPolicyInitializer,
	linearVestingPolicyInitializer,
	cddVestingPolicyInitializer,
	vestingBalanceWithdrawOperationPropsSerializer,
} from './vesting';

import VoteIdSerializer from './VoteId';

import evmAddress from './evm_address';

import {
	didCreateOperationSerializer,
	didUpdateOperationSerializer,
	didDeleteOperationSerializer,
} from './did';

export { AccountListingSerializer, accountListing, ACCOUNT_LISTING } from './account';

export const account = {
	options: accountOptionsSerializer,
	create: accountCreateOperationPropsSerializer,
	update: accountUpdateOperationPropsSerializer,
	whitelist: accountWhitelistOperationPropsSerializer,
	addressCreate: accountAddressCreateOperationPropsSerializer,
};

export { priceSerializer as price, priceFeedSerializer as priceFeed } from './asset';

export const asset = {
	options: assetOptionsSerializer,
	bitassetOptions: bitassetOptionsSerializer,
	create: assetCreateOperationPropsSerializer,
	update: assetUpdateOperationPropsSerializer,
	updateBitasset: assetUpdateBitassetOperationPropsSerializer,
	updateFeedProducers: assetUpdateFeedProducersOperationPropsSerializer,
	issue: assetIssueOperationPropsSerializer,
	reserve: assetReserveOperationPropsSerializer,
	fundFeePool: assetFundFeePoolOperationPropsSerializer,
	publishFeed: assetPublishFeedOperationPropsSerializer,
	claimFees: assetClaimFeesOperationPropsSerializer,
};

export { default as authority } from './authority';

export const balance = {
	claim: balanceClaimOperationPropsSerializer,
	freeze: balanceFreezeOperationPropsSerializer,
	unfreeze: balanceUnfreezeOperationPropsSerializer,
	requestUnfreeze: requestBalanceUnfreezeOperation,
};

export { default as chainParameters } from './chain_parameters';

export const committeeMember = {
	activate: committeeMemberActivateOperationPropsSerializer,
	deactivate: committeeMemberDeactivateOperationPropsSerializer,
	create: committeeMemberCreateOperationPropsSerializer,
	update: committeeMemberUpdateOperationPropsSerializer,
	updateGlobalParameters: committeeMemberUpdateGlobalParametersOperationPropsSerializer,
};

export const committeeFrozenBalance = {
	deposit: committeeFrozenBalanceDepositOperationPropSerializer,
	withdraw: committeeFrozenBalanceWithdrawOperationPropSerializer,
};

export const contract = {
	base: contractBaseOperationPropsSerializer,
	create: contractCreateOperationPropsSerializer,
	call: contractCallOperationPropsSerializer,
	internalCreate: contractInternalCreateOperationPropsSerializer,
	internalCall: contractInternalCallOperationPropsSerializer,
	selfdestruct: contractSelfdestructOperationPropsSerializer,
	fundPool: contractFundPoolOperationPropsSerializer,
	whitelist: contractWhitelistOperationPropsSerializer,
	update: contractUpdateOperationPropsSerializer,
};

export { default as ethAddress } from './ethAddress';
export { default as feeParameters } from './fee_parameters';
export { default as feeSchedule } from './fee_schedule';

export const proposal = {
	create: proposalCreateOperationPropsSerializer,
	update: proposalUpdateOperationPropsSerializer,
	delete: proposalDeleteOperationPropsSerializer,
};

export const sidechain = {
	issue: _sidechain.sidechainIssueOperationPropsSerializer,
	burn: _sidechain.sidechainBurnOperationPropsSerializer,
	erc20: _sidechain.erc20,
	eth: _sidechain.eth,
	btc: _sidechain.btc,
};

export const transfer = {
	default: transferOperationPropsSerializer,
	override: overrideTransferOperationPropsSerializer,
	toAddress: transferToAddressOperationPropsSerializer,
};

export const vesting = {
	balanceCreate: vestingBalanceCreateOperationPropsSerializer,
	policyInitializer: vestingPolicyInitializer,
	linearPolicyInitializer: linearVestingPolicyInitializer,
	cddPolicyInitializer: cddVestingPolicyInitializer,
	balanceWithdraw: vestingBalanceWithdrawOperationPropsSerializer,
};

export const voteId = new VoteIdSerializer();

export { VoteIdSerializer };

export { blockRewardOperationPropsSerializer as blockReward } from './block_reward';

export const did = {
	create: didCreateOperationSerializer,
	update: didUpdateOperationSerializer,
	delete: didDeleteOperationSerializer,
};

export { economy, evmAddress };
