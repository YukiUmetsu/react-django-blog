import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import SelectableHeaderItem from "./SelectableHeaderItem";
import {isEmpty} from "../../../../lib/utils";
import SelectableTableHeaderSearchesItem from "./SelectableTableHeaderSearchesItem";

const SelectableTableHeader = (props) => {

    let [sortableColumns, setSortableColumns] = useState([]);

    useEffect(() => {
        let columnsSortable = props.columns.map(item => {
            let isSortableColumn = isEmpty(item.type) || item.type !== 'image';
            if(isSortableColumn){
                return item.accessor;
            }
        });
        setSortableColumns(columnsSortable);
    }, [props.columns]);



    let renderHeader = (headerItems) => {
        return headerItems.map(item => {
            let isSortableColumn = sortableColumns.includes(item.accessor);
            return (
                <SelectableHeaderItem
                    {...item}
                    key={item.accessor}
                    isSortableColumn={isSortableColumn}
                />
                );
        })
    };

    let renderSearches = (headerItems) => {
        return headerItems.map(item => {
            let isSortableColumn = sortableColumns.includes(item.accessor);
            return (
                <SelectableTableHeaderSearchesItem
                    {...item}
                    key={item.accessor}
                    isSortableColumn={isSortableColumn}
                />
            );
        });
    };

    return (
        <thead className={`text-white text-normal`}>
            <tr className={`${props.headerColorClass}`}>
                <th>Select</th>
                {renderHeader(props.columns)}
                {props.isActionsRequired? <th>Actions</th>: ""}
            </tr>
            <tr>
                <th style={{verticalAlign: 'middle'}}>
                    <input
                        className="mr-2 leading-tight"
                        type="checkbox"
                        id="select-all"
                        onChange={() => props.onSelectAllCallback()}
                        checked={props.checkboxAllOn}
                    />
                </th>
                {renderSearches(props.columns)}
                {props.isActionsRequired? <th> </th>: ""}
            </tr>
        </thead>
    );
};

SelectableTableHeader.propTypes = {
    headerColorClass: PropTypes.string,
    columns: PropTypes.array,
    isActionsRequired: PropTypes.bool,
    onSelectAllCallback: PropTypes.func,
    checkboxAllOn: PropTypes.bool,
};

export default SelectableTableHeader