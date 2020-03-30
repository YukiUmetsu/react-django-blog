import React from 'react';

const headerImg = [
    "odaiba.jpg",
    "fuji.jpg",
    "osakajo.jpg",
    "shibuya.jpg"
];

const MainHeader = (props) => {
    return (
        <div className="relative pt-16 pb-32 flex content-center items-center justify-center"
             style={{
                 minHeight: "75vh"
             }}>
            <div className="bg-fixed absolute top-0 w-full h-full bg-center bg-cover"
                 style={{
                     backgroundImage: "url('/images/header/odaiba.jpg')"
                 }}>
                <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
            </div>
            <div className="container relative mx-auto">
                <div className="items-center flex flex-wrap">
                    <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
                        <div className="pr-12">
                            <h1 className="text-white font-semibold text-5xl">
                                Pick up Japanese with <b className="text-red-600">Jp</b>launch.
                            </h1>
                            <p className="mt-4 text-lg text-gray-300">
                                This is a simple example of a Landing Page you can build
                                using Tailwind Starter Kit. It features multiple CSS
                                components based on the Tailwindcss design system.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MainHeader