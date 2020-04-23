import React, { useEffect, useState } from 'react'
import { logout } from "../../lib/auth/auth";

const Logout = (props) => {
    const [isComponentMounted, setIsComponentMounted] = useState(false);
    useEffect(() => setIsComponentMounted(true), []);

    if(isComponentMounted){
        // run only on client side
        logout();
    }
    return (
        <div></div>
    );
};

export default Logout