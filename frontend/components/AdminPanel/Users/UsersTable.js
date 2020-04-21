import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Aux from '../../../hoc/Aux/Aux';
import SelectableTable from "../../UI/Table/SelectableTable/SelectableTable";
import {ADMIN_USER_TABLE_COLUMNS, SWR_FETCH, USERS_LIST_API} from "../../../constants";
import Paginator from "../../UI/Pagination/Paginator";
import DataSearcher from "../../UI/Filters/DataSearcher";
import {dClone, getObjsToAdd, isEmpty, removeDuplicatesById} from "../../../lib/utils";
import {createUserData} from "../../../lib/DataFactory";
import useSWR from 'swr'
import Alert from "../../UI/Notifications/Alert";

const userData = createUserData(200);
//------ Codes for dev testing ------//

const AdminPanelUsersTable = (props) => {
    let localUsers = [];
    if (typeof window !== 'undefined') {
        let userStorage = localStorage.getItem('users');
        localUsers = JSON.parse(userStorage);
    }
    let [hasError, setHasError] = useState(false);
    let [userData, setUserData] = useState(localUsers);
    let [nextFetchUrl, setNextFetchUrl] = useState(USERS_LIST_API);

    useEffect(() => {
        return () => {
            localStorage.removeItem('users');
        }
    }, []);

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

    const addToUserData = async (data = []) => {
        if(isEmpty(data)){
            return;
        }
        let usersToAdd = [];
        let newUserData = [];
        if(!isEmpty(userData)){
            newUserData = await dClone(userData);
        }

        newUserData = await newUserData.concat(data);

        if(isEmpty(userData)){
            newUserData = data;
        } else {
            let userCurrentIds = userData.map(item => item.id);
            usersToAdd = getObjsToAdd(data, userCurrentIds);
            if(!isEmpty(usersToAdd)){
                newUserData = newUserData.concat(usersToAdd);
            }
        }
        // remove duplicates
        newUserData = removeDuplicatesById(newUserData);
        if(typeof window !== 'undefined'){
            await localStorage.setItem('users', JSON.stringify(newUserData));
        }
        return newUserData;
    };

    const {error, data} = useSWR(
        nextFetchUrl,
        SWR_FETCH,
        {
            onSuccess: async (data) => {
                let newUserData = await addToUserData(data.results);
                await setUserData(newUserData);
                await setNextFetchUrl(data.next);
            },
            onError: () => { setHasError(true)},
        }
    );


    let renderAlert = () => {
        if(hasError){
            return <Alert title="Something went wrong" content="Failed to load user data" />;
        }
    };

    return (
        <Aux>
            {renderAlert()}
            <DataSearcher originalData={userData} searchKeys={createSearchKeys(columnData)}>
                <Paginator
                    originalData={userData}
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