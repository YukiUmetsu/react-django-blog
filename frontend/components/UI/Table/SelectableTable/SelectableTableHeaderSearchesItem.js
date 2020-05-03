import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import YesNoPicker from "../../Filters/YesNoPicker";
import InputSearchItem from "../../Filters/InputSearchItem";
import {SearchCallbackContext} from "../../Filters/DataSearcher";
import dynamic from "next/dynamic";

const DynamicDateRangePicker = dynamic(
    () => import('../../Filters/DateRangePicker'),
    { ssr: false }
);

const SelectableTableHeaderSearchesItem = (props) => {

    const {updateSearchState: updateSearchState} = useContext(SearchCallbackContext);

    let renderSearches = () => {
        if(!props.isSortableColumn){
            return "";
        }
        if(props.type === 'date'){
            return (
                <DynamicDateRangePicker
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
                placeholder={`filter ${props.label}`}
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