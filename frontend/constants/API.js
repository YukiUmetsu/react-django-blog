import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig();

export const API_BASE = publicRuntimeConfig.API_BASE;
export const IMG_HOST = API_BASE + '/';
export const LOGIN_API = API_BASE + '/api/rest-auth/login/';
export const LOGOUT_API = API_BASE + '/api/rest-auth/logout/';
export const SIGN_UP_API = API_BASE + '/api/rest-auth/registration/';
export const CONFIRM_TOKEN_API = API_BASE + '/api/accounts-rest/registration/account-confirm-email/';
export const PASSWORD_RESET_API = API_BASE + '/api/reset_password/';
export const PASSWORD_RESET_CONFIRM_API = API_BASE + '/api/reset_password/confirm/';
export const USERS_LIST_API = API_BASE + '/api/users/';
export const USER_DETAIL_FROM_TOKEN_API = API_BASE + '/api/users/me/';
export const FILES_LIST_API = API_BASE + '/api/files/';
export const POSTS_LIST_API = API_BASE + '/api/posts/';
export const CATEGORIES_LIST_API = API_BASE + '/api/categories/';
export const POST_STATES_LIST_API = API_BASE + '/api/post_states/';