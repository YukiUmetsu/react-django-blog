import React, {useRef} from 'react';
import CSRFTokenInput from "../UI/Form/CSRFTokenInput";
import OutsideComponentAlerter from "../../hoc/Aux/OutsideComponentAlerter";
import {EMAIL_VALIDATION_RULE, PASSWORD_VALIDATION_RULE} from "../../constants";
import { useForm } from 'react-hook-form'
import Router, {useRouter} from "next/router";
import {resetPasswordConfirmFetch} from "../../lib/auth";

const ResetPasswordForm = (props) => {
    const router = useRouter();
    const { register, handleSubmit, watch, errors, formState, triggerValidation } = useForm({reValidateMode: 'onChange', submitFocusError: true});
    const password = useRef({});
    password.current = watch("password", "");

    const onSubmit = async data => {
        let resetToken = router.query.reset_token;
        if(resetToken.length < 5){
            return false;
        }
        data['reset_token'] = resetToken;
        let result = await resetPasswordConfirmFetch(data);
        if(result){
            router.push('/users/login?reset_pass=true')
        }
    };

    const emailValidationRegister = register(EMAIL_VALIDATION_RULE);
    const passwordValidationRegister = register(PASSWORD_VALIDATION_RULE);
    const confirmPasswordValidationRegister = register({
        required:'Confirm Password is required!',
        validate: value =>
            value === password.current || "The passwords do not match"
    });

    let emailErrorMessage = "";
    if (errors.email) {
        emailErrorMessage = <p className="text-red-500 text-xs italic">{errors.email.message}</p>
    }
    let passwordErrorMessage = "";
    if (errors.password) {
        passwordErrorMessage = <p className="text-red-500 text-xs italic">{errors.password.message}</p>
    }
    let passwordConfErrorMessage = "";
    if (errors.confirm_password) {
        passwordConfErrorMessage = <p className="text-red-500 text-xs italic">{errors.confirm_password.message}</p>
    }

    let triggerAllValidation = async () => {
        await triggerValidation("email");
        await triggerValidation("password");
        await triggerValidation("confirm_password");
    };

    return (
        <OutsideComponentAlerter callback={() => triggerAllValidation()}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    className="block border border-grey-light w-full p-3 rounded mb-4"
                    name="email"
                    ref={emailValidationRegister}
                    placeholder="Email"/>
                {emailErrorMessage}
                <input
                    type="password"
                    className="block border border-grey-light w-full p-3 rounded mb-4"
                    name="password"
                    ref={passwordValidationRegister}
                    placeholder="Password"/>
                {passwordErrorMessage}
                <input
                    type="password"
                    className="block border border-grey-light w-full p-3 rounded mb-4"
                    name="confirm_password"
                    ref={confirmPasswordValidationRegister}
                    placeholder="Confirm Password"/>
                {passwordConfErrorMessage}
                <CSRFTokenInput/>
                <button type="submit" className="w-full text-center py-3 rounded bg-green-600 text-white hover:bg-green-900 focus:outline-none my-1">
                    Reset Password
                </button>
            </form>
        </OutsideComponentAlerter>
    );
};

export default ResetPasswordForm