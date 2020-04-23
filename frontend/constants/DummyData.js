import {IMG_HOST} from "./API";

export const DUMMY_TABLE_ACTIONS = [
    {
        label: 'Actions',
        value: '',
        callback: (selectedItems) => {console.log('not selected'); console.log(selectedItems);}
    },
    {
        label: 'delete users',
        value: 'delete',
        callback: (selectedItems) => {console.log('delete'); console.log(selectedItems);}
    },
    {
        label: 'make them staff',
        value: 'staff',
        callback: (selectedItems) => {console.log('staff'); console.log(selectedItems);}
    },
    {
        label: 'make them super admin',
        value: 'superuser',
        callback: (selectedItems) => {console.log('superuser'); console.log(selectedItems);}
    },
];

export const DUMMY_TABLE = {
    header: ["#", "Category", "Title", "Access", "Change"],
    body: [
        [
            {content: "JLPTN5"},
            {content: "How to learn JLPTN5 Vocabulary"},
            {content: "4500"},
            {content: "5%", increase: true},
        ],
        [
            {content: "JLPTN5"},
            {content: "How to learn JLPTN5 Grammar"},
            {content: "4400"},
            {content: "15%", decrease: true},
        ],
        [
            {content: "JLPTN5"},
            {content: "How to learn JLPTN5 Listening"},
            {content: "3000"},
            {content: "15%", decrease: true},
        ],
        [
            {content: "JLPTN5"},
            {content: "How to learn JLPTN4 Listening"},
            {content: "2000"},
            {content: "25%", increase: true},
        ],
    ],
};

export const DUMMY_ADMIN_USER_FOR_HEADER = {
    first_name: 'Yuki',
    last_name: 'Umetsu',
    profile_img: IMG_HOST + "media/uploads/2020/04/05/yuki-profile.jpg"
};

export const DUMMY_CARD_DATA = {
    'front': {
        'title': 'Test title front',
        'image': IMG_HOST + 'media/uploads/2020/04/05/fuji.jpg',
        'audio': IMG_HOST + 'media/uploads/2020/04/05/bell.mp3',
        'content': 'What is the highest mountain in the world?',
    },
    'back': {
        'title': 'Test title back',
        'image': '',
        'audio': '',
        'content': 'This is the answer!!',
    }
};

export const DUMMY_CATEGORY_DROPDOWN_ITEMS = {
    'name': 'Select Category',
    'items': [
        'JLPT',
        'N5 Grammar',
        'N5 Listening',
        'N5 Vocabulary',
    ]
};

export const DUMMY_POSTS = [
    {
        'title': 'JLPT N5 Vocabulary with sentences #1',
        'img': '/images/header/fuji.jpg',
        'tags': 'Fuji',
        'published_at': '2020/02/28',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #2',
        'img': '/images/header/odaiba.jpg',
        'tags': 'Odaiba',
        'published_at': '2020/02/28',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #3',
        'img': '/images/header/osakajo.jpg',
        'tags': 'Osakajo',
        'published_at': '2020/02/28',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #4',
        'img': '/images/header/shibuya.jpg',
        'tags': 'Shibuya',
        'published_at': '2020/02/28',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #5',
        'img': '/images/header/fuji.jpg',
        'tags': 'Fuji',
        'published_at': '2020/02/28',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #6',
        'img': '/images/header/odaiba.jpg',
        'tags': 'Odaiba',
        'published_at': '2020/02/28',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #7',
        'img': '/images/header/osakajo.jpg',
        'tags': 'Osakajo',
        'published_at': '2020/02/28',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #8',
        'img': '/images/header/shibuya.jpg',
        'tags': 'Shibuya',
        'published_at': '2020/02/28',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
];