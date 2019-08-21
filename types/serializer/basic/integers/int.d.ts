import Serializable from "../../serializable";
import BigNumber from "bignumber.js";

type TInput = number | BigNumber | string;

export default abstract class IntType<TOutput extends string | number> extends Serializable<TInput, TOutput> {
	public readonly bitsCount: number;
	public readonly maxAbsValue: BigNumber;
	constructor(bitsCount: number);
	toRaw(value: TInput): TOutput;
}
