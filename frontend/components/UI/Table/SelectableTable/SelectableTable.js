import React from 'react';
import PropTypes from 'prop-types';
import TableCSS from '../Table.module.css';
import SelectableTableRow from "./SelectableTableRow";

const SelectableTable = (props) => {

    let renderHeader = (headerItems) => {
        return headerItems.map(item => {
            return <th scope="col" key={item.accessor}>{item.label}</th>
        })
    };

    let renderBody = (bodyItems) => {
        return bodyItems.map((rowObj, index) => {
            return (
                <SelectableTableRow
                    rowCount={index}
                    rowObj={rowObj}
                    key={index}
                    actionsRequired={props.actionsRequired}
                    columnData={getColumnData()}
                />);
        })
    };

    let getColumnData = () => {
        let data = {
            imageColumns: [],
            booleanColumns: [],
            dateColumns: [],
            increaseColumns: [],
            decreaseColumns: [],
        };
        props.columns.map((column,index) => {
            if (column.type === 'image') {
                data.imageColumns.push(index);
            } else if(column.type === 'boolean'){
                data.booleanColumns.push(index);
            } else if(column.type === 'date'){
                data.dateColumns.push(index);
            } else if(column.type === 'increase'){
                data.increaseColumns.push(index);
            } else if(column.type === 'decrease'){
                data.decreaseColumns.push(index);
            }
        });
        data.columns = props.columns;
        return data;
    };

    return (
        <div className={TableCSS["table-responsive"]}>
            <table className={`${TableCSS.table} text-grey-darkest border border-solid border-gray-300`}>
                <thead className={`${props.headerColorClass} text-white text-normal`}>
                <tr>
                    <th>Select</th>
                    {renderHeader(props.columns)}
                    {props.actionsRequired? <th>Actions</th>: ""}
                </tr>
                </thead>
                <tbody>
                {renderBody(props.data)}
                </tbody>
            </table>
        </div>
    );
};

SelectableTable.defaultProps = {
    headerColorClass: 'bg-teal-700',
};

SelectableTable.propTyles = {
    headerColorClass: PropTypes.string,
    columns: PropTypes.array,
    data: PropTypes.array,
    actionsRequired: PropTypes.bool,
};

export default SelectableTable