import Serializable from "../../serializable";

type Generic = { [key: number]: Serializable } | Serializable[];

type StaticVariant<T extends Generic = {}, TKey extends number> = TKey extends keyof T ? [
	Parameters<Generic[TKey]['toRaw']>[0],
	ReturnType<Generic[TKey]['toRaw']>,
] : never;

export class StaticVariantType<T extends Generic> extends Serializable<StaticVariant<T>[0],
	[]
> {
	
}
