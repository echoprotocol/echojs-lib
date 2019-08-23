import { StructSerializer } from '../collections';

/** @typedef {import("../basic/integers").Int64Serializer} Int64Serializer */
/** @typedef {import("../chain/id").AssetIdSerializer} AssetIdSerializer */

/**
 * @typedef {Object} SerializerStruct
 * @property {Int64Serializer} amount
 * @property {AssetIdSerializer} asset_id
 */

/** @augments {StructSerializer<SerializerStruct>} */
export default class AssetSerializer extends StructSerializer {
}
