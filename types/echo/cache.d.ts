export type CacheOptions = {
	isUsed?: boolean;
	expirationTime?: number | null;
	minCleaningTime?: number;
} | null

export default class Cache {
	public isUsed: boolean;
	public expirationTime: number | null;
	public minCleaningTime: number;
	constructor(options: CacheOptions);
	public reset(): void;
}
