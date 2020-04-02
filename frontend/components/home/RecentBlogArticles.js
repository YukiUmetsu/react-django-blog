import React, { Component } from "react";
import FlexCardList from "../UI/Cards/FlexCardList";
import Aux from "../../hoc/Aux/Aux";
import Dropdown from "../UI/Dropdown/Dropdown";
import {DUMMY_CATEGORY_DROPDOWN_ITEMS, DUMMY_POSTS, SORT_BY_DROPDOWN_ITEMS} from "../../constants";
import PostFilterDropdown from "../UI/PostsFilters/PostFilterDropdown";

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
                    <FlexCardList data={DUMMY_POSTS} />
                </section>
            </Aux>
        );
    }
}

export default RecentBlogArticles;