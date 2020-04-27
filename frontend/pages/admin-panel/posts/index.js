import React from 'react';
import AdminPanelLayout from "../../../components/UI/Admin/AdminPanelLayout";
import {withAdminAuth} from "../../../lib/auth/adminAuth";

const AdminPanelPosts = (props) => {

    return (
        <AdminPanelLayout>
            <h1>Posts</h1>
        </AdminPanelLayout>
    );
};

export default withAdminAuth(AdminPanelPosts)