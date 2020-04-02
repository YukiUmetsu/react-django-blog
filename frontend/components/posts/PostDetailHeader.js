import React from 'react';
import Aux from "../../hoc/Aux/Aux";

const PostDetailHeader = (props) => {
    const headerStyle = {
        backgroundImage: `url('${props.image}')`,
        height: "75vh"
    };

    return (
        <Aux>
            <div className="text-center pt-16 md:pt-32">
                <p className="text-sm md:text-base text-teal-500 font-bold">{props.published_at} <span className="text-gray-900">/</span> {props.category}</p>
                <h1 className="font-bold break-normal text-3xl md:text-5xl">{props.title}</h1>
            </div>
            <div id="post-detail-header" className="container w-full max-w-6xl mx-auto bg-white bg-cover mt-8 rounded" style={headerStyle}> </div>
        </Aux>
    );
};

export default PostDetailHeader