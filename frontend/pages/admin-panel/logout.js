import React, { useEffect, useState } from 'react'
import {adminLogout} from "../../lib/auth/adminAuth";

const AdminLogout = (props) => {
    const [isComponentMounted, setIsComponentMounted] = useState(false);
    useEffect(() => setIsComponentMounted(true), []);

    if(isComponentMounted){
        // run only on client side
        adminLogout();
    }
    return (
        <div> </div>
    );
};

export default AdminLogout