import { Abi } from "../../interfaces/Abi";

export default function generateInterface(contractName: string, abi: Abi, props?: {
	indent?: string,
	maxLength?: number,
}): string;
