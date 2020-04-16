import React from 'react';
import OutsideComponentAlerter from "../../hoc/Aux/OutsideComponentAlerter";
import {EMAIL_VALIDATION_RULE} from "../../constants";
import CSRFTokenInput from "../UI/Form/CSRFTokenInput";
import PropTypes from 'prop-types';
import {useForm} from "react-hook-form";
import {resetPasswordFetch} from "../../lib/auth";
import {isEmpty} from "../../lib/utils";

const ForgotPasswordForm = (props) => {

    const { register, handleSubmit, errors, triggerValidation } = useForm({reValidateMode: 'onChange', submitFocusError: true});
    const emailValidationRegister = register(EMAIL_VALIDATION_RULE);
    let emailErrorMessage = "";
    if (errors.email) {
        emailErrorMessage = <p className="text-red-500 text-xs italic">{errors.email.message}</p>
    }

    const onSubmit = async (data) => {
        if(typeof window === 'undefined'){
            return;
        }
        if(isEmpty(data['email'])){
            return;
        }
        let result = await resetPasswordFetch(data);
        props.onRequestSent();
    };

    let triggerAllValidation = async () => {
        await triggerValidation("email");
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
                <button type="submit" className="w-full text-center py-3 rounded bg-green-600 text-white hover:bg-green-900 focus:outline-none">
                    Send an Email to Reset
                </button>
                <CSRFTokenInput/>
            </form>
        </OutsideComponentAlerter>
    );
};

ForgotPasswordForm.propTypes = {
    onRequestSent: PropTypes.func,
    ip: PropTypes.string
};
export default ForgotPasswordForm