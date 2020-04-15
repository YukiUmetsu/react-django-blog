import React from 'react';
import PropTypes from 'prop-types';
import faker from "faker";  // dev dependency
import { Factory } from "rosie"; // dev dependency
import Aux from '../../../hoc/Aux/Aux';
import SelectableTable from "../../UI/Table/SelectableTable/SelectableTable";
import {ADMIN_USER_TABLE_COLUMNS} from "../../../constants";
import Paginator from "../../UI/Pagination/Paginator";
import DataSearcher from "../../UI/Filters/DataSearcher";
import {isEmpty} from "../../../lib/utils";

//------ Codes for dev testing ------//
const personFactory = Factory.define("person")
    .attr("profile_img", "http://localhost:8000/media/uploads/2020/04/05/yuki-profile.jpg")
    .attr("first_name", faker.name.firstName)
    .attr("last_name", faker.name.lastName)
    .attr("is_staff", faker.random.boolean)
    .attr("is_superuser", faker.random.boolean)
    .attr("email", faker.internet.email)
    .attr("created_at", faker.date.past);

const dataFactory = Factory.define("data")
    .sequence("id")
    .extend(personFactory);

const userData = dataFactory.buildList(200);
//------ Codes for dev testing ------//

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
            <DataSearcher originalData={userData} searchKeys={createSearchKeys(columnData)}>
                <Paginator
                    isActionRequired={isActionRequired}
                    columns={columnData}>
                    <SelectableTable
                        isActionsRequired={isActionRequired}
                        columns={columnData}
                        actionData={bunchActionData}
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