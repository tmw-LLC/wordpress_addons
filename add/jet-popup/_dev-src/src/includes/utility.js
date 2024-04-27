export default {
	isObject,
	isNotEmpty,
	isEmpty,
	isValidUrl,
	isFunction,
	getUrlParams,
	debounce,
	jsonToObj,
	objToJson,
	borderStrToObj,
	objToBorderStr,
	boxShadowStrToObj,
	objToBoxShadowStr,
	toBoolean,
	boolToVerbose,
	isEqual,
	isEmptyValue
}

/**
 *
 * @param x
 * @returns {boolean}
 */
export function isObject(x) {
	return typeof x === 'object' && x !== null;
};

/**
 *
 * @param obj
 * @returns {boolean}
 */
export function isNotEmpty(obj) {
	switch (obj.constructor) {
		case Object:
			return Object.entries(obj).length ? true : false;
		case Array:
			return obj.length ? true : false;
		case String:
			return obj.length ? true : false;
	}

	return obj ? true : false;
}

/**
 *
 * @param obj
 * @returns {boolean}
 */
export function isEmpty(obj) {
	return !isNotEmpty(obj);
}

/**
 *
 * @param string
 * @returns {boolean}
 */
export function isValidUrl(string) {
	try {
		new URL(string);
	} catch (_) {
		return false;
	}

	return true;
}

/**
 *
 * @param variableToCheck
 * @returns {boolean}
 */
export function isFunction(variableToCheck) {
	return variableToCheck instanceof Function ? true : false;
}

/**
 *
 * @returns {{}}
 */
export function getUrlParams() {
	const search = decodeURIComponent(window.location.search),
		hashes = search.slice(search.indexOf('?') + 1).split('&'),
		params = {};

	hashes.map(hash => {
		const [key, val] = hash.split('=');
		params[key] = val;
	})

	return params;
}

/**
 *
 * @param callback
 * @param wait
 * @param immediate
 * @returns {(function(): void)|*}
 */
export function debounce(callback, wait, immediate = false) {
	let timeout = null

	return function () {
		const callNow = immediate && !timeout
		const next = () => callback.apply(this, arguments)

		clearTimeout(timeout)
		timeout = setTimeout(next, wait)

		if (callNow) {
			next()
		}
	}
}

/**
 *
 * @param json
 * @returns {string|any}
 */
export function jsonToObj( json = '' ) {

	if ( 'string' !== typeof json ) {
		return json;
	}

	return JSON.parse( json );
}

/**
 *
 * @param obj
 * @returns {string|{}}
 */
export function objToJson( obj = {} ) {

	if ( 'object' !== typeof obj ) {
		return obj;
	}

	return JSON.stringify( obj );
}

/**
 *
 * @param borderStr
 * @returns {boolean|{color: string, width: string, style: string}}
 */
export function borderStrToObj( borderStr = '' ) {

	if ( isEmpty( borderStr ) ) {
		return false;
	}

	let params = borderStr.split( ' ' );

	if ( isEmpty( params ) ) {
		return false;
	}

	return {
		width: params[0],
		style: params[1],
		color: params[2],
	};
}

/**
 *
 * @param obj
 * @returns {string}
 */
export function objToBorderStr( obj = {} ) {

	if ( isEmpty( obj ) ) {
		return '';
	}

	if ( ! obj.hasOwnProperty( 'width' ) || ! obj.hasOwnProperty( 'style' ) || ! obj.hasOwnProperty( 'color' ) ) {
		return '';
	}

	return `${ obj.width } ${ obj.style } ${ obj.color }`;
}

/**
 *
 * @param shadowStr
 * @returns {{offsetX: string, offsetY: string, color: string, blurRadius: string}|boolean|{offsetX: number, offsetY: number, color: string, blurRadius: number}}
 */
export function boxShadowStrToObj( shadowStr = '' ) {

	if ( isEmpty( shadowStr ) ) {
		return false;
	}

	if ( 'none' === shadowStr ) {
		return {
			offsetX: '0px',
			offsetY: '0px',
			blurRadius: '0px',
			color: '#000',
		};
	}

	let params = shadowStr.split( ' ' );

	if ( isEmpty( params ) ) {
		return false;
	}

	return {
		offsetX: params[0],
		offsetY: params[1],
		blurRadius: params[2],
		color: params[3],
	};
}

/**
 *
 * @param obj
 * @returns {string}
 */
export function objToBoxShadowStr( obj = {} ) {

	if ( isEmpty( obj ) ) {
		return 'none';
	}

	if ( ! obj.hasOwnProperty( 'offsetX' ) || ! obj.hasOwnProperty( 'offsetY' ) || ! obj.hasOwnProperty( 'blurRadius' ) || ! obj.hasOwnProperty( 'color' ) ) {
		return 'none';
	}

	if ( '0px' === obj.offsetX && '0px' === obj.offsetY && '0px' === obj.blurRadius ) {
		return 'none';
	}

	return `${ obj.offsetX } ${ obj.offsetY } ${ obj.blurRadius } ${ obj.color }`;
}

/**
 *
 * @param value
 * @returns {boolean}
 */
export function toBoolean( value ) {

	if ( 'yes' === value ) {
		return true;
	}

	if ( 'no' === value ) {
		return false;
	}

	return !!value;
}

/**
 *
 * @param value
 * @param other
 * @returns {boolean}
 */
export function isEqual(value, other) {
	let type = Object.prototype.toString.call(value);

	if (type !== Object.prototype.toString.call(other)) {
		return false;
	}

	if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
		return false;
	}

	let valueLen = type === '[object Array]' ? value.length : Object.keys(value).length,
		otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;

	if (valueLen !== otherLen) {
		return false;
	}

	let compare = function (item1, item2) {
		let itemType = Object.prototype.toString.call(item1);

		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!isEqual(item1, item2)) {
				return false;
			}
		} else {
			if (itemType !== Object.prototype.toString.call(item2)) {
				return false;
			}

			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) {
					return false;
				}
			} else {
				if (item1 !== item2) {
					return false;
				}
			}
		}
	};

	if (type === '[object Array]') {
		for (let i = 0; i < valueLen; i++) {
			if (compare(value[i], other[i]) === false) {
				return false;
			}
		}
	} else {
		for (let key in value) {
			if (value.hasOwnProperty(key)) {
				if (compare(value[key], other[key]) === false) {
					return false;
				}
			}
		}
	}

	return true;
};

/**
 *
 * @param value
 * @returns {string}
 */
export function boolToVerbose( value ) {
	return value ? 'yes' : 'no';
}

/**
 *
 * @param value
 * @returns {string}
 */
export function isEmptyValue( value ) {
	const emptyValueMap = [
		false,
		'',
		'none',
	];

	return emptyValueMap.includes( value );
}

