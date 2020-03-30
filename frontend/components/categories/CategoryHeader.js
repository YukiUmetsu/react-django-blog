import React from 'react';

const CategoryHeader = (props) => {
    return (
        <div className="relative pt-16 pb-8 flex content-center items-center justify-center"
             style={{
                 minHeight: "40vh"
             }}>
            <div className="bg-fixed absolute top-0 w-full h-full bg-center bg-cover"
                 style={{
                     backgroundImage: "url('/images/header/osakajo.jpg')"
                 }}>
                <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
            </div>
            <div className="container relative mx-auto">
                <div className="items-center flex flex-wrap">
                    <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
                        <div className="pr-12">
                            <h1 className="text-white font-semibold text-5xl">
                                Category: <b className="text-red-600">JLPT</b>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryHeader