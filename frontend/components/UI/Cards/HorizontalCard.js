import React from 'react';
import Aux from "../../../hoc/Aux/Aux";

const HorizontalCard = (props) => {
    return (
        <Aux>
            <div className="w-full lg:w-1/2 xl:w-1/2 lg:py-12 lg:flex lg:justify-center">
                <div className="bg-white lg:mx-8 lg:flex lg:max-w-full lg:shadow-lg lg:rounded-lg">
                    <div className="lg:w-1/2">
                        <div className="h-64 bg-cover lg:rounded-lg lg:h-full"
                             style={{ backgroundImage: "url('" + props.img + "')"}}> </div>
                    </div>
                    <div className="py-12 px-6 max-w-xl lg:max-w-5xl lg:w-1/2">
                        <h2 className="text-3xl text-gray-800 font-bold">{props.title}</h2>
                        <p className="mt-4 text-gray-600">{props.content}</p>
                        <div className="mt-8 relative">
                            <a href="#" className="bg-gray-900 text-gray-100 px-5 py-3 font-semibold rounded">Read More</a>
                            <p className="absolute right-0 bottom-0 text-gray-500">{props.published_at}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
};

export default HorizontalCard