import React, {createContext, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import {
    isEmpty,
} from "../../../lib/utils";
import OutsideComponentAlerter from "../../../hoc/Aux/OutsideComponentAlerter";
import {performDateRangeSearch, performTextSearch, performYesNoSearch} from "../../../lib/dataSearch";


export const SearchCallbackContext = createContext({updateSearchState: ()=>{}});

const DataSearcher = (props) => {

    const {originalData: originalData} = useContext(props.dataCenterContext);

    let [data, setData] = useState(originalData);
    let [searchKeys, setSearchKeys] = useState(props.searchKeys);
    let [clearSortState, setClearSortState] = useState(false);


    let createInitialSearchState = () => {
        let srchState = {};
        for (let i = 0; i < props.searchKeys.length; i++) {
            srchState[props.searchKeys[i].key] = null;
        }
        return srchState;
    };
    const [searchState, setSearchState] = useState(createInitialSearchState());

    useEffect(() => {
        performSearch();
    }, [searchState, searchKeys]);

    useEffect( () => {
        setData(originalData);
    }, [originalData]);

    let isSearchStateEmpty = (givenState= {}) => {
        let keys = Object.keys(givenState);
        let flags = keys.map((key) => {
            return isSearchStateValueEmpty(givenState[key]);
        });
        return flags.every(x=>x);
    };

    let isSearchStateValueEmpty = (value) => {
        if(value === ""){
            return true;
        }
        if(value === null){
            return true;
        }
        if(typeof value === 'undefined'){
            return true;
        }
        return false;
    };

    let performSearch = (searchCount = 0, onOriginal = true) => {
        let originalEmpty = onOriginal && isEmpty(originalData);
        let searchCountReachedMax = searchCount > 1;
        if(originalEmpty || searchCountReachedMax){
            return;
        }
        let newData = [];
        if(onOriginal){
            newData = cloneDeep(originalData);
        } else {
            newData = cloneDeep(data);
        }
        for (let i = 0; i < searchKeys.length; i++) {
            let key = searchKeys[i].key;
            let type = searchKeys[i].type;
            let searchType = searchKeys[i].searchType;
            let stateValue = searchState[key];
            if(stateValue === null){
                continue;
            }
            if(type === 'text' && !isEmpty(stateValue)){
                newData = performTextSearch(newData, key, stateValue, searchType);
            } else if(type === 'boolean'){
                newData = performYesNoSearch(newData, key, stateValue === 'true')
            } else if(type === 'date' && !isEmpty(stateValue[0]) && !isEmpty(stateValue[1])){
                newData = performDateRangeSearch(newData, key, stateValue)
            }
        }
        setData(newData);
        setClearSortState(true);
        if(isEmpty(newData)){
            performSearch(searchCount+1, true);
        }
    };

    const getClearSortState = () => {
        return clearSortState;
    };

    const updateClearSortState = (newState = null) => {
        if(newState !== null){
            setClearSortState(newState);
            return;
        }
        return setClearSortState(!clearSortState);
    };

    const getPreSortData = () => {
        return data;
    };

    const updateSearchState = (newValue, searchKey) => {
        let newSearchState = Object.assign({}, searchState);
        newSearchState[searchKey] = newValue;
        setSearchState(newSearchState);
    };

    return (
        <OutsideComponentAlerter callback={performSearch}>
            <SearchCallbackContext.Provider value={{
                getClearSortState: getClearSortState,
                updateClearSortState: updateClearSortState,
                getPreSortData: getPreSortData,
                updateSearchState: updateSearchState,
                preSortData: data,
            }} >
                {props.children}
            </SearchCallbackContext.Provider>
        </OutsideComponentAlerter>
    );
};

DataSearcher.defaultProps = {
    searchKeys: [{key:"", type:""}],
};

DataSearcher.propTypes = {
    dataCenterContext: PropTypes.any,
    dataListFetchURL: PropTypes.string,
    searchKeys: PropTypes.array,
};
export default DataSearcher