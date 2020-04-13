import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import faker from "faker";  // dev dependency
import { Factory } from "rosie"; // dev dependency
import Aux from '../../../hoc/Aux/Aux';
import matchSorter from 'match-sorter'
import SelectableTable from "../../UI/Table/SelectableTable/SelectableTable";
import {ADMIN_USER_TABLE_COLUMNS} from "../../../constants";
import Paginator from "../../UI/Pagination/Paginator";


const personFactory = Factory.define("person")
    .attr("profile_img", faker.image.imageUrl(30,30,"people"))
    .attr("first_name", faker.name.firstName)
    .attr("last_name", faker.name.lastName)
    .attr("is_staff", faker.random.boolean)
    .attr("is_superuser", faker.random.boolean)
    .attr("email", faker.internet.email)
    .attr("created_at", faker.date.past);

const dataFactory = Factory.define("data")
    .sequence("id")
    .extend(personFactory);

const userData = dataFactory.buildList(50);

const AdminPanelUsersTable = (props) => {

    return (
        <Aux>
            <Paginator originalData={userData}>
                <SelectableTable actionsRequired={true} columns={ADMIN_USER_TABLE_COLUMNS}/>
            </Paginator>
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