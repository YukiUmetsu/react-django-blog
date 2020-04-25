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
import AddNewUser from "./AddNewUser";
import AdminPanelLayout from "../../UI/Admin/AdminPanelLayout";

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

            <div className="px-6 py-2 mb-3 float-none">
                <div className="float-left font-bold text-xl">Users</div>
                <AddNewUser
                    additionalBtnClassNames="float-right"
                    dataCenterContext={UserDataCenterContext}
                    btnTitle="Add New User"
                    formData={FORM_DATA.NEW_USER_FORM}
                />
            </div>
            <div className="float-none w-full py-5"> </div>

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