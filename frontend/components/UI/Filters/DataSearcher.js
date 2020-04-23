import React, {createContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import {dClone, getObjsToAdd, isEmpty, removeDuplicatesById} from "../../../lib/utils";
import OutsideComponentAlerter from "../../../hoc/Aux/OutsideComponentAlerter";
import Alert from "../Notifications/Alert";
import {SWR_FETCH, USERS_LIST_API} from "../../../constants";
import useSWR from "swr";
import {performDateRangeSearch, performTextSearch, performYesNoSearch} from "../../../lib/dataSearch";


export const SearchCallbackContext = createContext({updateSearchState: ()=>{}});

const DataSearcher = (props) => {

    let localStorageData = [];
    if (typeof window !== 'undefined') {
        localStorageData = JSON.parse(localStorage.getItem(props.dataNameKey));
    }
    let [hasError, setHasError] = useState(false);
    let [data, setData] = useState(localStorageData);
    let [nextFetchUrl, setNextFetchUrl] = useState(USERS_LIST_API);

    const [searchKeys, setSearchKeys] = useState(props.searchKeys);
    const [clearSortState, setClearSortState] = useState(false);

    let createInitialSearchState = () => {
        let srchState = {};
        for (let i = 0; i < props.searchKeys.length; i++) {
            srchState[props.searchKeys[i].key] = null;
        }
        return srchState;
    };
    const [searchState, setSearchState] = useState(createInitialSearchState());

    const updateSearchState = (newValue, searchKey) => {
        let newSearchState = Object.assign({}, searchState);
        newSearchState[searchKey] = newValue;
        setSearchState(newSearchState);
    };

    useEffect(() => {
        performSearch();
    }, [searchState, searchKeys]);

    useEffect(() => {
        return () => {
            localStorage.removeItem(props.dataNameKey);
        }
    }, []);

    /***
     * this function removes data duplicates by Id and concatenate new data to existing data
     * @param dataItems
     * @returns {Promise<[]>}
     */
    const getNewData = async (dataItems = []) => {
        if(isEmpty(dataItems)){
            return;
        }
        let itemsToAdd = [];
        let newData;

        if(isEmpty(data)){
            newData = dataItems;
        } else {
            newData = await dClone(data);
            newData = await newData.concat(dataItems);
            let userCurrentIds = data.map(item => item.id);
            itemsToAdd = getObjsToAdd(dataItems, userCurrentIds);
            if(!isEmpty(itemsToAdd)){
                newData = newData.concat(itemsToAdd);
            }
        }
        // remove duplicates
        newData = removeDuplicatesById(newData);
        if(typeof window !== 'undefined'){
            await localStorage.setItem(props.dataNameKey, JSON.stringify(newData));
        }
        return newData;
    };

    const {error, serverData} = useSWR(
        nextFetchUrl,
        SWR_FETCH,
        {
            onSuccess: async (serverData) => {
                let newData = await getNewData(serverData.results);
                await setData(newData);
                await setNextFetchUrl(serverData.next);
            },
            onError: () => { setHasError(true)},
        }
    );


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
        if(searchCount > 1){
            return;
        }
        if(isSearchStateEmpty(searchState)){
            setData(JSON.parse(localStorage.getItem(props.dataNameKey)));
            return;
        }
        let newData = [];
        if(onOriginal){
            newData = cloneDeep(JSON.parse(localStorage.getItem(props.dataNameKey)));
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

    let renderAlert = () => {
        if(hasError){
            return <Alert title="Something went wrong" content="Failed to load user data" />;
        }
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
                {renderAlert()}
                {props.children}
            </SearchCallbackContext.Provider>
        </OutsideComponentAlerter>
    );
};

DataSearcher.defaultProps = {
    searchKeys: [{key:"", type:""}],
};

DataSearcher.propTypes = {
    dataNameKey: PropTypes.string,
    dataListFetchURL: PropTypes.string,
    searchKeys: PropTypes.array,
};
export default DataSearcher