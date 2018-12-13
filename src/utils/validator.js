const idRegex = /\b\d+\.\d+\.(\d+)\b/;

export const isArray = (v) => Array.isArray(v) && v.length !== undefined;

export const isEmpty = (v) => v == null || v.length === 0;

export const isNumber = (v) => !Number.isNaN(Number(v));

export const isFunction = (v) => typeof v === 'function';

export const isBoolean = (v) => typeof v === 'boolean';

export const isObjectId = (v) => {
	if (typeof v !== 'string') {
		return false;
	}

	const match = idRegex.exec(v);
	return (match !== null && v.split('.').length === 3);

};

export const isValidAssetName = (value) => {
    const suffix = 'Asset name should';
    if (chainValidation.is_empty(value)) {
        return `${suffix} not be empty.`;
    }
    if (value.split('.').length > 2) {
        return `${suffix} have only one dot.`;
    }
    if (value.length < 3) {
        return `${suffix} be longer.`;
    }
    if (value.length > 16) {
        return `${suffix} be shorter.`;
    }
    if (!/^[A-Z]/.test(value)) {
        return `${suffix} start with a letter.`;
    }
    if (!/[A-Z]$/.test(value)) {
        return `${suffix} end with a letter.`;
    }
    if (/^[A-Z0-9.]$/.test(value)) {
        return `${suffix} contain only letters numbers and perhaps a dot.`;
    }
    return null;
},

