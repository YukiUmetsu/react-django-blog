import React from 'react';
import AdminPanelLayout from "../../../components/UI/Admin/AdminPanelLayout";
import AdminPanelUsersTable from "../../../components/AdminPanel/Users/UsersTable";
import {withAdminAuth} from "../../../lib/auth/adminAuth";
import UserDataCenter from "../../../components/AdminPanel/Users/UserDataCenter";
import PackmanSpinner from "../../../components/UI/Spinner/PackmanSpinner";

const AdminPanelUsers = (props) => {

    return (
        <AdminPanelLayout>
            {props.isPageLoading ?
                <PackmanSpinner/>:
                <UserDataCenter>
                    <AdminPanelUsersTable/>
                </UserDataCenter>
            }
        </AdminPanelLayout>
    );
};

export default withAdminAuth(AdminPanelUsers)