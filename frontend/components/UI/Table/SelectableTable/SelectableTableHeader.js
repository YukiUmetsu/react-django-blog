import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import SelectableHeaderItem from "./SelectableHeaderItem";
import {isEmpty} from "../../../../lib/utils";

const SelectableTableHeader = (props) => {

    let renderHeader = (headerItems) => {
        return headerItems.map(item => {
            let isSortableColumn = isEmpty(item.type) || item.type !== 'image';
            return (
                <SelectableHeaderItem
                    {...item}
                    key={item.accessor}
                    isSortableColumn={isSortableColumn}
                />
                );
        })
    };

    return (
        <thead className={`${props.headerColorClass} text-white text-normal`}>
            <tr>
                <th>Select</th>
                {renderHeader(props.columns)}
                {props.isActionsRequired? <th>Actions</th>: ""}
            </tr>
        </thead>
    );
};

SelectableTableHeader.propTypes = {
    headerColorClass: PropTypes.string,
    columns: PropTypes.array,
    isActionsRequired: PropTypes.bool,
};

export default SelectableTableHeader