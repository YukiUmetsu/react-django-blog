import React, {createContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import matchSorter from 'match-sorter'
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import {isEmpty} from "../../../lib/utils";
import OutsideComponentAlerter from "../../../hoc/Aux/OutsideComponentAlerter";

const moment = extendMoment(Moment);

export const SearchCallbackContext = createContext({updateSearchState: ()=>{}});

const DataSearcher = (props) => {

    const [data, setData] = useState(props.originalData);
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
            setData(props.originalData);
            return;
        }
        let newData = [];
        if(onOriginal){
            newData = cloneDeep(props.originalData);
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

    let performTextSearch = (givenData, key, value, searchType = 'match') => {
        if(searchType === 'equal'){
            return matchSorter(givenData, value, {keys: [key], threshold: matchSorter.rankings.CONTAINS});
        }
        return matchSorter(givenData, value, {keys: [key]})
    };

    let performDateRangeSearch = (givenData, key, [dateStart, dateEnd]) => {
        const range = moment.range(dateStart, dateEnd);
        return givenData.filter(item => {
            let target = moment(item[key]);
            return target.within(range);
        });
    };

    let performYesNoSearch = (givenData, key, value) => {
        return givenData.filter(item => {
            return item[key] === value;
        });
    };

    const childrenElements = React.Children.map(props.children, child => {
        return React.cloneElement(child, {
            preSortData: data,
            originalData: props.originalData,
            clearSortState: clearSortState,
            postClearingSortStateCallback: () => setClearSortState(false)
        });
    });

    return (
        <OutsideComponentAlerter callback={performSearch}>
            <SearchCallbackContext.Provider value={{updateSearchState: updateSearchState}} >
                {childrenElements}
            </SearchCallbackContext.Provider>
        </OutsideComponentAlerter>
    );
};

DataSearcher.defaultProps = {
    originalData: [],
    searchKeys: [{key:"", type:""}],
};

DataSearcher.propTypes = {
    originalData: PropTypes.array,
    searchKeys: PropTypes.array,
};
export default DataSearcher