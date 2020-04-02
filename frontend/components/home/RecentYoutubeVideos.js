import React from 'react';
import FlexCardList from "../UI/Cards/FlexCardList";
import {DUMMY_POSTS} from "../../constants";

const RecentYoutubeVideos = (props) => {
    return (
        <section className="relative py-20 mb-40">
            <div className="flex mb-16 justify-center">
                <h1 className="text-center text-5xl">Popular Youtube Videos</h1>
            </div>
            <FlexCardList data={DUMMY_POSTS} />
        </section>
    );
};

export default RecentYoutubeVideos