import moment from 'moment'
import {SORT_ORDER} from "../constants";

export const isEmpty = (target) => {
    let objType = typeof target;
    if(objType === 'undefined'){
        return true;
    }
    if(target === null){
        return true;
    }
    if(objType === 'string'){
        return target.length < 1;
    }
    if(objType === 'number'){
        if(isNaN(target)){
            return true;
        }
        return target === 0;
    }
    if(objType === 'boolean'){
        return target;
    }
    if(Array.isArray(target)){
        return target.length < 1;
    }
    if(objType === 'object'){
        let isDate = typeof target.getMonth === 'function';
        if(isDate){
            return false;
        }
        if(target instanceof File){
            return false;
        }
        return Object.keys(target).length === 0;
    }
    return target;
};

export const formatDate = (dateObj, formatStr='MMMM Do YYYY') => {
    return moment(dateObj).format(formatStr);
};

export const removeFromArray = (array=[], value) => {
    let index = array.indexOf(value);
    if (index >= 0) {
        array.splice( index, 1 );
    }
    return array;
};

export const createSortOrderMap = () => {
    let map = {};
    map[SORT_ORDER.NONE] = SORT_ORDER.ASC;
    map[SORT_ORDER.ASC] = SORT_ORDER.DESC;
    map[SORT_ORDER.DESC] = SORT_ORDER.ASC;
    return map;
};

/***
 *
 * @param objects
 * @param key: key to sort by
 * @param keyType: one of ['string', 'number', 'date', 'boolean']
 * @param order: either of ['asc', 'desc']
 */
export const sortObjects = (objects = [], key, keyType= 'string', order= 'asc') => {
    let sortStrAscFunc = (a, b) => {
        let keyA = a[key].toUpperCase();
        let keyB = b[key].toUpperCase();
        if(keyA < keyB){
            return -1;
        }
        if(keyA > keyB){
            return 1;
        }
        return 0;
    };

    let sortStrDescFunc = (a, b) => {
        let keyA = a[key].toUpperCase();
        let keyB = b[key].toUpperCase();
        if(keyA < keyB){
            return 1;
        }
        if(keyA > keyB){
            return -1;
        }
        return 0;
    };

    let sortNumberAscFunc = (a, b) => {
        return a[key] - b[key];
    };

    let sortNumberDescFunc = (a, b) => {
        return b[key] - a[key];
    };

    let sortBooleanAscFunc = (a, b) => {
        if(a[key] && !b[key]){
            // a is true, b is false
            return -1;
        }
        if(!a[key] && b[key]){
            // a is false, b is true
            return 1;
        }
        return 0;
    };

    let sortBooleanDescFunc = (a, b) => {
        if(a[key] && !b[key]){
            // a is true, b is false
            return 1;
        }
        if(!a[key] && b[key]){
            // a is false, b is true
            return -1;
        }
        return 0;
    };

    let funcToUse;
    if(isEmpty(keyType)){
        keyType = 'string';
    }
    if(keyType === 'number'){
        funcToUse = (order === 'asc') ? sortNumberAscFunc : sortNumberDescFunc;
    } else if(keyType === 'string'){
        funcToUse = (order === 'asc') ? sortStrAscFunc : sortStrDescFunc;
    } else if(keyType === 'date') {
        funcToUse = (order === 'asc') ? sortNumberAscFunc : sortNumberDescFunc;
    } else if(keyType === 'boolean'){
        funcToUse = (order === 'asc') ? sortBooleanAscFunc : sortBooleanDescFunc;
    } else {
        return objects;
    }

    // create copy of the array with slice
    return objects.slice().sort(funcToUse);
};