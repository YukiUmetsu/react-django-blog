import React, { Component } from "react";
import FlexCardList from "../UI/Cards/FlexCardList";
import Aux from "../../hoc/Aux/Aux";

class RecentBlogArticles extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return (
            <Aux>
                <section className="relative py-20">
                    <div className="flex mb-16 justify-center">
                        <h1 className="text-center text-5xl">Recent Blog Articles</h1>
                    </div>
                    <FlexCardList data={POSTS} />
                </section>
            </Aux>
        );
    }
}

const POSTS = [
    {
        'title': 'JLPT N5 Vocabulary with sentences #1',
        'img': '/images/header/fuji.jpg',
        'tags': 'Fuji',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #2',
        'img': '/images/header/odaiba.jpg',
        'tags': 'Odaiba',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #3',
        'img': '/images/header/osakajo.jpg',
        'tags': 'Osakajo',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #4',
        'img': '/images/header/shibuya.jpg',
        'tags': 'Shibuya',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #5',
        'img': '/images/header/fuji.jpg',
        'tags': 'Fuji',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #6',
        'img': '/images/header/odaiba.jpg',
        'tags': 'Odaiba',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #7',
        'img': '/images/header/osakajo.jpg',
        'tags': 'Osakajo',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
    {
        'title': 'JLPT N5 Vocabulary with sentences #8',
        'img': '/images/header/shibuya.jpg',
        'tags': 'Shibuya',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.'
    },
];

export default RecentBlogArticles;