import React, { Component } from "react";
import PropTypes from "prop-types"
import "./ImageSlider.module.css"
import Aux from "../../../hoc/Aux/Aux";

class ImageSliderManager extends Component {

    constructor(props){
        super(props);
        this.state = {
            slideIndex: 0,
            maxIndex: this.props.children.length-1,
            timer: null
        };
    }

    componentDidMount() {
        this.timer = setTimeout( () => {
            this.changeSlides(1)
        }, 5000)
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer)
    }

    changeSlides = (n) => {
        let isLessThanMax = this.state.slideIndex + n <= this.state.maxIndex;
        let isBiggerThanZero = this.state.slideIndex + n > 0;

        if(isLessThanMax && isBiggerThanZero) {
            this.setState({slideIndex: this.state.slideIndex + n});
        } else if(isBiggerThanZero){
            // bigger than max
            this.setState({slideIndex: 0});
        } else {
            // less than 0
            this.setState({slideIndex: this.state.maxIndex});
        }
        clearTimeout(this.state.timer)
        this.state.timer = setTimeout( () => {
            this.changeSlides(1)
        }, 5000)
    };

    render(){
        return (
            <Aux>
                <div className="relative pt-16 pb-8 flex content-center items-center justify-center"
                     style={{
                         minHeight: this.props.minHeight
                     }}>
                    {this.props.children[this.state.slideIndex]}
                    <button
                        className="prev absolute inset-y-auto left-0 bg-gray-700 text-white p-2"
                        onClick={() => this.changeSlides(-1)}>
                        &#10094;
                    </button>
                    <button
                        className="next absolute inset-y-auto right-0 bg-gray-700 text-white p-2"
                        onClick={() => this.changeSlides(1)}>
                        &#10095;
                    </button>
                </div>
            </Aux>
        );
    }
}

ImageSliderManager.propTypes = {
    minHeight: PropTypes.string,
};

ImageSliderManager.defaultProps = {
    minHeight: "75vh"
};

export default ImageSliderManager;