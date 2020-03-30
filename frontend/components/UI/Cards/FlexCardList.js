import React, { Component } from "react";
import Card from "./Card";
import PropTypes from "prop-types";
import HorizontalCard from "./HorizontalCard";

class FlexCardList extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    createCards = (data) => {
        if(this.props.isHorizontal) {
            return data.map(item => {
                return <HorizontalCard key={item.title} img={item.img} title={item.title} content={item.content}/>
            })
        }
        return data.map(item => {
            return <div key={item.title} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-8 ml-8 mr-8 p-25">
                <Card img={item.img} title={item.title} tags={item.tags} content={item.content}/>
            </div>
        })
    };

    render(){
        return (
            <div className={`flex flex-wrap justify-center ${this.props.widthSizeClass ? this.props.widthSizeClass : null}`}>
                {this.createCards(this.props.data)}
            </div>
        );
    }
}

FlexCardList.propTypes = {
  isHorizontal: PropTypes.bool,
    widthSizeClass: PropTypes.string,
};

FlexCardList.defaultProps = {
  isHorizontal: true
};

export default FlexCardList;