/**
 * If is class or function return class/function name else returns typeof
 * @param x
 * @return {"undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"|*}
 */
export function typeName(x) {
    return x.hasOwnProperty('constructor')?x.constructor.name:typeof x;
}

/** Is undefined
 * @param x
 * @returns {boolean}
 */
export function isUnd(x) {
    return x !== null && x === undefined;
}

/** Is null
 * @param x
 * @return {boolean}
 */
export function isNull(x) {
    return x === null;
}

/** Is value !null && !undefined
 * @param x
 * @return {boolean}
 */
export function isVal(x) {
    return x != null
}

/** Is number
 * @param x
 * @return {boolean}
 */
export function isNum(x) {
    return typeof x === "number";
}

/** Is string|String
 * @param x
 * @return {boolean}
 */
export function isStr(x) {
    return typeof x === "string" || x instanceof String;
}

/** Is function
 * @param x
 * @return {boolean}
 */
export function isFun(x) {
    return typeof x === "function";
}

/** Is object
 * @param x
 * @return {boolean}
 */
export function isObj(x) {
    return x !== null && typeof x === "object";
}

/** Is Array
 * @param x
 * @return {boolean}
 */
export function isArr(x) {
    return x instanceof Array
}

/** Is primitive isVal && !isObj && !isFun
 * @param x
 * @return {boolean}
 */
export function isPrim(x) {
    return isVal(x) && !isObj(x) && !isFun(x) || typeof x === 'symbol';
}

/** Is List (has length property and item() function)
 * @param x
 * @return {boolean}
 */
export function isList(x) {
    return isVal(x.length) && isFun(x.item)
}

/** Is MutableList (has length property, item() and add() functions)
 * @param x
 * @return {boolean}
 */
export function isMutableList(x) {
    return isVal(x.length) && isFun(x.item) && isFun(x.add)
}

/** Is Set type
 * @param x
 * @return {boolean}
 */
export function isSet(x) {
    return x instanceof Set
}

/** Is Map type
 * @param x
 * @return {boolean}
 */
export function isMap(x) {
    return x instanceof Map
}

/** Is Error type
 * @param x
 * @return {boolean}
 */
export function isError(x) {
    return x instanceof Error
}

/** Is Element/Node
 * @param x
 * @return {boolean}
 */
export function isEl(x) {
    return x instanceof Element || x instanceof HTMLElement || x instanceof Node;
}

/** Is NodeList || HTMLCollection
 * @param x
 * @return {boolean}
 */
export function isEls(x) {
    return x instanceof HTMLCollection || x instanceof NodeList;
}

/**
 * Object has field
 * @param {Object} obj - source object
 * @param {String} field - field/property name
 * @param {Function} [pred] - optional predicate function to check field
 * @return {boolean}
 */
export function hasField(obj, field, pred) {
    return isVal(obj)?(isFun(pred)?pred(obj[field]):obj.hasOwnProperty(field)):false;
}

/** Is Empty Array/List/Object/String
 * @param x
 * @return {boolean}
 */
export function isEmpty(x) {
    return !hasField(x, 'length') ? !isFun(x) ? !isObj(x) ? true : Object.keys(x).length <= 0 : false : x.length <= 0;
}