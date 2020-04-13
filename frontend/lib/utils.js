export const isEmpty = (target) => {
    let objType = typeof target;
    if(objType === 'undefined'){
        return true;
    }
    if(target === null){
        return true;
    }
    if(objType === 'object'){
        return Object.keys(target).length === 0;
    }
    if(objType === 'string'){
        return target.length < 1;
    }
    if(isNaN(target)){
        return true;
    }
    if(objType === 'number'){
        return target === 0;
    }
    if(objType === 'boolean'){
        return target;
    }
    return target;
};

export const dateObjToStr = (dateObj = new Date()) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString(undefined, options);
};

export const removeFromArray = (array=[], value) => {
    let index = array.indexOf(value);
    if (index >= 0) {
        array.splice( index, 1 );
    }
    return array;
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