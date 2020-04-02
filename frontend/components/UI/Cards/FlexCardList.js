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
                return <HorizontalCard key={item.title} {...item} />
            })
        }
        return data.map(item => {
            return <div key={item.title}
                        className={`w-full sm:${this.props.cardSMWidthClass} md:${this.props.cardMDWidthClass} lg:${this.props.cardLGWidthClass} xl:${this.props.cardXLWidthClass} mb-8 ml-8 mr-8 p-25`}>
                <Card {...item}/>
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
    data: PropTypes.array,
    isHorizontal: PropTypes.bool,
    widthSizeClass: PropTypes.string,
    cardSMWidthClass: PropTypes.string,
    cardMDWidthClass: PropTypes.string,
    cardLGWidthClass: PropTypes.string,
    cardXLWidthClass: PropTypes.string,
};

FlexCardList.defaultProps = {
    isHorizontal: true,
    cardSMWidthClass: 'w-1/2',
    cardMDWidthClass: 'w-1/3',
    cardLGWidthClass: 'w-1/4',
    cardXLWidthClass: 'w-1/6',
};

export default FlexCardList;