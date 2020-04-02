import React, { useState, useEffect } from 'react';
import Aux from "../../../hoc/Aux/Aux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types"
import OutsideComponentAlerter from "../../../hoc/Aux/OutsideComponentAlerter";

const Dropdown = (props) => {

    const [openDropdown, setOpenDropdown] = useState(false);

    let createItems = () => {
       return props.items.map(item => {
           return (
               <li className="w-full" key={item}>
                   <a
                       className={`rounded-t ${props.liBgColorClass} hover:${props.liBgHoverColorClass} py-2 px-4 block whitespace-no-wrap`}
                       href="#">
                       {item}
                   </a>
               </li>
           );
       });
    };

    return (
        <OutsideComponentAlerter callback={() => setOpenDropdown(false)}>
            <div className="px-4 pb-10 mb-3 mt-3" onMouseLeave={() => setOpenDropdown(!openDropdown)}>
                <div className="dropdown inline-block relative">
                    <button
                        onMouseEnter={() => setOpenDropdown(!openDropdown)}
                        className={`${props.bgColorClass} ${props.textColorClass} font-semibold py-2 px-10 rounded inline-flex items-center`}>
                        <span className="mr-2 p-x2 whitespace-no-wrap"> {props.name} </span>
                        <FontAwesomeIcon className="float-right" icon={faAngleDown} />
                    </button>
                    <ul className={`${openDropdown ? '': 'hidden'} dropdown-menu absolute ${props.ulTextColorClass} pt-1 w-full z-500`} >
                        {createItems()}
                    </ul>
                </div>
            </div>
        </OutsideComponentAlerter>
    );
};

Dropdown.propTypes = {
    name: PropTypes.string,
    items: PropTypes.array,
    bgColorClass: PropTypes.string,
    textColorClass: PropTypes.string,
    ulTextColorClass: PropTypes.string,
    liTextColorClass: PropTypes.string,
    liBgColorClass: PropTypes.string,
    liBgHoverColorClass: PropTypes.string,
};

Dropdown.defaultProps = {
    bgColorClass: 'bg-gray-300',
    textColorClass: 'text-gray-700',
    ulTextColorClass: 'text-gray-700',
    liBgColorClass: 'bg-gray-200',
    liBgHoverColorClass: 'bg-gray-400',
};

export default Dropdown