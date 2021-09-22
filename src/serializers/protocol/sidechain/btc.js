import { asset, extensions, sha256, ripemd160 } from '../../chain';
import {
	accountId,
	btcAddressId,
	btcDepositId,
	btcWithdrawId,
	btcAggregatingId,
} from '../../chain/id/protocol';
import { btcTransactionDetailsSerializer } from '../../chain/sidechain/btc';
import { struct, set, map, optional, vector } from '../../collections';
import { string as stringSerializer, integers, bool } from '../../basic';
import btcPublicKey from '../btcPublicKey';
import { uint8, uint32, int32, uint64 } from '../../basic/integers';

const spvHeaderBlockSerializer = struct({
	version: int32,
	prev_block_hash: sha256,
	merkle_root: sha256,
	timestamp: uint32,
	bits: uint32,
	nonce: uint32,
	height: uint32,
});

const proofSerializer = ({
	tx: struct({
		version: uint32,
		marker: uint8,
		flag: uint8,
		inputs: vector(struct({
			outpoint: struct({
				tx_id: sha256,
				index: uint32,
				amount: uint64,
			}),
			unlock_script: vector(uint8),
			witness: vector(vector(uint8)),
			sequence: uint32,
		})),
		outputs: vector(struct({
			amount: uint64,
			index: uint32,
			lock_script: vector(uint8),
			p2sh_p2wsh: btcAddressId,
		})),
		nlocktime: uint32,
	}),
	merkle_path: struct({
		leafs: vector(struct({
			leaf: sha256,
			is_left: bool,
		})),
	}),
});

export const sidechainBtcSpvCreateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	header: spvHeaderBlockSerializer,
	proofs: vector(proofSerializer),
	extensions,
});

export const sidechainBtcSpvAddMissedTxReceiptOperationPropsSerializer = struct({
	fee: asset,
	reporter: accountId,
	block_hash: sha256,
	proofs: vector(proofSerializer),
	extensions,
});

export const sidechainBtcCreateAddressOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	extensions,
});

export const sidechainBtcDepositOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	btc_address_id: stringSerializer,
	tx_info: btcTransactionDetailsSerializer,
	extensions,
});

export const sidechainBtcWithdrawOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	btc_addr: stringSerializer,
	value: integers.uint64,
	extensions,
});

export const sidechainBtcAggregateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	deposits: set(btcDepositId),
	withdrawals: set(btcWithdrawId),
	transaction_id: sha256,
	sma_address: struct({ address: stringSerializer }),
	committee_member_ids_in_script: map(accountId, btcPublicKey),
	aggregation_out_value: integers.uint64,
	btc_block_number: uint32,
	previous_aggregation: optional(btcAggregatingId),
	cpfp_depth: uint8,
	signatures: map(integers.uint32, stringSerializer),
	extensions,
});

export const sidechainBtcApproveAggregateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	transaction_id: sha256,
	btc_block_number: uint32,
	extensions,
});

export const sidechainBtcCreateStakeScriptOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	pubkey_hash: ripemd160,
	extensions,
});

export const sidechainStakeBtcUpdateOperationPropsSerializer = struct({
	fee: asset,
	committee_member_id: accountId,
	owner: accountId,
	btc_tx_info: btcTransactionDetailsSerializer,
	is_vin: bool,
	extensions,
});
