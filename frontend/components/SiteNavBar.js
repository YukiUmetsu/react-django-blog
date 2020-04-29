import React, { useState } from 'react';
import Link from 'next/link'
import OutsideComponentAlerter from "../hoc/Aux/OutsideComponentAlerter";
import {faPaperPlane} from "@fortawesome/free-regular-svg-icons/faPaperPlane";
import {faSearch} from "@fortawesome/free-solid-svg-icons/faSearch";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SiteNavBar = (props) => {

    const [showSearchBar, setShowSearchBar] = useState(false);

    let renderSearchBar = () => {
        if(!showSearchBar) {
            return null;
        }
        return (
            <div className="relative w-full bg-white shadow-xl" id="search-content">
                <div className="container mx-auto py-4 text-black px-10">
                    <input
                        id="searchfield"
                        type="search"
                        placeholder="Search..."
                        autoFocus="autofocus"
                        className="w-full text-grey-800 transition focus:outline-none focus:border-transparent p-2 appearance-none leading-normal text-xl lg:text-2xl"/>
                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            size={"lg"}
                            className="absolute top-40% float-right text-gray-500"
                        />
                </div>
            </div>
        );
    };


    return (
        <OutsideComponentAlerter callback={() => setShowSearchBar(false)}>
            <nav id="header" className="fixed w-full z-10">
                <div className="relative w-full fixed top-0 bg-gray-200 border-b border-grey-light">
                    <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-4">
                        <div className="pl-4 flex items-center">
                            <Link href="/">
                                <a className = "text-white no-underline hover:text-white hover:no-underline">
                                    <img src="/images/jplaunch-logo-512-512.png" className="h-12 w-12" alt="Jplaunch Logo"/>
                                </a>
                            </Link>
                            <div id="search-toggle" className="search-icon cursor-pointer pl-20" onClick={() => setShowSearchBar(!showSearchBar)}>
                                <FontAwesomeIcon icon={faSearch} size={"1x"} />
                            </div>
                        </div>

                        <div className="pr-4">
                            <button id="nav-toggle" className="block lg:hidden flex items-center px-3 py-2 border rounded text-grey border-grey-dark hover:text-black hover:border-purple appearance-none focus:outline-none">
                                <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path></svg>
                            </button>
                        </div>

                        <div className="w-full flex-grow lg:flex lg:flex-1 lg:content-center lg:justify-end lg:w-auto hidden lg:block mt-2 lg:mt-0 z-20" id="nav-content">

                            <ul className="list-reset lg:flex justify-end items-center">
                                <li className="mr-3 py-2 lg:py-0">
                                    <a className="inline-block py-2 px-4 text-black font-bold no-underline" href="#">Active</a>
                                </li>
                                <li className="mr-3 py-2 lg:py-0">
                                    <a className="inline-block text-grey-dark no-underline hover:text-black hover:underline py-2 px-4" href="#">link</a>
                                </li>
                                <li className="mr-3 py-2 lg:py-0">
                                    <a className="inline-block text-grey-dark no-underline hover:text-black hover:underline py-2 px-4" href="#">link</a>
                                </li>
                            </ul>

                        </div>

                    </div>
                </div>

                {renderSearchBar()}
            </nav>
        </OutsideComponentAlerter>
    );
};

export default SiteNavBar