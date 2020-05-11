import React, {createContext, useContext, useEffect, useState} from 'react';
import Router from 'next/router'
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic'
import TableCSS from '../Table.module.css';
import SelectableTableRow from "./SelectableTableRow";
import SelectableTableHeader from "./SelectableTableHeader";
import {getDisplayContentFromObj, getTableColumnInfo, isEmpty} from "../../../../lib/utils";
import OutsideComponentAlerter from "../../../../hoc/Aux/OutsideComponentAlerter";
import PackmanSpinner from "../../Spinner/PackmanSpinner";
import AlertModalTable from "../../Modal/AlertModalTable";
import { convertArrayToObject } from '../../../../lib/utils';

const DynamicForm = dynamic(
    () => import('../../Form/Form'),
    { ssr: false }
);

const DynamicModal = dynamic(
    () => import('../../Modal/Modal'),
    { ssr: false }
);

const DynamicAlertModal = dynamic(
    () => import('../../Modal/AlertModal'),
    { ssr: false }
);

export const DataMutationContext = createContext({});

const SelectableTable = (props) => {

    const {
        dataManipulationComplete: dataManipulationComplete,
        updateDeletionStates: updateDeletionStates
    } = useContext(props.dataCenterContext);
    let [ selectedItems, setSelectedItems ] = useState(new Set());
    let [ data, setData ] = useState(props.data);
    let [ checkboxAllOn, setCheckboxAllOnOffStatus] = useState(false);
    let [ editModalState, setEditModalState ] = useState({isOpen: false, rowObj: {}});
    let [ deleteModalState, setDeleteModalState ] = useState({isOpen: false, rowObj: {}});
    let [ bunchDeleteModalOpen, setBunchDeleteModalOpen ] = useState(false);
    let [ resetEditForm, setResetEditForm ] = useState(false);

    useEffect(()=> {
        setData(props.data);
    }, [props.data]);

    useEffect(() => {
        setCheckboxAllOnOffStatus(isAllSelected());
    }, [data]);

    useEffect( () => {
        if(dataManipulationComplete){
            setEditModalState({isOpen: false, rowObj: {}});
            setDeleteModalState({isOpen: false, rowObj: {}});
        }
    },[dataManipulationComplete]);

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
        if(props.onEditClickedRedirect && !isEmpty(rowObj)){
            let {url, as, options} = props.onEditClickedRedirect(rowObj);
            return Router.push(url, as, options);
        }
        if(newIsEditOpen !== null){
            setEditModalState({isOpen: newIsEditOpen, rowObj: rowObj});
            return;
        }
        setEditModalState({isOpen: !editModalState.isOpen, rowObj: rowObj});
    };

    let updateDeleteModalState = (rowObj, newIsOpen = null) => {
        if(!isEmpty(props.onDeleteClickedRedirect) && !isEmpty(rowObj)){
            let {url, as, options} = props.onDeleteClickedRedirect(rowObj);
            return Router.push(url, as, options);
        }

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
        let tableColumnData = getTableColumnInfo(props.columns);
        return data.map(rowObj => {
            return (
                <SelectableTableRow
                    rowObj={rowObj}
                    key={rowObj.id}
                    isActionsRequired={props.isActionsRequired}
                    columnData={tableColumnData}
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
            if(selectedActionItem.value === 'delete'){
                setBunchDeleteModalOpen(true);
            }
        }
    };

    let renderOnDeleteMessage = (rowObjs) => {
        if(isEmpty(rowObjs)){
            return '';
        }
        let shownColumns = props.columns.map(column => {
            if(!column.showOnDelete){
                return;
            }
            return column;
        }).filter(x => x!== undefined);

        let labels = shownColumns.map(col => col.label);

        let tableBodyData = [];

        if(!Array.isArray(rowObjs)){
            rowObjs = [rowObjs];
        }

        tableBodyData = rowObjs.map(rowObj => {
            return shownColumns.map(column => {
                let content = getDisplayContentFromObj(column, rowObj);
                return {accessor: column.accessor, content: content};
            });
        });

        return <AlertModalTable labels={labels} data={tableBodyData} columns={convertArrayToObject(shownColumns, 'accessor')}/>;
    };

    const handleDataItemDeleted = (ids) => {
        if(!isEmpty(props.onDeleteClickedRedirect)){
            let {dlURL, dlAs, dlOptions} = props.onDeleteClickedRedirect;
            return Router.push(dlURL, dlAs, dlOptions);
        }
        updateDeleteModalState({}, false);
        if(!Array.isArray(ids)){
            ids = [ids];
        }
        updateDeletionStates(0, ids);
    };

    const getSelectedItemDetailData = (ids) => {
        if(ids instanceof Set){
            ids = Array.from(ids);
        }

        return data.filter(item => {
            return ids.includes(item.id);
        });
    };

    const handleBunchDeleteConfirmed = () => {
        handleDataItemDeleted(Array.from(selectedItems));
        setSelectedItems(new Set());
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
                <DynamicModal
                    onCloseCallback={() => {updateEditModalState(editModalState.rowObj); setResetEditForm(true);}}
                    modalOpen={editModalState.isOpen}
                    onOpenCallback={() => setResetEditForm(false)}>
                    <DynamicForm
                        object={editModalState.rowObj}
                        formData={props.editObjFormData}
                        form_id_prefix="edit"
                        onSubmitCallback={(data) => props.onEditObjFormSubmitted(data)}
                        resetForm={resetEditForm}
                        dataManipulationComplete={dataManipulationComplete}
                    />
                </DynamicModal>
            </OutsideComponentAlerter>

            <OutsideComponentAlerter callback={() => updateDeleteModalState({}, false)}>
                <DynamicAlertModal
                    modalId="delete-item"
                    modalOpen={deleteModalState.isOpen}
                    onCloseCallback={() => updateDeleteModalState({}, false)}
                    title="Are you sure to delete?"
                    onConfirmedCallback={(id) => handleDataItemDeleted(id)}
                    associatedObjId={(deleteModalState.rowObj) ? parseInt(deleteModalState.rowObj.id): null}>
                    {renderOnDeleteMessage(deleteModalState.rowObj)}
                </DynamicAlertModal>
            </OutsideComponentAlerter>

            <OutsideComponentAlerter callback={() => setBunchDeleteModalOpen(false)}>
                <DynamicAlertModal
                    modalId="delete-multi-items"
                    modalOpen={bunchDeleteModalOpen}
                    onCloseCallback={() => setBunchDeleteModalOpen(false)}
                    title="Are you sure to delete?"
                    onConfirmedCallback={() => handleBunchDeleteConfirmed()}>
                    {renderOnDeleteMessage(getSelectedItemDetailData(selectedItems))}
                </DynamicAlertModal>
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
    editObjFormData: PropTypes.object,
    onEditObjFormSubmitted: PropTypes.func,
    dataCenterContext: PropTypes.any,
    onEditClickedRedirect: PropTypes.func,
    onDeleteClickedRedirect: PropTypes.func,
};

export default SelectableTable