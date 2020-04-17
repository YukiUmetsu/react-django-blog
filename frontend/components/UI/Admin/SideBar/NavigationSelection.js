import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {isEmpty} from "../../../../lib/utils";
import { useRouter } from 'next/router'
import {ADMIN_SIDE_BAR_ITEMS} from "../../../../constants";

const NavigationSelection = (props) => {

    const router = useRouter();

    let navigationForSmallDevicesChangeHandler = (e) => {
        let link = e.target.value;
        router.push(link);
    };

    let renderOptions = (items) => {
        return items.map(item => {
            if(isEmpty(item.subItems)){
                return (
                    <option key={item.title} value={item.link}>{item.title}</option>
                );
            }
            return item.subItems.map(subItem => {
                return (
                    <option key={subItem.title} value={subItem.link}>{subItem.title}</option>
                );
            });
        });
    };

    return (
        <div className="w-full h-30 xl:hidden lg:hidden md:hidden mx-auto mb-12">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="sub-menu">
                Navigate to ...
            </label>
            <div className="relative">
                <select
                    id="sub-menu"
                    name="sub-menu"
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    onChange={(e) => navigationForSmallDevicesChangeHandler(e)}
                    value={router.pathname}
                >
                    {renderOptions(ADMIN_SIDE_BAR_ITEMS)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FontAwesomeIcon icon={faAngleDown}/>
                </div>
            </div>
        </div>
    );
};

export default NavigationSelection