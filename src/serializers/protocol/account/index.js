import AccountListingSerializer from './account_listing';
import authoritySerializer from '../authority';
import { string as stringSerializer } from '../../basic';
import { uint16, uint8 } from '../../basic/integers';
import { asset, publicKey, extensions } from '../../chain';
import { accountId } from '../../chain/id/protocol';
import { struct, optional } from '../../collections';
import ethAddress from '../ethAddress';

export { default as AccountListingSerializer, ACCOUNT_LISTING } from './account_listing';

export const accountListing = new AccountListingSerializer();

export const accountOptionsSerializer = struct({
	delegating_account: accountId,
	delegate_share: uint16,
	extensions,
});

export const accountCreateOperationPropsSerializer = struct({
	fee: asset,
	registrar: accountId,
	name: stringSerializer,
	active: authoritySerializer,
	echorand_key: publicKey,
	evm_address: optional(ethAddress),
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

export const accountWhitelistOperationPropsSerializer = struct({
	fee: asset,
	authorizing_account: accountId,
	account_to_list: accountId,
	new_listing: uint8,
	extensions,
});

export const accountAddressCreateOperationPropsSerializer = struct({
	fee: asset,
	owner: accountId,
	label: stringSerializer,
	extensions,
});
