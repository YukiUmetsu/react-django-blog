import React from 'react';
import { useForm } from 'react-hook-form'
import OutsideComponentAlerter from "../../hoc/Aux/OutsideComponentAlerter";

const LoginForm = (props) => {

    const { register, handleSubmit, watch, errors, formState, triggerValidation } = useForm({reValidateMode: 'onChange', submitFocusError: true});
    const onSubmit = data => { console.log(data) };
    const emailValidationRegister = register(
        {
            required: 'Email is required!',
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'invalid email address'
            }
        }
    );
    const passwordValidationRegister = register(
        {
            required: 'Password is required!',
            minLength: {
                value: 8,
                message: 'Minimum length is 8!'
            }
        }
    );
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

                <button type="submit" className="w-full text-center py-3 rounded bg-green-600 text-white hover:bg-green-900 focus:outline-none">
                    Login
                </button>
            </form>
        </OutsideComponentAlerter>
    );
};

export default LoginForm