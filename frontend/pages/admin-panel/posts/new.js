import React from 'react';
import AdminPanelLayout from "../../../components/UI/Admin/AdminPanelLayout";
import {withAdminAuth} from "../../../lib/auth/adminAuth";
import PackmanSpinner from "../../../components/UI/Spinner/PackmanSpinner";
import PostsDataCenter from "../../../components/AdminPanel/Posts/PostsDataCenter";
import {CATEGORIES_LIST_API} from "../../../constants";
import PostForm from "../../../components/AdminPanel/Posts/PostForm";
import Aux from "../../../hoc/Aux/Aux";
import {POSTS_FORM_DATA} from "../../../constants/FormDataConst";

const AdminPanelNewPost = (props) => {

    return (
        <AdminPanelLayout>
            <PostsDataCenter
                mainDataRequired={false}
                userDataRequired={false}
                firstApiFetchURL={CATEGORIES_LIST_API}
            >

                { props.isPageLoading?
                    <PackmanSpinner/>:
                    <Aux>
                        <h1>Write a Post</h1>
                        <PostForm form_id_prefix='new_post' formData={POSTS_FORM_DATA} />
                    </Aux>
                }

            </PostsDataCenter>
        </AdminPanelLayout>
    );
};

export default withAdminAuth(AdminPanelNewPost)