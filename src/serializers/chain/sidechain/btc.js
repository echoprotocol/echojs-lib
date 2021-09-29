import { struct, vector } from '../../collections';
import { integers, string } from '../../basic';
import { sha256 } from '../../chain';
import { uint32, uint64, uint8 } from '../../basic/integers';

const prevOut = struct({
	tx_id: sha256,
	index: integers.uint32,
	amount: integers.uint64,
});

export const btcTransactionDetailsSerializer = struct({
	block_number: integers.uint64,
	out: prevOut,
});

const script = vector(uint8);
const wintess = vector(vector(uint8));

const txIn = struct({
	outpoint: prevOut,
	unlock_script: script,
	witness: wintess,
	sequence: uint32,
});

const p2shPwsh = string;

const txOut = struct({
	amount: uint64,
	index: uint32,
	lock_script: script,
	address: p2shPwsh,
});

const txIns = vector(txIn);
const txOuts = vector(txOut);

export const sidechainBtcTransaction = struct({
	version: uint32,
	marker: uint8,
	flag: uint8,
	inputs: txIns,
	tx_outs: txOuts,
	nlocktime: uint32,
});

export default { btcTransactionDetailsSerializer };
