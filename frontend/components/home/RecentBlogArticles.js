import React, { Component } from "react";
import FlexCardList from "../UI/Cards/FlexCardList";
import Aux from "../../hoc/Aux/Aux";
import PostFilterDropdown from "../UI/PostsFilters/PostFilterDropdown";
import convertPosts from "../../lib/postDataConvert";

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
                    <PostFilterDropdown/>
                    <FlexCardList data={convertPosts(this.props.posts)} />
                </section>
            </Aux>
        );
    }
}

export default RecentBlogArticles;