import * as ByteBuffer from "bytebuffer";
import Serializable from "./serializable";
import { UndefinedOptional } from "../__helpers";

type Types = { [key: string]: Serializable };
type TInput<T extends Types> = UndefinedOptional<{ [key in keyof T]: Parameters<T[key]['validate']>[0] }>;
type TOutput<T extends Types> = UndefinedOptional<{ [key in keyof T]: ReturnType<T[key]['toRaw']> }>;

export class Dict<T extends Types> extends Serializable<TInput<T>, TOutput<T>> {
	readonly types: Readonly<T>;
	constructor(types: T);
	appendToByteBuffer(value: TInput<T>, bytebuffer: ByteBuffer): void;
	toRaw(value: TInput<T>): TOutput<T>;
}

export default function dict<T extends Types>(types: T): Dict<T>;
