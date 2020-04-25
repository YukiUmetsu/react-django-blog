import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import Aux from '../../../hoc/Aux/Aux';
import SelectableTable from "../../UI/Table/SelectableTable/SelectableTable";
import {ADMIN_USER_TABLE_COLUMNS, USERS_LIST_API} from "../../../constants";
import Paginator from "../../UI/Pagination/Paginator";
import DataSearcher from "../../UI/Filters/DataSearcher";
import {isEmpty} from "../../../lib/utils";
import {FORM_DATA} from "../../../constants/FormDataConst";
import {UserDataCenterContext} from "./UserDataCenter";
import Alert from "../../UI/Notifications/Alert";

const AdminPanelUsersTable = (props) => {

    const {
        updateEditUserFormData: updateEditUserFormData,
        alertProps: alertProps,
        dataManipulationComplete: dataManipulationComplete,
    } = useContext(UserDataCenterContext);

    let isActionRequired = true;
    let columnData = ADMIN_USER_TABLE_COLUMNS;
    let createSearchKeys = (columns = []) => {
        return columns.map(item => {
            let type = isEmpty(item.type) ? "text": item.type;
            return {key: item.accessor, type: type}
        });
    };
    let bunchActionData = [
        {
            label: 'delete users',
            value: 'delete',
        },
    ];

    let onEditObjFormSubmitted = async (formData) => {
        if(formData.profile_img.length < 1){
            delete await formData.profile_img;
        }
        await updateEditUserFormData(formData);
    };

    return (
        <Aux>
            <Alert {...alertProps} />
            <DataSearcher
                searchKeys={createSearchKeys(columnData)}
                dataListFetchURL={USERS_LIST_API}
                dataCenterContext={UserDataCenterContext}>
                <Paginator
                    isActionRequired={isActionRequired}
                    columns={columnData}>
                    <SelectableTable
                        isActionsRequired={isActionRequired}
                        columns={columnData}
                        actionData={bunchActionData}
                        editObjFormData={FORM_DATA.EDIT_USER_FORM}
                        onEditObjFormSubmitted={(formData) => onEditObjFormSubmitted(formData)}
                        dataCenterContext={UserDataCenterContext}
                    />
                </Paginator>
            </DataSearcher>
        </Aux>
    )

};

AdminPanelUsersTable.defaultProps = {
    keyField: "id"
};

AdminPanelUsersTable.propTypes = {
    keyField: PropTypes.string
};

export default AdminPanelUsersTable