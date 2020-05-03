import moment from 'moment'
import {SORT_ORDER} from "../constants";
import React from "react";

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
        if(typeof window !== 'undefined' && target instanceof File){
            return false;
        }
        return Object.keys(target).length === 0;
    }
    return target;
};

export const formatDate = (dateObj, formatStr='MMMM Do YYYY') => {
    if(typeof dateObj === 'string'){
        dateObj = new Date(dateObj);
    }
    return moment(dateObj).format(formatStr);
};

export const getLocalStorageItem = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

export const setLocalStorageItem = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const removeFromLocalStorage = (key, idsToDelete = []) => {
    let localStorageData = getLocalStorageItem(key);
    let newLocalData = localStorageData.filter((item) => {
        return !idsToDelete.includes(item.id);
    });
    setLocalStorageItem(key, newLocalData);
};

export const removeFromData = (idsToDelete, data) => {
    return data.filter(item => {
        return !idsToDelete.includes(item.id);
    });
};

export const getTableColumnInfo = columns => {
    let newColumnData = {
        imageColumns: [],
        booleanColumns: [],
        dateColumns: [],
        increaseColumns: [],
        decreaseColumns: [],
    };
    columns.filter(item => {
        return !item.hideOnDisplay;
    }).map((column,index) => {
        if (column.type === 'image') {
            newColumnData.imageColumns.push(index);
        } else if(column.type === 'boolean'){
            newColumnData.booleanColumns.push(index);
        } else if(column.type === 'date'){
            newColumnData.dateColumns.push(index);
        } else if(column.type === 'increase'){
            newColumnData.increaseColumns.push(index);
        } else if(column.type === 'decrease'){
            newColumnData.decreaseColumns.push(index);
        }
    });
    newColumnData.columns = columns;
    return newColumnData;
};

export const removeFromArray = (array=[], value) => {
    let index = array.indexOf(value);
    if (index >= 0) {
        array.splice( index, 1 );
    }
    return array;
};

export const removeFromMutableObject = (object, givenKey) => {
    let keys = Object.keys(object);
    keys.forEach((key, index, arr) => {
        if(key === givenKey){
            delete object[key];
        }
    });
};

export const createSortOrderMap = () => {
    let map = {};
    map[SORT_ORDER.NONE] = SORT_ORDER.ASC;
    map[SORT_ORDER.ASC] = SORT_ORDER.DESC;
    map[SORT_ORDER.DESC] = SORT_ORDER.ASC;
    return map;
};


export const dClone = (o) => {
    let output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? Object.assign({}, v) : v;
    }
    return output;
};

export const getObjIdsToAdd = (newData, totalIdPool) => {
    let idsToAdd = [];
    for (let i = 0; i < newData.length; i++) {
        let id = newData[i]['id'];
        if(!totalIdPool.includes(id)){
            idsToAdd.push(id);
        }
    }
    return idsToAdd;
};

export const getObjsToAdd = (newData, totalIdPool) => {
    let objsToAdd = [];
    for (let i = 0; i < newData.length; i++) {
        let id = newData[i]['id'];
        if(!totalIdPool.includes(id)){
            objsToAdd.push(newData[i]);
        }
    }
    return objsToAdd;
};

export const addDataItem = (dataItem, data) => {
    let newData = dClone(data);
    newData.push(dataItem);
    return newData;
};

export const replaceDataItem = (dataItem, data) => {
    return dClone(data).map(item => {
        if(item.id === dataItem.id){
            return dataItem;
        }
        return item;
    });
};

export const removeDuplicatesById = (data = []) => {
    let ids = [];
    let newData = [];
    for (let i = 0; i < data.length; i++) {
        let id = data[i].id;
        if(!ids.includes(id)){
            ids.push(id);
            newData.push(data[i]);
        }
    }
    return newData;
};

export const getDisplayContentFromObj = (column, rowObj) => {
    const columnAccessor = column.accessor;
    const content = rowObj[columnAccessor];

    if(isEmpty(column) || isEmpty(content)){
        return '';
    }
    if(column.type === "boolean"){
        return isEmpty(rowObj[column.accessor]) ? "No" : "Yes";
    }

    let isNested = column.nested;
    let isMultiple = column.multiple;
    if(!isNested && !isMultiple){
        return content
    } else if(isNested && !isMultiple){
        if(content.hasOwnProperty('first_name')){
            return `${content.first_name} ${content.last_name}`;
        }
        return content[column.displayField];

    }  else if(!isNested && isMultiple){
        return content;
    } else {
        return content.map((item, index) => {
                    return item[column.displayField];
                });
    }
};

export const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
};

export const getTagStrFromTagObjList = (tagObjList = []) => {
    return tagObjList.filter(x => !isEmpty(x) && !isEmpty(x.name)).map(x => x.name).sort().join(', ')
};

export const strArrayEqual = (a = [], b = []) => {
    return a.sort().join() === b.sort().join()
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