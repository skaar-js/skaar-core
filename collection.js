import {isArr, isFun, isList, isObj, isStr, isVal} from "./type";

const UNSAFE_PROPS = ['__proto__', 'constructor', '__defineGetter__', '__defineSetter__', 'prototype'];

/**
 * Create empty instance of given source
 *
 * @param {any} src - source object
 * @param {any} [def] - default value for primitives
 * @returns {any} empty instance of src
 */
export function emptyOf(src, def) {
    return isStr(src) ? "" : isList(src) ? [] : isArr(src) ? [] : !isObj(src) ? (def||{}) : !Object.getPrototypeOf(src) ? {} : Object.create(Object.getPrototypeOf(src));
}

/**
 * Combines two Strings, Arrays or Objects
 *
 * @param {Array|String|Object} target
 * @param {Array|String|Object} source
 * @param {Boolean} [override] - override previous values
 * @returns {Array|String|Object}
 */
export function concat(target, source, override=false) {
    if (isStr(target)) {
        return target.concat(source);
    }
    if (isArr(target)) {
        return target.concat(source);
    }

    for (let k of Object.keys(source)) {
        if (!target[k] || override)
            target[k] = source[k];
    }
    return target
}

/**
 * Source contains value or key:value
 *
 * @param {Array|Object|String} src
 * @param {any} value
 * @param {String|undefined} [key]
 * @returns {boolean}
 */
function contains(src, value, key) {
    return !isVal(src) ? false : !(!isArr(src) && isObj(src)) ? src.indexOf(value) >= 0 : src[key] === value;
}

/**
 * forEach on object properties - Object.getOwnPropertyNames()
 *
 * @param {Object} obj - source object
 * @param {function(value: any, key: String, index: Number)} fn - loop function
 */
function forEachProp(obj, fn) {
    if (typeof obj !== "object") throw TypeError('forEachProp: first argument must be object');
    const ps = Object.getOwnPropertyNames(obj);
    const len = ps.length;
    for (let i = 0; i < len; i++) {
        const k = ps[i];
        const v = obj[k];
        fn(v, k, i);
    }
}

/**
 * forEach on object keys - Object.keys()
 *
 * @param {Object} obj - source object
 * @param {function(value: any, key: String, index: Number)} fn - loop function
 */
export function forEachKey(obj, fn) {
    if (typeof obj !== "object") throw TypeError('forEachKey: first argument must be object');
    const ps = Object.keys(obj);
    const len = ps.length;
    for (let i = 0; i < len; i++) {
        const k = ps[i];
        const v = obj[k];
        fn(v, k, i);
    }
}

/**
 * Compose new object using predicate on Object.keys()
 * @param {Object} obj - source object
 * @param {function(value: any, key: String, index: Number): boolean} fn
 */
export function pickKeys(obj, fn) {
    if (typeof obj !== "object") throw TypeError('pickByKeys: first argument must be object');
    const ob = {};
    const ps = Object.keys(obj);
    const len = ps.length;
    for (let i = 0; i < len; i++) {
        const k = ps[i];
        const v = obj[k];
        if (fn(v, k, i)) {
            ob[k] = v;
        }
    }
    return ob
}

/**
 * Compose new object using predicate on Object.getOwnPropertyNames()
 * @param {Object} obj - source object
 * @param {function(value: any, key: String, index: Number): boolean} fn
 */
export function pickProps(obj, fn) {
    if (typeof obj !== "object") throw TypeError('pickByProps: first argument must be object');
    const ob = {};
    const ps = Object.getOwnPropertyNames(obj);
    const len = ps.length;
    for (let i = 0; i < len; i++) {
        const k = ps[i];
        const v = obj[k];
        if (fn(v, k, i)) {
            ob[k] = v;
        }
    }
    return ob
}


/**
 * Recursive deep merge {@param target} with {@param source}
 *
 * @param {Object|Array} target
 * @param {Object|Array} source
 * @param {Array} excludeKeys - keys to be skipped while merging
 * @param maxDepth - maximum recursive depth
 * @param allowUnsafeProps - allow unsafe properties like __proto__
 * @param depth - recursion depth
 * @return {Object|Array}
 */
export function deepMerge(target,
                   source,
                   {
                       excludeKeys = [],
                       maxDepth = 999,
                       allowUnsafeProps = false
                   } = {excludeKeys: [], maxDepth: 999, allowUnsafeProps: false},
                   depth = 0) {
    if (depth >= maxDepth) return target;
    const fn = (v, k) => {
        if (excludeKeys && contains(excludeKeys, k)) return;
        if (allowUnsafeProps && contains(UNSAFE_PROPS, k)) return;
        if (isObj(v)) {
            target[k] = deepMerge(emptyOf(v, {}), v, {excludeKeys, maxDepth, depth: depth + 1});
        } else
            target[k] = v;
    };
    if (isArr(source)) {
        for (let i = 0; i < source.length; i++) {
            fn(source[i], i);
        }
    } else {
        forEachProp(source, fn);
    }
    return target;
}

/**
 * Recursive deep clone {@param source}
 * @see deepMerge
 *
 * @param {Object|Array} source
 * @param {Array} excludeKeys - keys to be skipped while merging
 * @param {Number} [maxDepth] - maximum recursive depth
 * @param {boolean} [allowUnsafeProps] - allow unsafe properties like __proto__
 * @return {Object|Array}
 */
