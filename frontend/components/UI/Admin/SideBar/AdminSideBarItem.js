import React, {useState} from 'react';
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {isEmpty} from "../../../../lib/utils";
import AdminSideBarSubItem from "./AdminSideBarSubItem";
import OutsideComponentAlerter from "../../../../hoc/Aux/OutsideComponentAlerter";
import Aux from "../../../../hoc/Aux/Aux";
import PropTypes from 'prop-types';
import {faAngleDown} from "@fortawesome/free-solid-svg-icons/faAngleDown";
import {faAngleRight} from "@fortawesome/free-solid-svg-icons/faAngleRight";

const AdminSideBarItem = React.memo((props) => {

    let [ isSubBarItemOpen, setIsSubBarItemOpen ] = useState(false);

    let renderSubBarItems = (subItems) => {
        if(isEmpty(subItems)){
            return "";
        }
        if(!isSubBarItemOpen){
            return "";
        }
        let items = subItems.map((item) => {
            return (<AdminSideBarSubItem key={item.title} {...item}/>);
        });
        return (
            <ul className="list-reset">
                {items}
            </ul>
        );
    };

    let onClickHandler = () => {
        if(isEmpty(props.link)){
            setIsSubBarItemOpen(!isSubBarItemOpen);
        }
    };

    let renderContent = (item) => {
        let arrowIcon = isSubBarItemOpen ? faAngleDown : faAngleRight;
        if(isEmpty(item.link)){
            return (
                <Aux>
                    <a className="font-sans font-hairline hover:font-normal text-sm text-nav-item no-underline">
                        <FontAwesomeIcon icon={item.icon} className="float-left mx-3 my-1 text-gray-600"/>
                        {item.title}
                        <span><FontAwesomeIcon icon={arrowIcon} className="float-right my-1 text-gray-600"/></span>
                    </a>
                    {renderSubBarItems(item.subItems)}
                </Aux>
            );
        }
        return (
            <Link href={item.link}>
                <a className="font-sans font-hairline hover:font-normal text-sm text-nav-item no-underline">
                    <FontAwesomeIcon icon={item.icon} className="float-left mx-3 my-1 text-gray-600"/>
                    {item.title}
                    <span><FontAwesomeIcon icon={arrowIcon} className="float-right my-1 text-gray-600"/></span>
                    {renderSubBarItems(item.subItems)}
                </a>
            </Link>
        );

    };

    return (
        <OutsideComponentAlerter callback={() => setIsSubBarItemOpen(false)}>
            <li className={`w-full h-full py-3 px-2 border-b border-light-border ${props.isActive? "bg-white": ""}`} onClick={() => onClickHandler()}>
                {renderContent({...props})}
            </li>
        </OutsideComponentAlerter>
    );
});

AdminSideBarItem.propTypes = {
    link: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.object,
    isActive: PropTypes.bool,
    subItems: PropTypes.array,
};

export default AdminSideBarItem