import React from 'react';
import AdminPanelLayout from "../../../components/UI/Admin/AdminPanelLayout";
import {withAdminAuth} from "../../../lib/auth/adminAuth";
import PackmanSpinner from "../../../components/UI/Spinner/PackmanSpinner";

const AdminPanelNewPost = (props) => {

    return (
        <AdminPanelLayout>
            { props.isPageLoading?
                <PackmanSpinner/>:
                <h1>New Post</h1>
            }
        </AdminPanelLayout>
    );
};

export default withAdminAuth(AdminPanelNewPost)