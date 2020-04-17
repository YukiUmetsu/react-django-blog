import React from 'react';
import {ADMIN_SIDE_BAR_ITEMS} from "../../../../constants";
import AdminSideBarItem from "./AdminSideBarItem";
import { useRouter } from 'next/router'
import Aux from "../../../../hoc/Aux/Aux";

const AdminSideBar = (props) => {
    const router = useRouter();

    let renderSideBarItems = (items) => {
        return items.map((item, index) => {
            return (
               <AdminSideBarItem {...item} key={item.title} isActive={router.pathname === item.link} />
            );
        });
    };

    return (
        <Aux>
            <aside id="sidebar"
                   className="bg-gray-200 w-1/2 md:w-1/6 lg:w-1/6 border-r border-side-nav hidden md:block lg:block">

                <ul className="list-reset flex flex-col">
                    {renderSideBarItems(ADMIN_SIDE_BAR_ITEMS)}
                </ul>
            </aside>
        </Aux>
    );
};

export default AdminSideBar