import React, {createContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import {
    dClone,
    getLocalStorageItem,
    getObjsToAdd,
    isEmpty,
    removeDuplicatesById, removeFromData, removeFromLocalStorage,
    setLocalStorageItem
} from "../../../lib/utils";
import OutsideComponentAlerter from "../../../hoc/Aux/OutsideComponentAlerter";
import Alert from "../Notifications/Alert";
import {SWR_DELETE_FETCH, SWR_FETCH, USERS_LIST_API} from "../../../constants";
import useSWR from "swr";
import {performDateRangeSearch, performTextSearch, performYesNoSearch} from "../../../lib/dataSearch";


export const SearchCallbackContext = createContext({updateSearchState: ()=>{}});

const DataSearcher = (props) => {

    let localStorageData = [];
    if (typeof window !== 'undefined') {
        localStorageData = getLocalStorageItem(props.dataNameKey);
    }
    let [data, setData] = useState(localStorageData);
    let [nextDataFetchUrl, setNextDataFetchUrl] = useState(USERS_LIST_API);
    let [searchKeys, setSearchKeys] = useState(props.searchKeys);
    let [clearSortState, setClearSortState] = useState(false);

    /***
     * data edit and delete from action buttons
     */
    let [dataIdsToBeDeleted, setDataIdsToBeDeleted] = useState([]);
    let [deleteCurrentIndex, setDeleteCurrentIndex] = useState(null);
    let [editCurrentIndex, setEditCurrentIndex] = useState(null);
    let [dataItemsToBeEdited, setDataItemsToBeEdited] = useState([]);

    let initialAlertProps = {
        title:"Something went wrong",
        content:"Failed to load user data",
        hideAfterSeconds: 3,
        showAlert: false,
    };
    let [alertProps, setAlertProps] = useState(initialAlertProps);


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
            await setLocalStorageItem(props.dataNameKey, newData);
        }
        return newData;
    };

    /***
     * connect to server to fetch data
     */
    const {error, serverData} = useSWR(
        nextDataFetchUrl,
        SWR_FETCH,
        {
            onSuccess: async (serverData) => {
                let newData = await getNewData(serverData.results);
                await setData(newData);
                await setNextDataFetchUrl(serverData.next);
            },
            onError: () => showDefaultServerErrorAlert(),
        }
    );

    /***
     * connect server to delete a user
     */
    useSWR(
        (typeof deleteCurrentIndex === 'number' && !isEmpty(dataIdsToBeDeleted)) ?
            [props.dataListFetchURL + dataIdsToBeDeleted[deleteCurrentIndex] + "/", deleteCurrentIndex]
            : null,
        SWR_DELETE_FETCH,
        {
            onSuccess: async () => {
                if(deleteCurrentIndex === dataIdsToBeDeleted.length-1){
                    await showAlertAfterDeletion();
                    await setDeleteCurrentIndex(null);
                    await setDataIdsToBeDeleted(null);
                } else {
                    await setDeleteCurrentIndex(deleteCurrentIndex+1);
                }
            },
            onError: () => showDefaultServerErrorAlert(),
        }
    );

    let showAlertAfterDeletion = () => {
        setAlertProps({
            bgColor: 'teal',
            textColor: 'teal',
            exitColor: 'teal',
            showAlert: true,
            hideAfterSeconds: 3,
            title: 'Deletion',
            content: 'Data was successfully deleted',
            hideCallback: () => { setAlertProps(initialAlertProps);}
        });
    };

    let showDefaultServerErrorAlert = () => {
        setAlertProps({
            ...initialAlertProps,
            showAlert: true,
            hideCallback: () => { setAlertProps(initialAlertProps);}
        });
    };


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
            setData(getLocalStorageItem(props.dataNameKey));
            return;
        }
        let newData = [];
        if(onOriginal){
            newData = cloneDeep(getLocalStorageItem(props.dataNameKey));
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

    const updateNextFetchURL = (nextURL = null) => {
        if(nextURL === true){
            setNextDataFetchUrl(props.dataListFetchURL);
        } else if(nextURL != null){
            setNextDataFetchUrl(nextURL);
        }
    };

    const getPreSortData = () => {
        return data;
    };

    const updateSearchState = (newValue, searchKey) => {
        let newSearchState = Object.assign({}, searchState);
        newSearchState[searchKey] = newValue;
        setSearchState(newSearchState);
    };

    let updateDeletionStates = (index = null, ids = []) => {
        if(typeof index === 'number'){
            setDeleteCurrentIndex(index);
        }
        if(!isEmpty(ids)){
            setDataIdsToBeDeleted(ids);
            removeFromLocalStorage(props.dataNameKey, ids);
            let newData = removeFromData(ids, data);
            setData(newData);
        }
    };

    return (
        <OutsideComponentAlerter callback={performSearch}>
            <SearchCallbackContext.Provider value={{
                getClearSortState: getClearSortState,
                updateClearSortState: updateClearSortState,
                getPreSortData: getPreSortData,
                updateSearchState: updateSearchState,
                updateNextFetchURL: updateNextFetchURL,
                updateDeletionStates: updateDeletionStates,
                preSortData: data,
            }} >
                <Alert {...alertProps} />
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