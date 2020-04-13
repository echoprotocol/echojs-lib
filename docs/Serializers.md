# Serializers

All serializers has at least 4 methods:
* `toRaw(value)` - converts `value` to raw format (that is able to convert to JSON)
* `serialize(value)` - converts `value` to serialized `Buffer`
* `deserialize(buffer)` - converts serialized `buffer` to value (returns the same as `toRaw` method). Throws an error when buffer with invalid size is provided
* `readFromBuffer(buffer, offset)` - converts serialized `buffer` to value (as `deserialize`) and start reading from byte with index, provided in `offset` parameter. By default `offset` is equals to `0`. Returns object with fields: `res` - deserialized value; `newOffset` - new position of reading cursor. Unlike `deserialize` method do not throws an error, when provided buffer with size greater than expected.
* `appendToByteBuffer(value,bytebuffer)` - appends result of `value` serialization to `bytebuffer`
* `validate(value)` - just throws error, if `value` is invalid

<hr/>

- [Basic](#basic)
    - [Integers](#integers)
    - [Boolean](#boolean)
    - [Bytes](#bytes)
    - [Time point in seconds](#time-point-in-seconds)
    - [String](#string)
- [Collections](#collections)
    - [Map](#map)
    - [Optional](#optional)
    - [Set](#set)
    - [Static variant](#static-variant)
    - [Struct](#struct)
    - [Vector](#vector)
- [Chain basic](#chain-basic)
    - [IDs](#ids)
        - [Any object ID](#any-object-id)
        - [Object ID](#object-id)
        - [Protocol Object ID](#protocol-object-id)
    - [Asset](#asset)
    - [Public Key](#public-key)
- [Plugins](#plugins)
    - [EchoRand](#echorand)
        - [Config](#echorand-config)
    - [SideChain](#sidechain)
        - [Ethereum Method](#eth-method)
        - [Ethereum Topic](#eth-topic)
        - [Fines](#fines)
        - [Config](#sidechain-config)
        - [ERC20 Config](#erc20-config)
- [Protocol Objects](#protocol)
- [Operation](#operation)

<hr/>

## Basic

### Integers

There are 6 integer-serializers:
* `int64`
* `uint8`
* `uint16`
* `uint32`
* `uint64`
* `varint32`

Available input types: `number`, `string` and `BigNumber`.

For `int64` and `uint64` output type is `string`, for others - `number`.

Example of serialization:
```ts
import { serializers } from "echojs-lib";
const { uint16 } = serializers.basic.integers;
const input = '123';
console.log(uint16.toRaw(input)); // 123
console.log(uint16.serialize(input)) // <Buffer 7b 00>
```

### Boolean

Input and output type is `boolean`.

Example:
```ts
import { serializers } from "echojs-lib";
const { bool } = serializers.basic;
console.log(bool.toRaw(true)); // true
console.log(bool.serialize(true).toString('hex')); // <Buffer 01>
```

### Bytes

Input type is `Buffer` or hex-`string`.

Output type is `string`.

Example of serialization fixed-size bytes:
```ts
import { serializers } from "echojs-lib";
const { bytes } = serializers.basic;
console.log(bytes(6).toRaw(Buffer.from('qweasd'))); // "717765617364"
console.log(bytes(3).serialize(Buffer.from('qwe'))); // <Buffer 71 77 65>
```

Example of serialization dynamic-size bytes:
```ts
import { serializers } from "echojs-lib";
const { bytes } = serializers.basic;
console.log(bytes().toRaw(Buffer.from('qweasd'))); // same as fixed-size
console.log(bytes().serialize(Buffer.from('qwe'))); // <Buffer 03 71 77 65>
```

### Time Point in Seconds

Input types are `Date` or input types of [`uint32`-serializer](#integers) in seconds (`number`, `string` and `BigNumber`).

Output type is ISO-date format without locale (`Z`)

```ts
import { serializers } from "echojs-lib";
const { timePointSec } = serializers.basic;
const input = new Date(1567157199123);
const seconds = Math.floor(input.getTime() / 1000);
console.log(timePointSec.toRaw(seconds)); // "2019-08-30T09:26:39"
console.log(timePointSec.serialize(input)); // <Buffer cf eb 68 5d>
```

### String

Input and output types are `string`

```ts
import { serilizers } from "echojs-lib";
const stringSerializer = serializers.basic.string;
console.log(stringSerializer.toRaw('qwe')); // "qwe"
console.log(stringSerializer.serialize('qwe')); // <Buffer 03 71 77 65>
```

<hr/>

## Collections

### Map

Input types are:
* `Map<key, value>`
* `{ [key: string]: value }` (only if key can be serialized from string)
* `[key, value][]`

Examples:
```ts
import { serializers } from "echojs-lib";
const { bool, integers } = serializers.basic;
const { uint8 } = integers;
const { map } = serializers.collections;
const s = map(uint8, bool);

const inputMap = new Map();
inputMap.set(123, true);
inputMap.set(234, false);
console.log(s.toRaw(inputMap)); // [[123, true], [234, false]]
console.log(s.serialize(inputMap)); // <Buffer 02 7b 01 ea 00>

const inputDict = { 123: true, 234: false };
console.log(s.toRaw(inputDict));
console.log(s.serialize(inputDict).toString('hex'));

const inputArr = [[123, true], [234, false]];
console.log(s.toRaw(inputArr));
console.log(s.serialze(inputArr).toString('hex'));
```

### Optional

Optional field. When serialized insert in result buffer `0x01` if value provided, returns `0x00` otherwise.

Examples:
```ts
import { serializers } from "echojs-lib";
const { uint32 } = serializers.basic.integers;
const { optional } = serializers.collections;
const s = optional(uint32);

console.log(s.toRaw(123)); // 123
console.log(s.toRaw(undefined)); // undefined

console.log(s.serialize(123)); // <Buffer 01 7b 00 00 00>
console.log(s.serialize(undefined)); // <Buffer 00>
```

### Set

Input types are:
* `value[]`
* `Set<value>`
* `undefined` (will serialized as empty set)

Output type is `value[]`.

```ts
import { serializers } from "echojs-lib";
const { uint32 } = serializers.basic.integers;
const { set } = serializers.collections;
const s = set(uint32);

console.log(s.toRaw([123, 234])); // [123, 234]
console.log(s.serialize([123, 234])); // <Buffer 02 7b 00 00 00 ea 00 00 00>

console.log(s.toRaw(new Set([123, 234])));
console.log(s.serialize(new Set([123, 234])));

console.log(s.toRaw(undefined)); // []
console.log(s.serialize(undefined)); // <Buffer 00>
```

### Static Variant

Input and output type is `[variant, value]`.

Variant is serialized as [`varint32`](#integers)

```ts
import { serializers } from "echojs-lib";
const { uint16, uint32 } = serializers.basic.integers;
const { staticVariant } = serializers.collections;
const s = staticVariant({ 123: uint16, 234: uint32 });
console.log(s.toRaw([123, 345])); // [123, 345]
console.log(s.serialize([234, 345])); // <Buffer ea 01 59 01 00 00>
// `ea 01` is variant (234)
// `59 01 00 00` is value (345)
```

### Struct

Input and output types are `{ [key: string]: value }`

Serialize only values in provided order

```ts
import { serializers } from "echojs-lib";
const { bool, bytes } = serializers.basic;
const { struct } = serializers.collections;
const s = struct({ cond: bool, hex: bytes(3) });
const input = { cond: true, hex: Buffer.from('qwe') };
console.log(s.toRaw(input)); // { cond: true, hex: "717765" }
console.log(s.serialize(input)); // <Buffer 00 71 77 65>
// `00` - cond == false
// `71 77 65` - hex == 'qwe'
```

### Vector

Input and output types are `value[]`. Insert size of vector as [`varint32`](#integers)

```ts
import { serializers } from "echojs-lib";
const { uint16 } = serializers.basic.integers;
const { vector } = serializers.collections;
const s = vector(uint16);
console.log(s.toRaw([123, 234])); // [123, 234]
console.log(s.serialize([123, 234])); // <Buffer 02 7b 00 ea 00>
// `02` - length
// `7b 00` - 123
// `ea 00` - 234
```

<hr/>

## Chain basic

### Ids

#### Any object id

Input and output type is `string` in format
```ts
`${reservedSpaceId}.${objectTypeId}.${instanceId}`
```
At serialization returns serialized [`uint64`](#integers) equals to
```ts
(((reservedSpaceId << 56) | objectTypeId) << 48) | instanceId
```

Examples:
```ts
import { serializers } from "echojs-lib";
const { anyObjectId } = serializers.chain.ids;
const input = '1.2.3';
console.log(anyObjectId.toRaw(input)); // "1.2.3"
console.log(anyObjectId.serialize(input)); // <Buffer 03 00 00 00 00 00 02 01>
// `03 00 00 00 00 00` - instance id
// `02` - object type id
// `01` - reserved space id
```

#### Object id

Input is [`varint32`](#integers) (equals to instance id) or `string` in format
```ts
`${reservedSpaceId}.${objectTypeId}.${instanceId}`
```

Output type is `string` in the same format

Serializer parameters:
* `reservedSpaceId` - id of reserved space
* `objectTypeId` - id of object type (depends on used reserved space)

Example:
```ts
import { serializers, constants, PROTOCOL_OBJECT_TYPE_ID, BigNumber } from "echojs-lib";
const { objectId } = serializers.chain.ids;
const s = objectId(
    constants.CHAIN_TYPES.RESERVED_SPACE_ID.PROTOCOL,
    constants.PROTOCOL_OBJECT_TYPE_ID.CONTRACT,
);

console.log(s.toRaw('1.10.123'));
console.log(s.toRaw(123));
console.log(s.toRaw(new BigNumber(123)));
// "1.10.123"

console.log(s.serialize('1.10.123'));
console.log(s.serialize(123));
console.log(s.serialize(new BigNumber(123)));
// <Buffer 7b>
```

#### Protocol Object ID

Protocol ids serializers are inited object id serializers.

Available protocol object id serializers:
* `accountId`
* `assetId`
* `committeeMemberId`
* `proposalId`
* `vestingBalanceId`
* `balanceId`
* `contractId`
* `ethDepositId`
* `ethWithdrawId`
* `erc20TokenId`

Example:
```ts
import { serializers, BigNumber } from "echojs-lib";
const { accountId } = serializers.chain.ids.protocol;

console.log(accountId.toRaw('1.2.123'));
console.log(accountId.toRaw(123));
console.log(accountId.toRaw(new BigNumber(123)));
// "1.2.123"

console.log(accountId.serialize('1.2.123'));
console.log(accountId.serialize(123));
console.log(accountId.serialize(new BigNumber(123)));
// <Buffer 7b>
```

### Asset

Is structure with field `amount`, that is [`int64`](#integers) and `asset_id` - [`assetId`](#protocol-object-id).

Example:
```ts
import { serializers, BigNumber } from "echojs-lib";
const { asset } = serializers.chain;
const input = { amount: 123, asset_id: '1.3.5' };
console.log(asset.toRaw(input)); // { amount: '123', asset_id: '1.3.5' }
console.log(asset.serialize(input)); // <Buffer 7b 00 00 00 00 00 00 00 05>
// `7b 00 00 00 00 00 00 00` - amount (123)
// `05` - asset id (1.3.5)
```

### Public Key

Input types are `PublicKey` and `string`. Output type is `string`.

Examples:
```ts
import { serializers, PublicKey } from "echojs-lib";
const { publicKey: s } = serializers.chain;
const input = 'ECHO6sCu8oaqyoRGvzSHuiiytDpGVwnCGjB75RRcbQwZnb1Q';
console.log(s.toRaw(input));
// "ECHO6sCu8oaqyoRGvzSHuiiytDpGVwnCGjB75RRcbQwZnb1Q"
console.log(s.serialize(input).toString('hex'));
// "5726eddee2d9bedf836be9b189c4b7c3bf3d8a742533f22e538a22d587b5d167"
```

<hr/>

## Plugins

### Echorand

#### Echorand Config

[Struct](#struct) with fields:

|field|type|
|-|-|
|_time_net_1mb|[`uint32`](#integers)|
|_time_net_256b|[`uint32`](#integers)|
|_creator_count|[`uint32`](#integers)|
|_verifier_count|[`uint32`](#integers)|
|_ok_threshold|[`uint32`](#integers)|
|_max_bba_steps|[`uint32`](#integers)|
|_gc1_delay|[`uint32`](#integers)|

### Sidechain

#### Eth method

[Struct](#struct) with fields:

|field|type|
|-|-|
|method|[`string`](#string)|
|gas|[`uint64`](#integers)|

#### Eth topic
[`bytes(64)`](#bytes)

#### Fines

[Struct](#struct) with fields:

|field|type|
|-|-|
|generate_eth_address|[int64](#integers)|

#### Sidechain Config

[Struct](#struct) with fields:

|field|type|
|-|-|
|eth_contract_address|[`bytes(20)`](#bytes)|
|eth_committee_update_method|[`eth method`](#eth-method)|
|eth_gen_address_method|[`eth method`](#eth-method)|
|eth_withdraw_method|[`eth method`](#eth-method)|
|eth_update_addr_method|[`eth method`](#eth-method)|
|eth_update_contract_address|[`eth method`](#eth-method)|
|eth_withdraw_token_method|[`eth method`](#eth-method)|
|eth_collect_tokens_method|[`eth method`](#eth-method)|
|eth_committee_updated_topic|[`eth topic`](#eth-topic)|
|eth_gen_address_topic|[`eth topic`](#eth-topic)|
|eth_deposit_topic|[`eth topic`](#eth-topic)|
|eth_withdraw_topic|[`eth topic`](#eth-topic)|
|erc20_deposit_topic|[`eth topic`](#eth-topic)|
|erc20_withdraw_topic|[`eth topic`](#eth-topic)|
|ETH_asset_id|[`assetId`](#protocol-object-id)|
|BTC_asset_id|[`assetId`](#protocol-object-id)|
|fines|[`fines`](#fines)|: typeof sidechainFinesSerializer,
|gas_price|[`uint64`](#integers)|
|satoshis_per_byte|[`uint32`](#integers)|
|coefficient_waiting_blocks|[`uint32`](#integers)|
|btc_deposit_withdrawal_min|[`uint64`](#integers)|
|btc_deposit_withdrawal_fee|[`uint64`](#integers)|

#### ERC20 config

[Struct](#struct) with fields:

|field|type|
|-|-|
|contract_code|[`string`](#string)|
|create_token_fee|[`uint64`](#integers)|
|transfer_topic|[`eth topic`](#eth-topic)|
|check_balance_method|[`eth method`](#eth-method)|
|burn_method|[`eth method`](#eth-method)|
|issue_method|[`eth method`](#eth-method)|

<hr/>

## Protocol

Protocol contains all serializers of operations' properties.

* **account**
  * `options`
  * `create`
  * `update`
  * `whitelist`
  * `transfer`
  * `addressCreate`
* **asset**
  * `priceFeed`
  * `price`
  * `options`
  * `bitassetOptions`
  * `create`
  * `update`
  * `updateBitasset`
  * `updateFeedProducers`
  * `issue`
  * `reserve`
  * `fundFeePool`
  * `publishFeed`
  * `claimFees`
* `authority`
* **balance**
  * `claim`
  * `freeze`
  * `unfreeze`
* **committeeFrozenBalance**
  * `deposit`
  * `withdraw`
* **committeeMember**
  * `chainParameters`
  * `create`
  * `update`
  * `updateGlobalParameters`
  * `activate`
  * `deactivate`
* **contract**
  * `base`
  * `create`
  * `call`
  * `fundPool`
  * `whitelist`
  * `update`
  * `internalCreate`
  * `internalCall`
  * `selfdestruct`
* `ethAddress`
* `feeParameters`
* `feeSchedule`
* **proposal**
  * `create`
  * `update`
  * `delete`
* **sidechain**
  * `changeConfig`
  * **eth**
    * `createAddress`
    * `approveAddress`
    * `deposit`
    * `withdraw`
    * `approveWithdraw`
    * `issue`
    * `burn`
  * **erc20**
    * `registerToken`
    * `depositToken`
    * `withdrawToken`
    * `approveTokenWithdraw`
* **transfer**
  * `default`
  * `override`
  * `toAddress`
* **vesting**
  * `balanceCreate`
  * `policyInitializer`
  * `linearPolicyInitializer`
  * `cddPolicyInitializer`
  * `balanceWithdraw`
* `voteId`
* `VoteIdSerializer`

Example:
```ts
import { serializers } from "echojs-lib";
const transfer = serializers.protocol.transfer.default;
console.log(transfer.toRaw({
	fee: { amount: new BigNumber(123), asset_id: '1.3.5' },
	from: '1.2.123',
	to: 234,
	amount: { amount: 345, asset_id: 7 },
	extensions: undefined,
}));
/**
 * { fee: { amount: '123', asset_id: '1.3.5' },
 *   from: '1.2.123',
 *   to: '1.2.234',
 *   amount: { amount: '345', asset_id: '1.3.7' },
 *   extensions: [] }
 */
```

<hr/>

## Operation
[Static variant](#static-variant), where key is `operationId` and value is properties of operation with this id.

```ts
import { serializers, OPERATIONS_IDS } from "echojs-lib";
const serializedOp = serializers.operation.serialize([
	OPERATIONS_IDS.ACCOUNT_CREATE,
  {
		fee: { amount: 123, asset_id: '1.3.5' },
		registrar: '1.2.123',
		name: 'somenewaccount',
		active: {
			weight_threshold: 2,
			account_auths: { '1.2.234': 1 },
			key_auths: { ECHO6sCu8oaqyoRGvzSHuiiytDpGVwnCGjB75RRcbQwZnb1Q: 1 },
		},
		echorand_key: 'ECHO6sCu8oaqyoRGvzSHuiiytDpGVwnCGjB75RRcbQwZnb1Q',
		options: {
			delegating_account: '1.2.456',
			delegate_share: 0,
		},
		// extensions: undefined, // optional
	},
]);
// '037b00000000000000057b0e736f6d656e65776163636f756e740200000001ea0101000...'
```
