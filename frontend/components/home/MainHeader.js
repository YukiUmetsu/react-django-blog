import React from 'react';
import ImageSliderItem from "../UI/ImageSlider/ImageSliderItem";
import ImageSliderManager from "../UI/ImageSlider/ImageSliderManager";

const headerImg = [
    "odaiba.jpg",
    "fuji.jpg",
    "osakajo.jpg",
    "shibuya.jpg"
];

const MainHeader = (props) => {
    return (
        <ImageSliderManager>
            <ImageSliderItem image="/images/header/odaiba.jpg">
                <h1 className="text-white font-semibold text-5xl">
                    Pick up Japanese with <b className="text-red-600">Jp</b>launch.
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.
                </p>
            </ImageSliderItem>
            <ImageSliderItem image="/images/header/fuji.jpg">
                <h1 className="text-white font-semibold text-5xl">
                    Pick up Japanese with <b className="text-red-600">Jp</b>launch.
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.
                </p>
            </ImageSliderItem>
            <ImageSliderItem image="/images/header/shibuya.jpg">
                <h1 className="text-white font-semibold text-5xl">
                    Pick up Japanese with <b className="text-red-600">Jp</b>launch.
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.
                </p>
            </ImageSliderItem>
            <ImageSliderItem image="/images/header/osakajo.jpg">
                <h1 className="text-white font-semibold text-5xl">
                    Pick up Japanese with <b className="text-red-600">Jp</b>launch.
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.
                </p>
            </ImageSliderItem>
        </ImageSliderManager>
    );
};

export default MainHeader