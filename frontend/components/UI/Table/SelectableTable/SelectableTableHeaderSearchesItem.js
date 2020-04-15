import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import DateRangePicker from "../../Filters/DateRangePicker";
import YesNoPicker from "../../Filters/YesNoPicker";
import InputSearchItem from "../../Filters/InputSearchItem";
import {SearchCallbackContext} from "../../Filters/DataSearcher";

const SelectableTableHeaderSearchesItem = (props) => {

    const {updateSearchState: updateSearchState} = useContext(SearchCallbackContext);

    let renderSearches = () => {
        if(!props.isSortableColumn){
            return "";
        }
        if(props.type === 'date'){
            return (
                <DateRangePicker
                    onDateRangeChanged={updateSearchState}
                    onDateRangeChangedArguments={[props.accessor]}
                />
            );
        }
        if(props.type === 'boolean'){
            return (
                <YesNoPicker
                    onValueChanged={updateSearchState}
                    onValueChangedArguments={[props.accessor]}
                    selectElementId={props.accessor}
                />
            );
        }
        return (
            <InputSearchItem
                elementId={props.accessor}
                placeholder={`Search by ${props.label}`}
                onChangedCallback={updateSearchState}
                onChangedCallbackArguments={[props.accessor]}
            />
        );
    };

    return (
        <th scope="col" key={props.accessor}>
            {renderSearches()}
        </th>
    );
};

SelectableTableHeaderSearchesItem.propTyles = {
    isSortableColumn: PropTypes.bool,
    accessor: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
};

export default SelectableTableHeaderSearchesItem