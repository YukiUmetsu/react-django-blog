import React from 'react';
import {withAuthSync} from "../../lib/auth";

const UsersDashboard = (props) => {
    return (
        <h1>User Dashboard</h1>
    );
};

export default withAuthSync(UsersDashboard)