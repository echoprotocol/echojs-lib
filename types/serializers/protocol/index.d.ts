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
	committeeMemberActivateOperationPropsSerializer,
	committeeMemberDeactivateOperationPropsSerializer,
	committeeMemberCreateOperationPropsSerializer,
	committeeMemberUpdateOperationPropsSerializer,
	committeeMemberUpdateGlobalParametersOperationPropsSerializer,
} from './committee_member';

import {
	committeeFrozenBalanceDepositOperationPropsSerializer,
	committeeFrozenBalanceWithdrawOperationPropsSerializer,
} from './committee_frozen_balance';

import {
	contractBaseOperationPropsSerializer,
	contractCreateOperationPropsSerializer,
	contractCallOperationPropsSerializer,
	contractFundPoolOperationPropsSerializer,
	contractWhitelistOperationPropsSerializer,
	contractUpdateOperationPropsSerializer,
	contractInternalCreateOperationPropsSerializer,
	contractInternalCallOperationPropsSerializer,
	contractSelfdestructOperationPropsSerializer
} from './contract';

import * as economy from './economy';

import {
	proposalCreateOperationPropsSerializer,
	proposalUpdateOperationPropsSerializer,
	proposalDeleteOperationPropsSerializer,
} from './proposal';

import * as _sidechain from './sidechain';

import {
	transferOperationPropsSerializer,
	overrideTransferOperationPropsSerializer,
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

import {
	didCreateOperationSerializer,
	didUpdateOperationSerializer,
	didDeleteOperationSerializer,
} from './did';

export { AccountListingSerializer, accountListing, ACCOUNT_LISTING } from './account';

export { blockRewardOperationPropsSerializer as blockReward } from './block_reward';

export { economy };

export { evmAddressRegisterOperationPropsSerializer as evmAddress } from './evm_address';

export declare const account: {
	options: typeof accountOptionsSerializer,
	create: typeof accountCreateOperationPropsSerializer,
	update: typeof accountUpdateOperationPropsSerializer,
	whitelist: typeof accountWhitelistOperationPropsSerializer,
	addressCreate: typeof accountAddressCreateOperationPropsSerializer,
};

export { priceSerializer as price, priceFeedSerializer as priceFeed } from './asset';

export declare const asset: {
	options: typeof assetOptionsSerializer,
	bitassetOptions: typeof bitassetOptionsSerializer,
	create: typeof assetCreateOperationPropsSerializer,
	update: typeof assetUpdateOperationPropsSerializer,
	updateBitasset: typeof assetUpdateBitassetOperationPropsSerializer,
	updateFeedProducers: typeof assetUpdateFeedProducersOperationPropsSerializer,
	issue: typeof assetIssueOperationPropsSerializer,
	reserve: typeof assetReserveOperationPropsSerializer,
	fundFeePool: typeof assetFundFeePoolOperationPropsSerializer,
	publishFeed: typeof assetPublishFeedOperationPropsSerializer,
	claimFees: typeof assetClaimFeesOperationPropsSerializer,
};

export { default as authority } from './authority';

export declare const balance: {
	claim: typeof balanceClaimOperationPropsSerializer,
	freeze: typeof balanceFreezeOperationPropsSerializer,
	unfreeze: typeof balanceUnfreezeOperationPropsSerializer,
	requestUnfreeze: typeof requestBalanceUnfreezeOperation,
};

export { default as btcPublicKey } from './btcPublicKey';

export { default as chainParameters } from './chain_parameters';

export declare const committeeMember: {
	activate: typeof committeeMemberActivateOperationPropsSerializer,
	deactivate: typeof committeeMemberDeactivateOperationPropsSerializer,
	create: typeof committeeMemberCreateOperationPropsSerializer,
	update: typeof committeeMemberUpdateOperationPropsSerializer,
	updateGlobalParameters: typeof committeeMemberUpdateGlobalParametersOperationPropsSerializer,
};

export declare const committeeFrozenBalance: {
	deposit: typeof committeeFrozenBalanceDepositOperationPropsSerializer,
	withdraw: typeof committeeFrozenBalanceWithdrawOperationPropsSerializer,
}

export declare const contract: {
	base: typeof contractBaseOperationPropsSerializer,
	create: typeof contractCreateOperationPropsSerializer,
	call: typeof contractCallOperationPropsSerializer,
	internalCreate: typeof contractInternalCreateOperationPropsSerializer,
	selfdestruct: typeof contractSelfdestructOperationPropsSerializer
	internalCall: typeof contractInternalCallOperationPropsSerializer,
	fundPool: typeof contractFundPoolOperationPropsSerializer,
	whitelist: typeof contractWhitelistOperationPropsSerializer,
	update: typeof contractUpdateOperationPropsSerializer,
};

export { default as ethAddress } from './ethAddress';
export { default as feeParameters } from './fee_parameters';
export { default as feeSchedule } from './fee_schedule';

export declare const proposal: {
	create: typeof proposalCreateOperationPropsSerializer,
	update: typeof proposalUpdateOperationPropsSerializer,
	delete: typeof proposalDeleteOperationPropsSerializer,
};

export declare const sidechain: {
	issue: typeof _sidechain.sidechainIssueOperationPropsSerializer,
	burn: typeof _sidechain.sidechainBurnOperationPropsSerializer,
	eth: typeof _sidechain.eth,
	erc20: typeof _sidechain.erc20,
	btc: typeof _sidechain.btc,
};

export declare const transfer: {
	default: typeof transferOperationPropsSerializer,
	override: typeof overrideTransferOperationPropsSerializer,
	toAddress: typeof transferToAddressOperationPropsSerializer,
};

export declare const vesting: {
	balanceCreate: typeof vestingBalanceCreateOperationPropsSerializer,
	policyInitializer: typeof vestingPolicyInitializer,
	linearPolicyInitializer: typeof linearVestingPolicyInitializer,
	cddPolicyInitializer: typeof cddVestingPolicyInitializer,
	balanceWithdraw: typeof vestingBalanceWithdrawOperationPropsSerializer,
};

export declare const voteId: VoteIdSerializer;

export { VoteIdSerializer };

export declare const did: {
	create: typeof didCreateOperationSerializer,
	update: typeof didUpdateOperationSerializer,
	delete: typeof didDeleteOperationSerializer,
}
