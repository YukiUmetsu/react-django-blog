import React from 'react';
import { useForm } from 'react-hook-form'
import OutsideComponentAlerter from "../../../hoc/Aux/OutsideComponentAlerter";
import {EMAIL_VALIDATION_RULE, PASSWORD_VALIDATION_RULE} from "../../../constants";
import CSRFTokenInput from "../../UI/Form/CSRFTokenInput";
import {AdminLoginFetch, loginFetch} from "../../../lib/auth";
import cookie from 'js-cookie'
import PropTypes from 'prop-types';


const AdminLoginForm = (props) => {

    const { register, handleSubmit, errors, triggerValidation } = useForm({reValidateMode: 'onChange', submitFocusError: true});

    const onSubmit = async data => {
        if(typeof window === 'undefined'){
            return;
        }
        let current_login_fail = parseInt(cookie.get('login_fail'));
        if(isNaN(current_login_fail)){
            current_login_fail = 0;
            cookie.set('login_fail', 0, { expires: 1 });
        }
        if (current_login_fail > props.maxLoginFailure) {
            await props.onMaxLoginFailureCallback();
            return;
        }
        let responseData = await AdminLoginFetch(data);
        if (!responseData.response.ok) {
           props.onServerError();
           cookie.set('login_fail', current_login_fail+1, { expires: 1 });
        }
    };

    const emailValidationRegister = register(EMAIL_VALIDATION_RULE);
    const passwordValidationRegister = register(PASSWORD_VALIDATION_RULE);
    let emailErrorMessage = "";
    if (errors.email) {
        emailErrorMessage = <p className="text-red-500 text-xs italic">{errors.email.message}</p>
    }
    let passwordErrorMessage = "";
    if (errors.password) {
        passwordErrorMessage = <p className="text-red-500 text-xs italic">{errors.password.message}</p>
    }

    let triggerAllValidation = async () => {
        await triggerValidation("email");
        await triggerValidation("password");
    };


    return (
        <OutsideComponentAlerter callback={() => triggerAllValidation()}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    className="block border border-grey-light w-full p-3 rounded mb-4"
                    name="email"
                    placeholder="Email"
                    ref={emailValidationRegister}
                />
                {emailErrorMessage}
                <input
                    type="password"
                    className="block border border-grey-light w-full p-3 rounded mb-4"
                    name="password"
                    placeholder="Password"
                    ref={passwordValidationRegister}
                />
                {passwordErrorMessage}
                <CSRFTokenInput/>
                <button type="submit" className="w-full text-center py-3 rounded bg-green-600 text-white hover:bg-green-900 focus:outline-none">
                    Login
                </button>
            </form>
        </OutsideComponentAlerter>
    );
};

AdminLoginForm.propTypes = {
    onServerError: PropTypes.func,
    maxLoginFailure: PropTypes.number,
    onMaxLoginFailureCallback: PropTypes.func
};

export default AdminLoginForm