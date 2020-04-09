import React, { useRef } from 'react';
import { useForm } from 'react-hook-form'
import {EMAIL_VALIDATION_RULE, PASSWORD_VALIDATION_RULE} from "../../constants";
import OutsideComponentAlerter from "../../hoc/Aux/OutsideComponentAlerter";
import CSRFTokenInput from "./CSRFTokenInput";
import {signUpFetch} from "../../lib/auth";
import Router from "next/router";
import PropTypes from 'prop-types';


const SignUpForm = (props) => {

    const { register, handleSubmit, watch, errors, formState, triggerValidation } = useForm({reValidateMode: 'onChange', submitFocusError: true});
    const password = useRef({});
    password.current = watch("password", "");
    const onSubmit = data => {
        let result = signUpFetch(data);
        if(result === true) {
            Router.push('/users/login');
        } else {
            props.onServerError();
        }
    };

    const emailValidationRegister = register(EMAIL_VALIDATION_RULE);
    const passwordValidationRegister = register(PASSWORD_VALIDATION_RULE);
    const confirmPasswordValidationRegister = register({
        required:'Confirm Password is required!',
        validate: value =>
            value === password.current || "The passwords do not match"
    });

    let firstNameErrorMessage = "";
    if (errors.first_name) {
        firstNameErrorMessage = <p className="text-red-500 text-xs italic">{errors.first_name.message}</p>
    }
    let lastNameErrorMessage = "";
    if (errors.last_name) {
        lastNameErrorMessage = <p className="text-red-500 text-xs italic">{errors.last_name.message}</p>
    }
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
        await triggerValidation("first_name");
        await triggerValidation("last_name");
        await triggerValidation("confirm_password");
    };

    return (
        <OutsideComponentAlerter callback={() => triggerAllValidation()}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="first_name"
                ref={register({required: 'First name is required!'})}
                placeholder="First Name"/>
            {firstNameErrorMessage}
            <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="last_name"
                ref={register({required: 'Last name is required!'})}
                placeholder="Last Name"/>
            {lastNameErrorMessage}
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
                Create Account
            </button>
        </form>
        </OutsideComponentAlerter>
    );
};

SignUpForm.propTypes = {
    onServerError: PropTypes.func,
};

export default SignUpForm