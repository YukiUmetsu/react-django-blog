import React, { Component } from "react";
import PropTypes from "prop-types"
import Aux from "../../../hoc/Aux/Aux";

class ImageSliderItem extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }


    render(){
        return (
            <Aux>
                <div className="bg-fixed absolute top-0 w-full h-full bg-center bg-cover"
                     style={{
                         backgroundImage: "url('" + this.props.image + "')"
                     }}>
                    <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
                </div>
                <div className="container relative mx-auto">
                    <div className="items-center flex flex-wrap">
                        <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
                            <div className="pr-12">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}

ImageSliderItem.propTypes = {
    image: PropTypes.string,
};

export default ImageSliderItem;