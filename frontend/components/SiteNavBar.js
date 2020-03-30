import React from 'react';
import Link from 'next/link'

const SiteNavBar = (props) => {

    return (
        <nav className = "bg-gray-300 p-2 mt-0 fixed w-full z-10 top-0" >
            <div className = "container mx-auto flex flex-wrap items-center" >
                <div className = "flex w-full md:w-1/2 justify-center md:justify-start text-white font-extrabold" >
                    <a className = "text-white no-underline hover:text-white hover:no-underline"href = "#" >
                        <img src="/images/jplaunch-logo-512-512.png" className="h-12 w-12" alt="Jplaunch Logo"/>
                    </a>
                </div>
                <div className="flex w-full pt-2 content-center justify-between md:w-1/2 md:justify-end">
                    <ul className="list-reset flex justify-between flex-1 md:flex-none items-center">
                        <li className="mr-3">
                            <Link href="#">
                                <a className="inline-block py-2 px-4 text-white no-underline">Active</a>
                            </Link>
                        </li>
                        <li className="mr-3">
                            <Link href="#">
                                <a className="inline-block text-gray-600 no-underline hover:text-gray-200 hover:text-underline py-2 px-4" >link</a>
                            </Link>
                        </li>
                        <li className="mr-3">
                            <Link href="#">
                                <a className="inline-block text-gray-600 no-underline hover:text-gray-200 hover:text-underline py-2 px-4" >link</a>
                            </Link>
                        </li>
                        <li className="mr-3">
                            <Link href="#">
                                <a className="inline-block text-gray-600 no-underline hover:text-gray-200 hover:text-underline py-2 px-4" >Login</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default SiteNavBar