import { Abi } from "../interfaces/Abi";
import PrivateKey from "../crypto/private-key";
import Echo from "../echo";
import { Method, DeployMethod, CallMethod } from "./Method";

export default class Contract {

	abi: Readonly<Abi>;
	registrar?: { id: string, privateKey?: PrivateKey };
	echo?: Echo;
	id?: string;

	constructor(abi: Abi, options?: {
		registrar?: string | { id: string, privateKey?: PrivateKey },
		echo?: Echo,
		id?: string,
	});

	setRegistrar(registrar: string | { id: string, privateKey?: PrivateKey } | undefined): void;
	deploy(bytecode: Buffer, ...args: any[]): DeployMethod;
	readonly methods: { [method: string]: (...args: any[]) => CallMethod };

}
