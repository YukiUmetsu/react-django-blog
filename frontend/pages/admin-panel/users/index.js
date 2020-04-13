import React from 'react';
import AdminPanelLayout from "../../../components/UI/Admin/AdminPanelLayout";
import {DUMMY_ADMIN_USER_FOR_HEADER, DUMMY_TABLE} from "../../../constants";
import AdminPanelUsersTable from "../../../components/AdminPanel/Users/UsersTable";

const AdminPanelUsers = (props) => {

    return (
        <AdminPanelLayout user={DUMMY_ADMIN_USER_FOR_HEADER}>
            <div className="px-6 py-2 mb-3">
                <div className="font-bold text-xl">Users</div>
            </div>
            <AdminPanelUsersTable/>
        </AdminPanelLayout>
    );
};

export default AdminPanelUsers