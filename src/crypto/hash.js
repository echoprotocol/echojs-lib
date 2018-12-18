import createHash from 'create-hash';

export const sha1 = (data, encoding) => createHash('sha1').update(data).digest(encoding);

export const sha256 = (data, encoding) => createHash('sha256').update(data).digest(encoding);

export const sha512 = (data, encoding) => createHash('sha512').update(data).digest(encoding);

export const ripemd160 = (data) => createHash('rmd160').update(data).digest();
