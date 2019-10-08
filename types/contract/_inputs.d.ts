import { BigNumber } from "bignumber.js";

type INPUT = {
	boolean: boolean;
	small_integer: number | string | BigNumber;
	big_integer: number | string | BigNumber;
	address: string;
	string: string | Buffer;
	bytes: Buffer | string;
}

export default INPUT;
