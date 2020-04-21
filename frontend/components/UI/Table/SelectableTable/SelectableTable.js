import React, {createContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import TableCSS from '../Table.module.css';
import SelectableTableRow from "./SelectableTableRow";
import SelectableTableHeader from "./SelectableTableHeader";
import Modal from "../../Modal/Modal";
import Form from "../../Form/Form";
import {FORM_DATA} from "../../../../constants/FormDataConst";
import AlertModal from "../../Modal/AlertModal";
import {isEmpty} from "../../../../lib/utils";
import OutsideComponentAlerter from "../../../../hoc/Aux/OutsideComponentAlerter";
import PackmanSpinner from "../../Spinner/PackmanSpinner";

export const DataMutationContext = createContext({});

const SelectableTable = (props) => {

    let [ selectedItems, setSelectedItems ] = useState(new Set());
    let [ data, setData ] = useState(props.data);
    let [ checkboxAllOn, setCheckboxAllOnOffStatus] = useState(false);
    let [ editModalState, setEditModalState ] = useState({isOpen: false, rowObj: {}});
    let [ deleteModalState, setDeleteModalState ] = useState({isOpen: false, rowObj: {}});
    let [ resetEditForm, setResetEditForm ] = useState(false);

    useEffect(()=> {
        setData(props.data);
    }, [props.data]);

    useEffect(() => {
        setCheckboxAllOnOffStatus(isAllSelected());
    }, [data]);

    let isAllSelected = () => {
        let isAllSelected = true;
        if(data.length < 1){
            return false;
        }
        for (let i = 0; i < data.length; i++) {
            if(!selectedItems.has(parseInt(data[i].id))){
                isAllSelected = false;
            }
        }
        return isAllSelected;
    };

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

    let updateEditModalState = (rowObj, newIsEditOpen = null) => {
        if(newIsEditOpen !== null){
            setEditModalState({isOpen: newIsEditOpen, rowObj: rowObj});
            return;
        }
        setEditModalState({isOpen: !editModalState.isOpen, rowObj: rowObj});
    };

    let updateDeleteModalState = (rowObj, newIsOpen = null) => {
        if(newIsOpen !== null){
            setDeleteModalState({isOpen: newIsOpen, rowObj: rowObj});
            return;
        }
        setDeleteModalState({isOpen: !deleteModalState.isOpen, rowObj: rowObj});
    };

    let renderBody = () => {
        if(isEmpty(data)){
            return (
                <tr className="mx-auto self-center">
                    <td><PackmanSpinner/></td>
                </tr>
                );
        }
        if(!Array.isArray(data)){
            return;
        }
        return data.map(rowObj => {
            return (
                <SelectableTableRow
                    rowObj={rowObj}
                    key={rowObj.id}
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
        let newColumnData = {
            imageColumns: [],
            booleanColumns: [],
            dateColumns: [],
            increaseColumns: [],
            decreaseColumns: [],
        };
        props.columns.map((column,index) => {
            if (column.type === 'image') {
                newColumnData.imageColumns.push(index);
            } else if(column.type === 'boolean'){
                newColumnData.booleanColumns.push(index);
            } else if(column.type === 'date'){
                newColumnData.dateColumns.push(index);
            } else if(column.type === 'increase'){
                newColumnData.increaseColumns.push(index);
            } else if(column.type === 'decrease'){
                newColumnData.decreaseColumns.push(index);
            }
        });
        newColumnData.columns = props.columns;
        return newColumnData;
    };

    let renderOnDeleteMessage = (rowObj) => {
        let shownColumns = props.columns.map(column => {
            if(!column.showOnDelete){
                return;
            }
            return ({label: column.label, accessor: column.accessor, type: column.type});
        }).filter(x => x!== undefined);

        let headerRows = shownColumns.map(column => {
            return (<th className="px-4 py-2" key={column.label}>{column.label}</th>);
        });

        let bodyRows = shownColumns.map(column => {
            let content = rowObj[column.accessor];
            if(column.type === "boolean"){
                content = isEmpty(rowObj[column.accessor]) ? "No" : "Yes";
            }
            return <td className="px-4 py-2" key={column.accessor}>{content}</td>
        });

        return (
            <table className="table-auto">
                <thead>
                <tr>
                    {headerRows}
                </tr>
                </thead>
                <tbody>
                <tr>
                    {bodyRows}
                </tr>
                </tbody>
            </table>
        );
    };

    return (
        <DataMutationContext.Provider value={{updateEditModalState: updateEditModalState, updateDeleteModalState: updateDeleteModalState}}>
            <div className={`${TableCSS["table-responsive"]} ${(editModalState.isOpen||deleteModalState.isOpen)? "pointer-events-none": ""}`}>
                {renderActionSelectors()}
                <table className={`${TableCSS.table} text-grey-darkest border border-solid border-gray-300`}>
                    <SelectableTableHeader {...props} onSelectAllCallback={toggleCheckboxAllOn} checkboxAllOn={checkboxAllOn}/>
                    <tbody>
                    {renderBody()}
                    </tbody>
                </table>
            </div>

            <OutsideComponentAlerter callback={() => updateEditModalState({}, false)}>
                <Modal
                    onCloseCallback={() => {updateEditModalState(editModalState.rowObj); setResetEditForm(true);}}
                    modalOpen={editModalState.isOpen}
                    onOpenCallback={() => setResetEditForm(false)}>
                    <Form
                        object={editModalState.rowObj}
                        formData={FORM_DATA.USER_DISPLAY}
                        onSubmitCallback={() => {console.log("submitted!")}}
                        resetForm={resetEditForm}
                    />
                </Modal>
            </OutsideComponentAlerter>

            <OutsideComponentAlerter callback={() => updateDeleteModalState({}, false)}>
                <AlertModal
                    modalOpen={deleteModalState.isOpen}
                    onCloseCallback={() => updateDeleteModalState({}, false)}
                    title="Are you sure to delete?"
                    onConfirmedCallback={() => {updateDeleteModalState({}, false); console.log("confirmed!!"); }}>
                    {renderOnDeleteMessage(deleteModalState.rowObj)}
                </AlertModal>
            </OutsideComponentAlerter>

        </DataMutationContext.Provider>
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
    updateObjApiUrl: PropTypes.string,
    deleteObjApiUrl: PropTypes.string,
};

export default SelectableTable