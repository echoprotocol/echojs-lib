import BigNumber from "bignumber.js";
import ISerializer from "../../ISerializer";

type TInput = number | BigNumber | string;

export default abstract class IIntSerializer<TOutput extends string | number> extends ISerializer<TInput, TOutput> {
	readonly bitsCount: number;
	readonly maxAbsValue: BigNumber;
	protected _maxAbsValue: BigNumber;
	constructor(bitsCount: number);
	toRaw(value: TInput): TOutput;
	readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput, newOffset: number };
}
