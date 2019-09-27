import { Abi } from "../interfaces/Abi";
import PrivateKey from "../crypto/private-key";
import Echo from "../echo";
import { Method, DeployMethod, CallMethod } from "./Method";

export default class Contract {

	readonly constructorArgsType: readonly string[];
	readonly hasFallback: boolean;
	readonly methods: { [method: string]: (...args: any[]) => CallMethod };
	readonly namesDublications: ReadonlySet<string>;

	abi: Readonly<Abi>;
	echo?: Echo;
	id?: string;
	registrar?: { id: string, privateKey?: PrivateKey };

	constructor(abi: Abi, options?: {
		registrar?: string | { id: string, privateKey?: PrivateKey },
		echo?: Echo,
		id?: string,
	});

	getEcho(): Echo;
	getId(): string;
	getRegistrar(): string;
	setRegistrar(registrar: string | { id: string, privateKey?: PrivateKey } | undefined): void;
	deploy(bytecode: Buffer | string, ...args: any[]): DeployMethod;

}
