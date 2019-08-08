export default class Subscriber {
	setBlockApplySubscribe(cb: (blockHash: unknown) => any): Promise<void>;
}
