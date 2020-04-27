import React, {useState} from 'react';
import AdminHeader from "./AdminHeader";
import AdminSideBar from "./SideBar/AdminSideBar";
import PropTypes from 'prop-types';
import NavigationSelection from "./SideBar/NavigationSelection";

const AdminPanelLayout = (props) => {

    let [ isSideBarVisible, setIsSideBarVisible ] = useState(true);

    return (
        <div className="mx-auto bg-grey-400">
            <div className="min-h-screen flex flex-col">
                <AdminHeader onMenuIconClicked={() => setIsSideBarVisible(!isSideBarVisible)}/>
                <div className="flex flex-1">
                    {isSideBarVisible?<AdminSideBar/>: ""}

                    <main className="bg-white-300 flex-1 p-3 overflow-hidden my-8">
                        {isSideBarVisible? <NavigationSelection/>: ""}

                        <div className="flex flex-col">
                            <div className="flex flex-1 flex-col md:flex-row lg:flex-row mx-2">
                                <div className="rounded overflow-hidden bg-white mx-2 w-full">
                                {props.children}
                                </div>
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
};

AdminPanelLayout.propTypes = {
  user: PropTypes.object,
};

export default AdminPanelLayout