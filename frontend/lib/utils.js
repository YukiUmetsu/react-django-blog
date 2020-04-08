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