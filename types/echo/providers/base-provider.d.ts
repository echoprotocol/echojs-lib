import ConnectionType from "./connection-type";

export interface BaseProviderOptions {
	debug?: boolean;
}

export default abstract class BaseProvider {
	public readonly connectionType: ConnectionType;
	public readonly url: string;
	public debug: boolean;
	constructor(url: string, options?: BaseProviderOptions);
	protected log(message: string): void;
}
