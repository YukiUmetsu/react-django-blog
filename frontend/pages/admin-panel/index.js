import React from 'react';
import AdminPanelLayout from "../../components/UI/Admin/AdminPanelLayout";
import Table from "../../components/UI/Table/Table";
import {DUMMY_ADMIN_USER_FOR_HEADER, DUMMY_TABLE} from "../../constants";
import {withAdminAuth} from "../../lib/auth/adminAuth";
import PackmanSpinner from "../../components/UI/Spinner/PackmanSpinner";
import Aux from "../../hoc/Aux/Aux";

const AdminPanel = (props) => {

    let renderContent = () => {
        if(props.isPageLoading){
            return <PackmanSpinner/>;
        }
        return (
            <Aux>
                <div className="px-6 py-2 border-b border-light-grey">
                    <div className="font-bold text-xl">Admin Panel</div>
                </div>
            </Aux>
        );
    };

    return (
        <AdminPanelLayout user={DUMMY_ADMIN_USER_FOR_HEADER}>
            {renderContent()}
        </AdminPanelLayout>
    );
};

export default withAdminAuth(AdminPanel)