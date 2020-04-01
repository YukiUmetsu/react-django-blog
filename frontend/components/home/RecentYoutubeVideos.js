import React from 'react';
import FlexCardList from "../UI/Cards/FlexCardList";

const RecentYoutubeVideos = (props) => {
    return (
        <section className="relative py-20 mb-40">
            <div className="flex mb-16 justify-center">
                <h1 className="text-center text-5xl">Popular Youtube Videos</h1>
            </div>
            <FlexCardList data={POSTS} />
        </section>
    );
};

const POSTS = [
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

export default RecentYoutubeVideos