import React from 'react';
import Link from "next/link";
import PropTypes from 'prop-types';

const AdminSideBarSubItem = React.memo((props) => {
    return (
        <li className="border-t border-light-border w-full h-full pl-5 pr-1 py-3">
            <Link href={props.link}>
                <a className="mx-4 font-sans font-hairline hover:font-normal text-sm text-nav-item no-underline">
                    {props.title}
                </a>
            </Link>
        </li>
    );
});

AdminSideBarSubItem.propTypes = {
    link: PropTypes.string,
    title: PropTypes.string,
};

export default AdminSideBarSubItem