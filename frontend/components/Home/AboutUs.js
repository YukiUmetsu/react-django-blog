import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChess, faNewspaper, faUserFriends} from "@fortawesome/free-solid-svg-icons";
import {faYoutube} from "@fortawesome/free-brands-svg-icons";

const AboutUs = (props) => {
    return (
        <section className="pb-20 bg-gray-300 -mt-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap">
                    <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                            <div className="px-4 py-5 flex-auto">
                                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                                    <FontAwesomeIcon icon={faNewspaper} size={"lg"} />
                                </div>
                                <h6 className="text-xl font-semibold">Grammar Articles</h6>
                                <p className="mt-2 mb-4 text-gray-600">
                                    You can learn Japanese grammar with fun example sentences!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-4/12 px-4 text-center">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                            <div className="px-4 py-5 flex-auto">
                                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                                    <FontAwesomeIcon icon={faYoutube} size={"lg"} />
                                </div>
                                <h6 className="text-xl font-semibold">
                                    Tons of Youtube Videos!
                                </h6>
                                <p className="mt-2 mb-4 text-gray-600">
                                    More than 100 Youtube videos to prepare for JLPT.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                            <div className="px-4 py-5 flex-auto">
                                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                                    <FontAwesomeIcon icon={faChess} size={"lg"} />
                                </div>
                                <h6 className="text-xl font-semibold">
                                    Fun Quizzes!
                                </h6>
                                <p className="mt-2 mb-4 text-gray-600">
                                    You can review your Japanese Vocabulary and Grammar knowledge with fun quizzes!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex flex-wrap items-center mt-32">
                    <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                        <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-gray-100">
                            <i className="fas fa-user-friends text-xl"></i>
                            <FontAwesomeIcon icon={faUserFriends} size={"lg"} />
                        </div>
                        <h3 className="text-3xl mb-2 font-semibold leading-normal">
                            Learning Japanese should be easier and more fun!
                        </h3>
                        <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl.
                            Mauris quis erat vitae tellus venenatis lobortis.
                        </p>
                        <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-gray-700">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl.
                            Mauris quis erat vitae tellus venenatis lobortis.
                        </p>
                        <a
                            href="https://www.youtube.com/jplaunch"
                            className="font-bold text-gray-800 mt-8"
                        >
                            Check out our Youtube videos!
                        </a>
                    </div>

                    <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-pink-600">
                            <img
                                alt="..."
                                src="/images/home/backpack-flower.jpg"
                                className="w-full align-middle rounded-t-lg"
                            />
                            <blockquote className="relative p-8 mb-4">
                                <svg
                                    preserveAspectRatio="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 583 95"
                                    className="absolute left-0 w-full block"
                                    style={{
                                        height: "95px",
                                        top: "-94px"
                                    }}
                                >
                                    <polygon
                                        points="-30,95 583,95 583,65"
                                        className="text-pink-600 fill-current"
                                    ></polygon>
                                </svg>
                                <h4 className="text-xl font-bold text-white">
                                    Check out our Youtube videos!
                                </h4>
                                <p className="text-md font-light mt-2 text-white">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Vivamus nec finibus nisl. Mauris quis erat vitae tellus
                                    venenatis lobortis.
                                </p>
                            </blockquote>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutUs