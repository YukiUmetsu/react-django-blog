import React from 'react';
import AdminPanelLayout from "../../../components/UI/Admin/AdminPanelLayout";
import {DUMMY_ADMIN_USER_FOR_HEADER} from "../../../constants";
import AdminPanelUsersTable from "../../../components/AdminPanel/Users/UsersTable";
import {withAdminAuth} from "../../../lib/auth/adminAuth";
import UserDataCenter from "../../../components/AdminPanel/Users/UserDataCenter";

const AdminPanelUsers = (props) => {

    return (
        <AdminPanelLayout user={DUMMY_ADMIN_USER_FOR_HEADER}>
            <UserDataCenter>
                <AdminPanelUsersTable/>
            </UserDataCenter>
        </AdminPanelLayout>
    );
};

export default withAdminAuth(AdminPanelUsers)