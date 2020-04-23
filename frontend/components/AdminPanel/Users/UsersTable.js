import React from 'react';
import PropTypes from 'prop-types';
import Aux from '../../../hoc/Aux/Aux';
import SelectableTable from "../../UI/Table/SelectableTable/SelectableTable";
import {ADMIN_USER_TABLE_COLUMNS, USERS_LIST_API} from "../../../constants";
import Paginator from "../../UI/Pagination/Paginator";
import DataSearcher from "../../UI/Filters/DataSearcher";
import {isEmpty} from "../../../lib/utils";

const AdminPanelUsersTable = (props) => {

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
        {
            label: 'change to staff',
            value: 'staff',
        },
        {
            label: 'change to super admin',
            value: 'superuser',
        },
    ];

    return (
        <Aux>
            <DataSearcher
                searchKeys={createSearchKeys(columnData)}
                dataListFetchURL={USERS_LIST_API}
                dataNameKey="users">
                <Paginator
                    isActionRequired={isActionRequired}
                    columns={columnData}>
                    <SelectableTable
                        isActionsRequired={isActionRequired}
                        columns={columnData}
                        actionData={bunchActionData}/>
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