export function deepClone(source,
                   {
                       excludeKeys = [],
                       maxDepth = 999,
                       allowUnsafeProps = false
                   } = {excludeKeys: [], maxDepth: 999, allowUnsafeProps: false},) {
    return deepMerge(emptyOf(source), source, {excludeKeys, maxDepth, allowUnsafeProps})
}

/**
 * Sort array ascending with optional field parameter
 * @param {ArrayLike} arrayLike
 * @param {Function} [fieldFn]
 * @param {String} [locale]
 */
export function sortAsc(arrayLike, fieldFn, locale='en') {
    let compare = fieldFn?function (a,b){
        return (''+fieldFn(a)).localeCompare(''+fieldFn(b),locale)
    }:undefined
    return Array.prototype.sort.call(arrayLike, compare)
}

/**
 * Sort array descending with optional field parameter
 * @param {ArrayLike} arrayLike
 * @param {Function} [fieldFn]
 * @param {String} [locale]
 */
export function sortDesc(arrayLike, fieldFn, locale='en') {
    let compare = fieldFn?function (a,b){
        return (''+fieldFn(b)).localeCompare(''+fieldFn(a),locale)
    }:undefined
    return Array.prototype.sort.call(arrayLike, compare)
}

/**
 * Randomly shuffle array's items
 * @param {ArrayLike} arrayLike
 */
export function shuffle(arrayLike) {
    return Array.prototype.sort.call(arrayLike, ()=>Math.random()-0.5)
}

/**
 * A more versatile alternative to native "flatMap" method, flattens first level items
 *
 * @param {Array} src - source
 * @param {Function} [transform] - transform function
 * @returns {Array}
 */
export function flatMap(src, transform) {
    let res;
    if (isStr(src)) res = ""
    else if (isArr(src)) res = []
    else res = {};
    for (let i = 0; i < src.length; i++) {
        const a = src[i];
        let f;
        if (transform) {
            f = transform(a, i, src);
        } else {
            if (!isArr(res) && isObj(res)) {
                f = {};
                f[i] = a;
            } else {
                f = a
            }
        }
        res = concat(res, f);
    }
    return res;
}

/**
 * Find max index
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} list
 * @param {Function} pred - predicate function/key
 * @return {number}
 */
export function maxIndex(list, pred) {
    let mx;
    let index = -1;
    for (let i = 0; i < list.length; i++) {
        const ix = list[i];
        let x = pred(i, ix);
        if (!mx) {
            mx = x;
            index = ix;
        } else if (x >= mx) {
            mx = x;
            index = ix;
        }
    }
    return index;
}

/**
 * Find max
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} list
 * @param {Function|String} pred - predicate function/key
 * @return {number}
 */
export function max(list, pred) {
    return list[maxIndex(list, pred)];
}

/**
 * Find min index
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} list
 * @param {Function|String} pred - predicate function/key
 * @return {number}
 */
export function minIndex(list, pred) {
    let mn;
    let index = -1;
    for (let i = 0; i < list.length; i++) {
        const ix = list[i];
        let x = pred(i, ix);
        if (!mn) {
            mn = x;
            index = ix;
        } else if (x <= mn) {
            mn = x;
            index = ix;
        }
    }
    return index;
}

/**
 * Find min
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} list
 * @param {Function|String} pred - predicate function/key
 * @return {number}
 */
export function min(list, pred) {
    return list[minIndex(list, pred)];
}

function _keyGen(key, fnName) {
    let keyGen = key
    if (isStr(key)) {
        keyGen = (item)=> item[key]
    } else if (isArr(key)) {
        keyGen = (item) => item.reduce((res, v, k)=> {
            if (contains(key, k)) {
                return res + v;
            }
        }, "")
    } else if (!isFun(key)) {
        throw Error(`${fnName} key only accepts: String, [String,...], Function`)
    }
    return keyGen;
}

/**
 * Join arrays of objects based on a generated or static key
 *
 * @param {Function|String} key
 * @param {Object[]} lists
 * @return {Object}
 */
export function join(key, ...lists) {
    if (lists.length === 0) return [];
    if (!lists.every(isArr)) throw Error("Join only accepts arrays of data!");
    let keyGen = _keyGen(key, "Join");
    const joined = {};
    const len1 = lists.length;
    for (let i1 = 0; i1 < len1; i1++){
        const list = lists[i1];
        const len = list.length;
        for (let i = 0; i < len; i++){
            const item = list[i];
            const joinKey = keyGen(item);
            const presentValue = joined[joinKey];
            if (!presentValue) {
                joined[joinKey] = item;
            } else {
                joined[joinKey] = concat(presentValue, item);
            }
        }
    }

    return (joined);
}

/**
 * Group array of objects based on generated or static key(s)
 *
 * @param {Function|String} key
 * @param {Object[]} lists
 * @return {Object}
 */
export function groupBy(key, ...lists) {
    if (lists.length === 0) return {};
    if (!lists.every(isArr)) throw TypeError("groupBy only accepts 2d array of data!");
    let keyGen = _keyGen(key, "groupBy")
    const group = {};
    for (let i1 = 0; i1 < lists.length; i1++){
        let list = lists[i1];
        for (let i = 0; i < list.length; i++){
            let item = list[i];
            const joinKey = keyGen(item);
            const presentValue = group[joinKey];
            if (!presentValue) {
                group[joinKey] = [item];
            } else {
                group[joinKey] = concat(presentValue, item)
            }
        }
    }

    return (group)

}