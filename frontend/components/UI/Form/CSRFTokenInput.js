import React from 'react';
import Cookie from 'js-cookie';

const CSRFTokenInput = (props) => {
    let csrfToken = Cookie.get('csrftoken');
    return (
        <input type="hidden" name="csrf_token" value={csrfToken}/>
    );
};

export default CSRFTokenInput