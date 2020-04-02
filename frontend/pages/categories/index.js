import React from 'react';
import Aux from "../../hoc/Aux/Aux";
import SiteNavBar from "../../components/SiteNavBar";
import Footer from "../../components/Footer";
import CategoryHeader from "../../components/categories/CategoryHeader";
import FlexCardList from "../../components/UI/Cards/FlexCardList";
import {DUMMY_POSTS} from "../../constants";
import PostFilterDropdown from "../../components/UI/PostsFilters/PostFilterDropdown";

const Categories = (props) => {
    return (
        <Aux>
            <SiteNavBar/>
            <CategoryHeader/>
            <div className="mt-20">
                <PostFilterDropdown/>
            </div>
            <section className="relative py-5 mb-40 sm:mx-8 md:mx-8">
                <FlexCardList data={DUMMY_POSTS} isHorizontal={true} widthSizeClass="w-full" />
            </section>

            <Footer/>
        </Aux>
    );
};

export default Categories