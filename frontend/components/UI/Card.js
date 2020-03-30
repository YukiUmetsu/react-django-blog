import React, { Component } from "react";

class Card extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    createTags = (tags) => {
        if (Array.isArray(tags)){
            return tags.map(tag => this.createATag(tag))

        } else if(typeof tags === "string"){
            return this.createATag(tags)
        }
    };

    createATag = (tag) => {
        return (
            <span
                key={tag}
                className="inline-block bg-red-500 rounded-lg px-3 py-1 text-sm font-semibold text-white">
                #{tag}
            </span>
        )
    };

    render(){
        return (
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <img className="w-full object-cover h-48" src={this.props.img} alt="Sunset in the mountains" />
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{this.props.title}</div>
                    <p className="text-gray-700 text-base">
                        {this.props.content}
                    </p>
                </div>
                <div className="px-6 py-4">
                    {this.createTags(this.props.tags)}
                </div>
            </div>
        );
    }
}

export default Card;