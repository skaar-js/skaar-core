'use strict';

/**
 * If is class or function return class/function name else returns typeof
 * @param x
 * @return {"undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"|*}
 */
function typeName(x) {
    return x.hasOwnProperty('constructor')?x.constructor.name:typeof x;
}

/** Is undefined
 * @param x
 * @returns {boolean}
 */
function isUnd(x) {
    return x !== null && x === undefined;
}

/** Is null
 * @param x
 * @return {boolean}
 */
function isNull(x) {
    return x === null;
}

/** Is value !null && !undefined
 * @param x
 * @return {boolean}
 */
function isVal(x) {
    return x != null
}

/** Is number
 * @param x
 * @return {boolean}
 */
function isNum(x) {
    return typeof x === "number";
}

/** Is string|String
 * @param x
 * @return {boolean}
 */
function isStr(x) {
    return typeof x === "string" || x instanceof String;
}

/** Is function
 * @param x
 * @return {boolean}
 */
function isFun(x) {
    return typeof x === "function";
}

/** Is object
 * @param x
 * @return {boolean}
 */
function isObj(x) {
    return x !== null && typeof x === "object";
}

/** Is Array
 * @param x
 * @return {boolean}
 */
function isArr(x) {
    return x instanceof Array
}

/** Is primitive isVal && !isObj && !isFun
 * @param x
 * @return {boolean}
 */
function isPrim(x) {
    return isVal(x) && !isObj(x) && !isFun(x) || typeof x === 'symbol';
}

/** Is List (has length property and item() function)
 * @param x
 * @return {boolean}
 */
function isList(x) {
    return isVal(x.length) && isFun(x.item)
}

/** Is MutableList (has length property, item() and add() functions)
 * @param x
 * @return {boolean}
 */
function isMutableList(x) {
    return isVal(x.length) && isFun(x.item) && isFun(x.add)
}

/** Is Set type
 * @param x
 * @return {boolean}
 */
function isSet(x) {
    return x instanceof Set
}

/** Is Map type
 * @param x
 * @return {boolean}
 */
function isMap(x) {
    return x instanceof Map
}

/** Is Error type
 * @param x
 * @return {boolean}
 */
function isError(x) {
    return x instanceof Error
}

/** Is Element/Node
 * @param x
 * @return {boolean}
 */
function isEl(x) {
    return x instanceof Element || x instanceof HTMLElement || x instanceof Node;
}

/** Is NodeList || HTMLCollection
 * @param x
 * @return {boolean}
 */
function isEls(x) {
    return x instanceof HTMLCollection || x instanceof NodeList;
}

/**
 * Object has field
 * @param {Object} obj - source object
 * @param {String} field - field/property name
 * @param {Function} [pred] - optional predicate function to check field
 * @return {boolean}
 */
function hasField(obj, field, pred) {
    return isVal(obj)?(isFun(pred)?pred(obj[field]):obj.hasOwnProperty(field)):false;
}

/** Is Empty Array/List/Object/String
 * @param x
 * @return {boolean}
 */
function isEmpty(x) {
    return !hasField(x, 'length') ? !isFun(x) ? !isObj(x) ? true : Object.keys(x).length <= 0 : false : x.length <= 0;
}

var type = /*#__PURE__*/Object.freeze({
    __proto__: null,
    typeName: typeName,
    isUnd: isUnd,
    isNull: isNull,
    isVal: isVal,
    isNum: isNum,
    isStr: isStr,
    isFun: isFun,
    isObj: isObj,
    isArr: isArr,
    isPrim: isPrim,
    isList: isList,
    isMutableList: isMutableList,
    isSet: isSet,
    isMap: isMap,
    isError: isError,
    isEl: isEl,
    isEls: isEls,
    hasField: hasField,
    isEmpty: isEmpty
});

const UNSAFE_PROPS = ['__proto__', 'constructor', '__defineGetter__', '__defineSetter__', 'prototype'];

/**
 * Create empty instance of given source
 *
 * @param {any} src - source object
 * @param {any} [def] - default value for primitives
 * @returns {any} empty instance of src
 */
function emptyOf(src, def) {
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
function concat(target, source, override=false) {
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
function forEachKey(obj, fn) {
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
function pickKeys(obj, fn) {
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
function pickProps(obj, fn) {
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
 * @return {Object|Array}
 */
function deepMerge(target,
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

var collection = /*#__PURE__*/Object.freeze({
    __proto__: null,
    emptyOf: emptyOf,
    concat: concat,
    forEachKey: forEachKey,
    pickKeys: pickKeys,
    pickProps: pickProps,
    deepMerge: deepMerge
});

/**
 * Throttle function execution.
 * {@link https://css-tricks.com/debouncing-throttling-explained-examples/}
 *
 * @param {Function} func - function
 * @param {Number} intervalMs
 * @return {Function} - throttled function
 */
function throttle(func, intervalMs) {
    var ___last___ = new Date().getTime();
    function throttled(args) {
        if (new Date().getTime()-___last___ >= intervalMs) {
            ___last___ = new Date().getTime();
            func.call(this, args);
        }
    }
    return throttled;
}

/**
 * Debounce function execution.
 * {@link https://css-tricks.com/debouncing-throttling-explained-examples/}
 *
 * @param {Function} func - function
 * @param {Number} afterMs - milliseconds after last call
 * @return {Function} - debounced function
 */
function debounce(func, afterMs) {
    var ___timeout___ = null;

    function debounced(...args) {
        clearTimeout(___timeout___);
        ___timeout___ = setTimeout(function (_this) {
            return func.apply(_this, args)
        }, afterMs, this);

    }

    debounced.flush = function (...args) {
        clearTimeout(___timeout___);
        return func.apply(this, args)
    };
    return debounced
}

/**
 * Bind args to function and return a no-arg function
 * @param {Function} func - source function
 * @param {any[]} args - array of arguments to bind
 * @return {Function}
 */
function bindArgs(func, args) {
    return function () {return func.apply(this,args)}
}

function once(func) {
    var called = false;
    return function () {
        if (!called) {
            called = true;
            return func.apply(this, arguments)
        }
    }
}

var functions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    throttle: throttle,
    debounce: debounce,
    bindArgs: bindArgs,
    once: once
});

var bundle = {
    ...type,
    ...collection,
    ...functions
};

module.exports = bundle;
