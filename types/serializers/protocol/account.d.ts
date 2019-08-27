import authoritySerializer from "./authority";
import VoteIdSerializer from "./VoteId";
import { string as stringSerializer } from "../basic";
import { uint16 } from "../basic/integers";
import { asset, publicKey, extensions } from "../chain";
import { accountId } from "../chain/id/protocol";
import { StructSerializer, SetSerializer } from "../collections";
import OptionalSerializer from "../collections/Optional";

export declare const accountOptionsSerializer: StructSerializer<{
	voting_account: typeof accountId,
	delegating_account: typeof accountId,
	num_committee: typeof uint16,
	votes: SetSerializer<VoteIdSerializer>,
	extensions: typeof extensions,
}>;

export declare const accountCreateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	registrar: typeof accountId,
	name: typeof stringSerializer,
	active: typeof authoritySerializer,
	echorand_key: typeof publicKey,
	options: typeof accountOptionsSerializer,
	// TODO: extensions serializer
	extensions: typeof extensions,
}>;

export declare const accountUpdateOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	account: typeof accountId,
	active: OptionalSerializer<typeof authoritySerializer>,
	echorand_key: OptionalSerializer<typeof publicKey>,
	new_options: OptionalSerializer<typeof accountOptionsSerializer>,
	// TODO: extensions serializer
	extensions: typeof extensions,
}>;
