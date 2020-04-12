export const IMG_HOST = 'http://localhost:8000/';
export const LOGIN_API = 'http://localhost:8000/api/rest-auth/login/';
export const LOGOUT_API = 'http://localhost:8000/api/rest-auth/logout/';
export const SIGN_UP_API = 'http://localhost:8000/api/rest-auth/registration/';
export const CONFIRM_TOKEN_API = 'http://localhost:8000/api/accounts-rest/registration/account-confirm-email/';
export const PASSWORD_RESET_API = 'http://localhost:8000/api/reset_password/';
export const PASSWORD_RESET_CONFIRM_API = 'http://localhost:8000/api/reset_password/confirm/';

export const EMAIL_VALIDATION_RULE = {
    required: 'Email is required!',
    pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        message: 'invalid email address'
    }
};

export const PASSWORD_VALIDATION_RULE = {
    required: 'Password is required!',
    minLength: {
        value: 8,
        message: 'Minimum length is 8!'
    }
};

export const SORT_BY_DROPDOWN_ITEMS = {
    'name': 'Articles Sort By',
    'items': [
        'Most Recent',
        'Post Name',
        'Tag',
    ]
};

export * from "./DummyData";