import ethAddress from '../ethAddress';
import { uint64 } from '../../basic/integers';
import { asset, extensions, sha256 } from '../../chain';
import { accountId, ethDepositId, ethWithdrawId, assetId } from '../../chain/id/protocol';
import { struct, vector } from '../../collections';
import { spvEthBlockHeader, spvEthMerkleProof } from '../../spv/eth';

// sidechain_eth_spv_create_operation
export const sidechainEthSpvCreateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	header: spvEthBlockHeader,
	proofs: vector(spvEthMerkleProof),
	extensions,
});

// sidechain_eth_spv_add_missed_tx_receipt_operation
export const sidechainEthSpvAddMissedTxReceiptOperationPropsSerializer = struct({
	fee: asset,
	reporter: accountId,
	block_hash: sha256,
	proofs: vector(spvEthMerkleProof),
	extensions,
});

export const sidechainEthCreateAddressOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	extensions,
});

export const sidechainEthApproveAddressOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	eth_addr: ethAddress,
	transaction_hash: sha256,
	extensions,
});

export const sidechainEthDepositOperationPropsSerializer = struct({
	fee: asset,
	deposit_id: uint64,
	account: accountId,
	value: uint64,
	transaction_hash: sha256,
	extensions,
});

export const sidechainEthSendDepositOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	deposit_id: ethDepositId,
	extensions,
});

export const sidechainEthWithdrawOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	eth_addr: ethAddress,
	value: uint64,
	extensions,
});

export const sidechainEthSendWithdrawOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	withdraw_id: ethWithdrawId,
	extensions,
});

export const sidechainEthApproveWithdrawOperationPropsSerializer = struct({
	fee: asset,
	withdraw_id: uint64,
	transaction_hash: sha256,
	extensions,
});

export const sidechainEthUpdateContractAddressOperationPropsSerializer = struct({
	fee: asset,
	new_addr: ethAddress,
	extensions,
});

export const sidechainStakeEthUpdateOperationPropsSerializer = struct({
	fee: asset,
	asset_id: assetId,
	current_balance: uint64,
	account: accountId,
	transaction_hash: sha256,
	extensions,
});
