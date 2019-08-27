import authoritySerializer from './authority';
import VoteIdSerializer from './VoteId';
import { string as stringSerializer } from '../basic';
import { uint16 } from '../basic/integers';
import { asset, publicKey, extensions } from '../chain';
import { accountId } from '../chain/id/protocol';
import { struct, set, optional } from '../collections';

export const accountOptionsSerializer = struct({
	voting_account: accountId,
	delegating_account: accountId,
	num_committee: uint16,
	votes: set(new VoteIdSerializer()),
	extensions,
});

export const accountCreateOperationPropsSerializer = struct({
	fee: asset,
	registrar: accountId,
	name: stringSerializer,
	active: authoritySerializer,
	echorand_key: publicKey,
	options: accountOptionsSerializer,
	// TODO: extensions serializer
	extensions,
});

export const accountUpdateOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	active: optional(authoritySerializer),
	echorand_key: optional(publicKey),
	new_options: optional(accountOptionsSerializer),
	// TODO: extensions serializer
	extensions,
});
