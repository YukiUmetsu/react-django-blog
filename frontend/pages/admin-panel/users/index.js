import React from 'react';
import AdminPanelLayout from "../../../components/UI/Admin/AdminPanelLayout";
import {DUMMY_ADMIN_USER_FOR_HEADER} from "../../../constants";
import AdminPanelUsersTable from "../../../components/AdminPanel/Users/UsersTable";
import AddNewUser from "../../../components/AdminPanel/Users/AddNewUser";
import {withAdminAuth} from "../../../lib/auth/adminAuth";
import UserDataCenter from "../../../components/AdminPanel/Users/UserDataCenter";

const AdminPanelUsers = (props) => {

    return (
        <AdminPanelLayout user={DUMMY_ADMIN_USER_FOR_HEADER}>
            <div className="px-6 py-2 mb-3 float-none">
                <div className="float-left font-bold text-xl">Users</div>
                <AddNewUser additionalBtnClassNames="float-right"/>
            </div>
            <div className="float-none w-full py-5"> </div>
            <UserDataCenter>
                <AdminPanelUsersTable/>
            </UserDataCenter>
        </AdminPanelLayout>
    );
};

export default withAdminAuth(AdminPanelUsers)