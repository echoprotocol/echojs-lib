import ethAddress from '../ethAddress';
import { uint64, uint256, uint8 } from '../../basic/integers';
import { asset, extensions, sha256 } from '../../chain';
import { accountId, ethDepositId, ethWithdrawId, assetId } from '../../chain/id/protocol';
import { struct, vector, optional, pair } from '../../collections';
import { bytes, variantObject, string } from '../../basic';

const spvHeaderBlockSerializer = struct({
	parentHash: sha256,
	sha3Uncles: sha256,
	miner: bytes(),
	stateRoot: sha256,
	transactionsRoot: sha256,
	receiptsRoot: sha256,
	logsBloom: bytes(),
	difficulty: uint256,
	height: uint64,
	gasLimit: uint256,
	gasUsed: uint256,
	timestamp: uint64,
	extraData: bytes(),
	mixHash: sha256,
	nonce: bytes(),
	base_fee: optional(uint256),
});

const proofSerializer = ({
	receipt: struct({
		type: uint8,
		transactionHash: sha256,
		transactionIndex: uint64,
		cumulativeGaUsed: uint256,
		logs: vector(struct({
			logIndex: string,
			address: bytes(),
			data: bytes(),
			topics: vector(sha256),
		})),
		logsBloom: bytes(),
		statusOrRoot: variantObject(uint8, sha256),
	}),
	pathData: vector(pair(vector(optional(bytes())), optional(string))),
});

export const sidechainEthSpvCreateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	header: spvHeaderBlockSerializer,
	proofs: vector(proofSerializer),
	extensions,
});

export const sidechainEthSpvAddMissedTxReceiptOperationPropsSerializer = struct({
	fee: asset,
	reporter: accountId,
	block_hash: sha256,
	proofs: vector(proofSerializer),
	extensions,
});

export const sidechainEthCreateAddressOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	extensions,
});

export const sidechainEthApproveAddressOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	malicious_committeemen: vector(accountId),
	account: accountId,
	eth_addr: ethAddress,
	transaction_hash: sha256,
	extensions,
});

export const sidechainEthDepositOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
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
	committee_member_id: accountId,
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
	committee_member_id: accountId,
	asset_id: assetId,
	current_balance: uint64,
	account: accountId,
	transaction_hash: sha256,
	extensions,
});
