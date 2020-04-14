import { VMType } from "./objects";

export type Contract<T extends VMType = VMType> = [T, {
	[VMType.EVM]: {
		code: string,
		storage: { [key: string]: [string, string] },
	},
	[VMType.X86_64]: { code: string },
}[T]];
