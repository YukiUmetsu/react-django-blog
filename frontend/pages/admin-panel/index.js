import React from 'react';
import AdminPanelLayout from "../../components/UI/Admin/AdminPanelLayout";
import Table from "../../components/UI/Table/Table";
import {DUMMY_ADMIN_USER_FOR_HEADER, DUMMY_TABLE} from "../../constants";
import {withAdminAuth} from "../../lib/auth/adminAuth";

const AdminPanel = (props) => {

    return (
        <AdminPanelLayout user={DUMMY_ADMIN_USER_FOR_HEADER}>
            <div className="px-6 py-2 border-b border-light-grey">
                <div className="font-bold text-xl">Trending Categories</div>
            </div>
            <Table {...DUMMY_TABLE} />
        </AdminPanelLayout>
    );
};

export default withAdminAuth(AdminPanel)