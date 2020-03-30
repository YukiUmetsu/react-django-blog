import React, { Component } from "react";
import Card from "./Card";

class FlexCardList extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    createCards = (data) => {
        return data.map(item => {
            return <div key={item.title} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-8 ml-8 mr-8 p-25">
                <Card img={item.img} title={item.title} tags={item.tags} content={item.content}/>
            </div>
        })
    };

    render(){
        return (
            <div className="flex flex-wrap justify-center">
                {this.createCards(this.props.data)}
            </div>
        );
    }
}

export default FlexCardList;