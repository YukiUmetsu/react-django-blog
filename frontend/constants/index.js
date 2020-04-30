import {IMG_HOST} from "./API";
import {faTachometerAlt} from "@fortawesome/free-solid-svg-icons/faTachometerAlt";
import {faNewspaper} from "@fortawesome/free-regular-svg-icons/faNewspaper";
import {faComments} from "@fortawesome/free-regular-svg-icons/faComments";
import {faAddressCard} from "@fortawesome/free-regular-svg-icons/faAddressCard";
import {faQuestionCircle} from "@fortawesome/free-regular-svg-icons/faQuestionCircle";
import {faUser} from "@fortawesome/free-regular-svg-icons/faUser";
import {faWpforms} from "@fortawesome/free-brands-svg-icons/faWpforms";
import {faImages} from "@fortawesome/free-regular-svg-icons/faImages";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import {faCog} from "@fortawesome/free-solid-svg-icons/faCog";
import {faShoppingBasket} from "@fortawesome/free-solid-svg-icons/faShoppingBasket";

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
        subItems: [
            {
                title: 'Post list',
                icon: faNewspaper,
                link: '/admin-panel/posts',
            },
            {
                title: 'Create a new post',
                icon: faNewspaper,
                link: '/admin-panel/posts/new',
            }
        ],
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
export const DEFAULT_PERSON_PHOTO = `${IMG_HOST}media/uploads/2020/04/05/default-person.png`;
export const DEFAULT_POST_MAIN_PHOTO = `${IMG_HOST}media/uploads/2020/04/05/fuji.jpg`;
export const SANITIZE_HTML_OPTIONS = {
    // allowedTags: false,
    // allowedAttributes: false,
    allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'span', 'u', 'img', 'del', 'sup', 'sub', 'table', 'tbody','tr', 'td'],
    allowedAttributes: {
        a: [ 'href', 'name', 'target' ],
        img: [ 'src' ],
        span: ['style', 'class'],
        p: ['style', 'class'],
        hr: ['class']
    },
    allowedSchemesByTag: {
        a: ['https', 'http'],
        img: [ 'data' ]
    },
    nonTextTags: ['script', 'textarea', 'noscript' ],
    transformTags: {
        'table': function(tagName, attribs) {
            return {
                tagName: tagName,
                attribs: {
                    class: 'table-auto'
                }
            };
        },
        'td': function (tagName, attribs) {
            return {
                tagName: tagName,
                attribs: {
                    class: 'border px-4 py-2',
                }
            }
        },
    }
};

export * from './SWR';
export * from './DummyData';
export * from './API';
export * from './NotificationConst'
export * from './TableColumns';