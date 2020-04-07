import React from 'react';

const SignUpForm = (props) => {
    return (
        <form action="">
            <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="fullname"
                placeholder="Full Name"/>

            <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="email"
                placeholder="Email"/>

            <input
                type="password"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="password"
                placeholder="Password"/>
            <input
                type="password"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="confirm_password"
                placeholder="Confirm Password"/>

            <button type="submit" className="w-full text-center py-3 rounded bg-green-600 text-white hover:bg-green-900 focus:outline-none my-1">
                Create Account
            </button>
        </form>
    );
};

export default SignUpForm