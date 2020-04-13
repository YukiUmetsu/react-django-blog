import React, {useState} from 'react';
import PropTypes from 'prop-types';
import AdminHeaderCSS from './AdminHeader.module.css';

const AdminHeader = (props) => {
    let [ isProfileDropdownOpen, setIsSetProfileDropdownOpen ] = useState(false);

    let fullName = props.first_name + " " + props.last_name;

    return (
        <header className={AdminHeaderCSS['bg-nav']}>
            <div className="flex justify-between">
                <div className="p-1 mx-3 inline-flex self-center">
                    <h1 className="text-white">Logo</h1>
                    <div className="ml-3 w-6" onClick={() => props.onMenuIconClicked()}>
                        <img src="/images/icons/menu-white.png" className="h-full w-full object-cover"/>
                    </div>
                </div>
                <div className="p-1 flex flex-row" onClick={() => setIsSetProfileDropdownOpen(!isProfileDropdownOpen)}>
                    <img className="inline-block h-8 w-8 rounded-full" src={props.profile_img} alt="user icon" />
                        <a href="#" className="text-white p-2 no-underline hidden md:block lg:block">{fullName}</a>
                        <div
                            id="ProfileDropDown"
                            className={`${isProfileDropdownOpen ? "": "hidden"} rounded hidden shadow-md bg-white absolute pin-t mt-12 mr-1 pin-r`}>
                            <ul className="list-reset">
                                <li><a href="#" className="no-underline px-4 py-2 block text-black hover:bg-grey-light">My account</a></li>
                                <li><a href="#" className="no-underline px-4 py-2 block text-black hover:bg-grey-light">Notifications</a>
                                </li>
                                <li><hr className="border-t mx-2 border-grey-ligght" /></li>
                                <li><a href="#" className="no-underline px-4 py-2 block text-black hover:bg-grey-light">Logout</a>
                                </li>
                            </ul>
                        </div>
                </div>
            </div>
        </header>
    );
};

AdminHeader.propTypes = {
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    profile_img: PropTypes.string,
    onMenuIconClicked: PropTypes.func,
};

export default AdminHeader