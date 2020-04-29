import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faYoutube} from "@fortawesome/free-brands-svg-icons/faYoutube";
import {faInstagram} from "@fortawesome/free-brands-svg-icons/faInstagram";
import {faFacebook} from "@fortawesome/free-brands-svg-icons/faFacebook";

const Footer = (props) => {
    return (
        <footer className="relative bg-gray-300 pt-8 pb-6">
            <div
                className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
                style={{ height: "80px", transform: "translateZ(0)" }}
            >
                <svg
                    className="absolute bottom-0 overflow-hidden"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    version="1.1"
                    viewBox="0 0 2560 100"
                    x="0"
                    y="0"
                >
                    <polygon
                        className="text-gray-300 fill-current"
                        points="2560 0 2560 100 0 100"
                    ></polygon>
                </svg>
            </div>
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                        <h4 className="text-3xl font-semibold">
                            Follow us on Social Media!
                        </h4>
                        <h5 className="text-lg mt-0 mb-2 text-gray-700">
                            We post useful Japanese vocabulary and grammar tips on social media.
                        </h5>
                        <div className="mt-6">
                            <button
                                className="bg-white text-red-800 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                                type="button"
                            >
                                <FontAwesomeIcon icon={faYoutube} size={"lg"}/>
                            </button>
                            <button
                                className="bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                                type="button"
                            >
                                <FontAwesomeIcon icon={faInstagram} size={"lg"}/>
                            </button>
                            <button
                                className="bg-white text-gray-900 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                                type="button"
                            >
                                <FontAwesomeIcon icon={faFacebook} size={"lg"}/>
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                        <div className="flex flex-wrap items-top mb-6">
                            <div className="w-full lg:w-4/12 px-4 ml-auto">
                  <span className="block uppercase text-gray-600 text-sm font-semibold mb-2">
                    Useful Links
                  </span>
                                <ul className="list-unstyled">
                                    <li>
                                        <a className="text-gray-700 hover:text-gray-900 font-semibold block pb-2 text-sm"
                                           href="https://www.creative-tim.com/presentation">About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a className="text-gray-700 hover:text-gray-900 font-semibold block pb-2 text-sm"
                                           href="https://www.youtube.com/jplaunch">Youtube
                                        </a>
                                    </li>
                                    <li>
                                        <a className="text-gray-700 hover:text-gray-900 font-semibold block pb-2 text-sm"
                                           href="https://www.instagram.com/jplaunch/">Instagram
                                        </a>
                                    </li>

                                </ul>
                            </div>
                            <div className="w-full lg:w-4/12 px-4">
                  <span className="block uppercase text-gray-600 text-sm font-semibold mb-2">
                    Other Resources
                  </span>
                                <ul className="list-unstyled">
                                    <li>
                                        <a className="text-gray-700 hover:text-gray-900 font-semibold block pb-2 text-sm"
                                           href="https://creative-tim.com/terms">Terms & Conditions
                                        </a>
                                    </li>
                                    <li>
                                        <a className="text-gray-700 hover:text-gray-900 font-semibold block pb-2 text-sm"
                                           href="https://creative-tim.com/privacy">Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a className="text-gray-700 hover:text-gray-900 font-semibold block pb-2 text-sm"
                                           href="https://creative-tim.com/contact-us">Contact Us
                                        </a>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-400" />
                <div className="flex flex-wrap items-center md:justify-between justify-center">
                    <div className="w-full md:w-4/12 px-4 mx-auto text-center">
                        <div className="text-sm text-gray-600 font-semibold py-1">
                            Copyright © {new Date().getFullYear()}{" "} Jplaunch{" "}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer