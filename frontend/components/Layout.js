import React from 'react';
import SiteNavBar from "./SiteNavBar";

const Layout = (props) => {
    return (
        <div>
            <SiteNavBar/>
            {props.children}
        </div>
    );
};

export default Layout