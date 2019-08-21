import { ArrayType } from "./array";
import Serializable from "../../serializable";

export class FixedArrayType<T extends Serializable> extends ArrayType<T> {
	readonly length: number;
	constructor(length: number, type: T);
}

export default function fixedArray<T extends Serializable>(length: number, type: T): FixedArrayType<T>;
