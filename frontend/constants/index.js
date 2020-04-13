import {
    faAddressCard, faCog,
    faComments, faFolderPlus, faImages,
    faNewspaper,
    faQuestionCircle, faShoppingBasket,
    faTachometerAlt, faUser
} from "@fortawesome/free-solid-svg-icons";
import {faWpforms} from "@fortawesome/free-brands-svg-icons";

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

export const ADMIN_SIDE_BAR_ITEMS = [
    {
        title: 'Dashboard',
        icon: faTachometerAlt,
        link: '/admin-panel',
        subItems: [],
    },
    {
        title: 'Posts',
        icon: faNewspaper,
        link: '/admin-panel/posts',
        subItems: [],
    },
    {
        title: 'Comments',
        icon: faComments,
        link: '/admin-panel/comments',
        subItems: [],
    },
    {
        title: 'Cards',
        icon: faAddressCard,
        link: '/admin-panel/cards',
        subItems: [],
    },
    {
        title: 'Quizzes',
        icon: faQuestionCircle,
        link: '/admin-panel/quizzes',
        subItems: [],
    },
    {
        title: 'Users',
        icon: faUser,
        link: '/admin-panel/users',
        subItems: [],
    },
    {
        title: 'Tickets',
        icon: faWpforms,
        link: '/admin-panel/tickets',
        subItems: [],
    },
    {
        title: 'Media',
        icon: faImages,
        link: '/admin-panel/media',
        subItems: [],
    },
    {
        title: 'Categories',
        icon: faFolderPlus,
        link: '/admin-panel/categories',
        subItems: [],
    },
    {
        title: 'Settings',
        icon: faCog,
        link: '/admin-panel/categories',
        subItems: [],
    },
    {
        title: 'Products',
        icon: faShoppingBasket,
        subItems: [
            {
                title: 'Products Detail',
                link: '/admin-panel/products'
            },
            {
                title: 'Testimonials',
                link: '/admin-panel/products/testimonials'
            },
        ],
    },
];

export const ADMIN_USER_TABLE_COLUMNS = [
    {
        label: 'Icon',
        accessor: 'profile_img',
        type: 'image',
    },
    {
        label: 'First Name',
        accessor: 'first_name',
    },
    {
        label: 'Last Name',
        accessor: 'last_name',
    },
    {
        label: 'Email',
        accessor: 'email',
    },
    {
        label: "staff?",
        accessor: "is_staff",
        type: 'boolean',
    },
    {
        label: "super admin?",
        accessor: "is_superuser",
        type: 'boolean',
    },
    {
        label: 'Registered at',
        accessor: 'created_at',
        type: 'date',
    }
];

export * from "./DummyData";