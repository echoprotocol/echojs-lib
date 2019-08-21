import BigNumber from "bignumber.js";
import Serializable from "../../serializable";

type TInput = number | BigNumber | string;

export default abstract class UIntType<TOutput extends number | string> extends Serializable<TInput, TOutput> {
	constructor(bitsCount: number);
	toRaw(value: TInput): TOutput;
}
