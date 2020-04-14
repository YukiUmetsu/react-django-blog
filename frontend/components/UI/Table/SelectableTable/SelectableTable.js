import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import TableCSS from '../Table.module.css';
import SelectableTableRow from "./SelectableTableRow";
import SelectableTableHeader from "./SelectableTableHeader";

const SelectableTable = (props) => {

    let [ selectedItems, setSelectedItems ] = useState(new Set());
    let [ data, setData ] = useState(props.data);
    let [ checkboxAllOn, setCheckboxAllOnOffStatus] = useState(false);

    useEffect(()=> {
        setData(props.data);
        let isAllSelected = true;
        for (let i = 0; i < data.length; i++) {
            if(!selectedItems.has(parseInt(data[i].id))){
                isAllSelected = false;
            }
        }
        setCheckboxAllOnOffStatus(isAllSelected);
    }, [props.data, data]);

    let inputChangedHandler = (event) => {
        let id = parseInt(event.target.id);
        let isSelected = selectedItems.has(id);
        if(isSelected){
            let copySet = new Set(selectedItems);
            copySet.delete(id);
            setSelectedItems(copySet);
            return;
        }
        addToSelectedItems([id]);
    };

    let addToSelectedItems = (items=[]) => {
        let copySet = new Set(selectedItems);
        items.forEach(item => copySet.add(item));
        setSelectedItems(copySet);
    };

    let removeFromSelectedItems = (items = []) =>  {
        let copySet = new Set(selectedItems);
        items.forEach(item => copySet.delete(item));
        setSelectedItems(copySet);
    };

    let renderBody = (bodyItems) => {
        return bodyItems.map((rowObj, index) => {
            return (
                <SelectableTableRow
                    rowCount={index}
                    rowObj={rowObj}
                    key={index}
                    isActionsRequired={props.isActionsRequired}
                    columnData={getColumnData()}
                    onInputChanged={(e)=>{inputChangedHandler(e)}}
                    isRowSelected={selectedItems.has(parseInt(rowObj.id))}
                />);
        })
    };

    let toggleCheckboxAllOn = () => {
        let allIds = data.map(item =>item.id);
        if(checkboxAllOn){
            // turn off => unselect all
            removeFromSelectedItems(allIds);
        } else {
            // turn on => select all
            addToSelectedItems(allIds);
        }
        setCheckboxAllOnOffStatus(!checkboxAllOn);
    };

    let renderActionSelectors = () => {
        if(!props.isActionsRequired){
            return "";
        }
        let renderActionOptions = () => {
            return props.actionData.map((item, index) => {
                return (
                    <option key={item.value} value={item.value}>{item.label}</option>
                );
            });
        };
        return (
            <div className="flex w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 h-10 mb-3">
                <div className="flex-1 h-full pr-3 inline-block relative">
                    <select
                        name="actions"
                        id="actions-in-bunch"
                        className="h-full block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        {renderActionOptions()}
                    </select>
                </div>
                <button
                    onClick={() => bunchActionConfirmed()}
                    className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded
                    ">
                    Confirm
                </button>
            </div>
        );
    };

    let bunchActionConfirmed = async () => {
        let selectedAction = document.getElementById("actions-in-bunch").value;
        if(selectedItems.size > 0){
            let selectedActionItem;
            let rest;
            [selectedActionItem, ...rest] = props.actionData.filter(item => {
                return item.value === selectedAction;
            });
            await selectedActionItem.callback(selectedItems);
            setSelectedItems([]);
        }
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
            {renderActionSelectors()}
            <table className={`${TableCSS.table} text-grey-darkest border border-solid border-gray-300`}>
                <SelectableTableHeader {...props} onSelectAllCallback={toggleCheckboxAllOn} checkboxAllOn={checkboxAllOn}/>
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
    isActionsRequired: PropTypes.bool,
    actionData: PropTypes.array,
};

export default SelectableTable