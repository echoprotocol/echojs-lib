import createHash from 'create-hash';
import createHmac from 'create-hmac';

/**
 *  @method sha1
 *
 *  @param  {String|Buffer} data
 *  @param  {String} encoding [hex', 'binary' or 'base64']
 *
 *  @return {String|Buffer} [Buffer when digest is null, or string]
 */
export function sha1(data, encoding) {
	return createHash('sha1').update(data).digest(encoding);
}

/**
 *  @method sha256
 *
 *  @param  {String|Buffer} data
 *  @param  {String} encoding [hex', 'binary' or 'base64']
 *
 *  @return {String|Buffer} [Buffer when digest is null, or string]
 */
export function sha256(data, encoding) {
	return createHash('sha256').update(data).digest(encoding);
}

/**
 *  @method sha512
 *
 *  @param  {String|Buffer} data
 *  @param  {String} encoding [hex', 'binary' or 'base64']
 *
 *  @return {String|Buffer} [Buffer when digest is null, or string]
 */
export function sha512(data, encoding) {
	return createHash('sha512').update(data).digest(encoding);
}

/**
 *  @method HmacSHA256
 *
 *  @param  {Buffer} buffer
 *  @param  {Buffer} secret
 *
 *  @return {String|Buffer} [Buffer when digest is null, or string]
 */
export function HmacSHA256(buffer, secret) {
	return createHmac('sha256', secret).update(buffer).digest();
}

/**
 *  @method ripemd160
 *
 *  @param  {Buffer} data
 *
 *  @return {String|Buffer} [Buffer when digest is null, or string]
 */
export function ripemd160(data) {
	return createHash('ripemd160').update(data).digest();
}

export default {
	sha1, sha256, sha512, HmacSHA256, ripemd160,
};
