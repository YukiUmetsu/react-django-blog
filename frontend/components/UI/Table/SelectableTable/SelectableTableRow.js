import React from 'react';
import PropTypes from 'prop-types';
import TableRowItem from "../TableRowItem";
import ItemActions from "../ItemActions";

const SelectableTableRow = (props) => {

    let renderItems = (rowObj) => {
        return props.columnData.columns.map((column, index) => {
           return (
               <TableRowItem
                   content={rowObj[column.accessor]}
                   key={index}
                   isImage={isImageColumn(index)}
                   isBoolean={isBooleanColumn(index)}
                   isDate={isDateColumn(index)}
                   increase={isIncreaseColumn(index)}
                   decrease={isDecreaseColumn(index)}
               />);
        })
    };

    let isImageColumn = (index) => {
        return props.columnData.imageColumns.includes(index);
    };
    let isDateColumn = (index) => {
        return props.columnData.dateColumns.includes(index);
    };
    let isBooleanColumn = (index) => {
        return props.columnData.booleanColumns.includes(index);
    };
    let isIncreaseColumn = (index) => {
        return props.columnData.increaseColumns.includes(index);
    };
    let isDecreaseColumn = (index) => {
        return props.columnData.decreaseColumns.includes(index);
    };

    let renderActions = () => {
        if(!props.actionsRequired){
            return "";
        }

        // TODO: action click func
        return (
            <td>
                <ItemActions />
            </td>
        );
    };

    return (
        <tr key={props.rowCount} className={`border-solid border-gray-300`}>
            <td><input className="mr-2 leading-tight" type="checkbox" id={props.rowObj.id}/></td>
            {renderItems(props.rowObj)}
            {renderActions()}
        </tr>
    );
};

SelectableTableRow.propTypes = {
    rowCount: PropTypes.number,
    rowObj: PropTypes.object,
    actionsRequired: PropTypes.bool,
    columnData: PropTypes.object
};

export default SelectableTableRow