import React from 'react';
import {DUMMY_POSTS} from "../../constants";
import FlexCardList from "../UI/Cards/FlexCardList";

const PostDetailRecommendation = (props) => {

    let renderCards = (posts) => {
        let firstThree = posts.splice(0,3);
        console.log(firstThree);
        return <FlexCardList
            isHorizontal={false}
            data={firstThree}
            cardSMWidthClass="w-full"
            cardMDWidthClass="w-full"
            cardLGWidthClass="w-1/4"
            cardXLWidthClass="w-1/4"/>
    };

    return (
        <div className="content-center">
            <div className="content-center text-center mb-20">
                <h1 className="font-bold break-normal text-xl md:text-3xl">You might also like ...</h1>
            </div>
            {renderCards(DUMMY_POSTS)}
        </div>
    );
};

export default PostDetailRecommendation