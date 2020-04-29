import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import AdminHeaderCSS from './AdminHeader.module.css';
import Link from "next/link";
import {ADMIN_LOGOUT_URL} from "../../../constants/URLs";
import {AdminAuthContext} from "../../../lib/auth/adminAuth";
import {isEmpty} from "../../../lib/utils";
import {API_BASE} from "../../../constants";
import OutsideComponentAlerter from "../../../hoc/Aux/OutsideComponentAlerter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUserCircle} from "@fortawesome/free-regular-svg-icons/faUserCircle";


const AdminHeader = React.memo((props) => {
    let { loggedInUser: loggedInUser} = useContext(AdminAuthContext);

    let [ isProfileDropdownOpen, setIsSetProfileDropdownOpen ] = useState(false);
    let [ displayName, setDisplayName ] = useState('No Name');
    let [ displayIcon, setDisplayIcon ] = useState(null);

    useEffect(() => {
        updateDisplayName();
        updateDisplayIcon();
    }, [loggedInUser]);

    let updateDisplayName = () => {
        if(!isEmpty(loggedInUser) && !isEmpty(loggedInUser.first_name) && !isEmpty(loggedInUser.last_name)){
            setDisplayName(loggedInUser.first_name + " " + loggedInUser.last_name);
        }
    };

    let updateDisplayIcon = () => {
        if(!isEmpty(loggedInUser) && !isEmpty(loggedInUser.profile_img)){
            setDisplayIcon(API_BASE + loggedInUser.profile_img.file);
        }
    };

    let renderUserIcon = () => {
        if(!isEmpty(displayIcon)){
            return <img className="inline-block h-8 w-8 rounded-full" src={displayIcon} alt="user icon" />;
        }
        return <FontAwesomeIcon icon={faUserCircle} className="text-white mt-1" size={"2x"}/>;
    };

    return (
        <OutsideComponentAlerter callback={() => setIsSetProfileDropdownOpen(false)}>
            <header className={AdminHeaderCSS['bg-nav']}>
                <div className="flex justify-between pt-1">

                    <div className="p-1 mx-3 inline-flex self-center">
                        <h1 className="text-white">Logo</h1>
                        <div className="ml-3 w-6" onClick={() => props.onMenuIconClicked()}>
                            <img src="/images/icons/menu-white.png" className="h-full w-full object-cover"/>
                        </div>
                    </div>

                    <div className="p-1 flex flex-row mr-5 relative" onClick={() => setIsSetProfileDropdownOpen(!isProfileDropdownOpen)}>
                        {renderUserIcon()}
                            <a href="#" className={`text-white p-2 no-underline ${isProfileDropdownOpen? "": "hidden"} md:block lg:block`}>
                                {displayName}
                            </a>
                            <div
                                id="ProfileDropDown"
                                className={`${isProfileDropdownOpen ? "": "hidden"} -left-6 rounded shadow-md bg-white absolute pin-t mt-12 mr-1 pin-r`}>
                                <ul className="list-reset">
                                    <li><a href="#" className="no-underline px-4 py-2 block text-black hover:bg-gray-300">My account</a></li>
                                    <li><a href="#" className="no-underline px-4 py-2 block text-black hover:bg-gray-300">Notifications</a>
                                    </li>
                                    <li><hr className="border-t mx-2 border-gray-400" /></li>
                                    <li>
                                        <Link href={ADMIN_LOGOUT_URL}>
                                            <a className="no-underline px-4 py-2 block text-black hover:bg-gray-300">Logout</a>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                    </div>
                </div>
            </header>
        </OutsideComponentAlerter>
    );
});

AdminHeader.propTypes = {
    onMenuIconClicked: PropTypes.func,
};

export default AdminHeader