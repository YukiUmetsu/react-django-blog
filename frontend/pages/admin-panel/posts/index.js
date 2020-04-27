import React from 'react';
import AdminPanelLayout from "../../../components/UI/Admin/AdminPanelLayout";
import {withAdminAuth} from "../../../lib/auth/adminAuth";
import PackmanSpinner from "../../../components/UI/Spinner/PackmanSpinner";
import PostsDataCenter from "../../../components/AdminPanel/Posts/PostsDataCenter";
import AdminPanelPostsTable from "../../../components/AdminPanel/Posts/PostsTable";

const AdminPanelPosts = (props) => {

    return (
        <AdminPanelLayout>
            {props.isPageLoading?
                <PackmanSpinner/>:
                <PostsDataCenter>
                    <AdminPanelPostsTable/>
                </PostsDataCenter>
            }
        </AdminPanelLayout>
    );
};

export default withAdminAuth(AdminPanelPosts)