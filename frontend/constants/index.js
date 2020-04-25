import {
    faAddressCard, faCog,
    faComments, faFolderPlus, faImages,
    faNewspaper,
    faQuestionCircle, faShoppingBasket,
    faTachometerAlt, faUser
} from "@fortawesome/free-solid-svg-icons";
import {faWpforms} from "@fortawesome/free-brands-svg-icons";

export const ICON_FILE_SIZE = 50;
export const ICON_SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

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

export const SORT_ORDER = {
    NONE: "NONE",
    ASC: "ASC",
    DESC: "DESC",
};

export const ADMIN_USER_TABLE_COLUMNS = [
    {
        label: 'Icon',
        accessor: 'profile_img',
        type: 'image',
        editable: true,
        showOnDelete: false,
        formLength: 'full',
    },
    {
        label: 'First Name',
        accessor: 'first_name',
        type: 'text',
        editable: true,
        formLength: '1/2',
        showOnDelete: true,
    },
    {
        label: 'Last Name',
        accessor: 'last_name',
        type: 'text',
        editable: true,
        formLength: '1/2',
        showOnDelete: true,
    },
    {
        label: 'Email',
        accessor: 'email',
        type: 'text',
        searchType: 'equal',
        editable: true,
        formLength: 'full',
        showOnDelete: true,
    },
    {
        label: "staff",
        accessor: "is_staff",
        type: 'boolean',
        editable: true,
        formLength: 'full',
        showOnDelete: true,
    },
    {
        label: "super admin",
        accessor: "is_superuser",
        type: 'boolean',
        editable: true,
        formLength: 'full',
        showOnDelete: false,
    },
    {
        label: 'Registered at',
        accessor: 'created_at',
        type: 'date',
        editable: false,
        showOnDelete: false,
    }
];

export const SELECTABLE_TABLE_CONSTS = {
    HEADER_SORT_NORMAL: 0,
    HEADER_SORT_ASC: 1,
    HEADER_SORT_DESC: 2,
};

export const BLOG_EDITOR_OPTIONS = {
    buttonList: [
        ['undo', 'redo'],
        ['font', 'fontSize', 'formatBlock'],
        ['paragraphStyle', 'blockquote'],
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['fontColor', 'hiliteColor', 'textStyle'],
        ['removeFormat'],
        ['outdent', 'indent'],
        ['align', 'horizontalRule', 'list', 'lineHeight'],
        ['table', 'link', 'image', 'video'],
        ['fullScreen', 'showBlocks', 'codeView'],
        ['preview', 'print'],
        ['save', 'template'],
    ],
    charCounter: true,
    imageRotation: true
};

export const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export const IS_STAFF_SESSION_NAME = "stf";
export const IS_SUPERUSER_SESSION_NAME = "stfspad";
export const ANGO_SESSION_NAME = 'angoukagi';
export const USER_ID_SESSION_NAME = 'daredesuka';

export * from './SWR';
export * from './DummyData';
export * from './API';
export * from './NotificationConst'