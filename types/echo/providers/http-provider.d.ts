import BaseProvider, { BaseProviderOptions } from "./base-provider";
import ConnectionType from "./connection-type";

export default class HttpProvider extends BaseProvider {
	public readonly connectionType: ConnectionType.HTTP;
	constructor(url: string, options: BaseProviderOptions);
	public call(method: string, params: any[]): Promise<unknown>;
}
