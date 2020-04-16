import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEdit, faEye, faTrash} from "@fortawesome/free-solid-svg-icons";
import Aux from "../../../../hoc/Aux/Aux";
import PropTypes from 'prop-types';
import styles from "./ItemActions.module.css";

const ItemActions = (props) => {

    let [showDetailTooltip, setShowDetailTooltip] = useState(false);
    let [showEditTooltip, setShowEditTooltip] = useState(false);
    let [showDeleteTooltip, setShowDeleteTooltip] = useState(false);

    // show modals
    let [showEditModal, setShowEditModal] = useState(false);

    let editClickedHandler = () => {
        setShowEditModal(!showEditModal);
        props.onEditClicked();
    };

    return (
        <Aux>
            {props.showViewButton ? (
                <a className="bg-teal-700 cursor-pointer rounded p-1 mx-1 my-1 text-white relative"
                   onClick={() => props.onViewClicked()}
                   onMouseEnter={() => setShowDetailTooltip(true)}
                   onMouseLeave={() => setShowDetailTooltip(false)}
                >
                    <FontAwesomeIcon icon={faEye}/>
                    <span className={`${showDetailTooltip ? "" : "invisible"} ${styles['tooltip-text']} ${styles['tooltip-top']}`}>Detail</span>
                </a>) : ""}

            <a
                className="bg-teal-700 cursor-pointer rounded p-1 mx-1 text-white relative"
                onClick={() => editClickedHandler()}
                onMouseEnter={() => setShowEditTooltip(true)}
                onMouseLeave={() => setShowEditTooltip(false)}
            >
                <FontAwesomeIcon icon={faEdit}/>
                <span className={`${showEditTooltip ? "" : "invisible"} ${styles['tooltip-text']} ${styles['tooltip-top']}`}>Edit</span>
            </a>

            <a
                className="bg-red-700 cursor-pointer rounded p-1 mx-1 text-white relative"
                onClick={() => props.onDeleteClicked()}
                onMouseEnter={() => setShowDeleteTooltip(true)}
                onMouseLeave={() => setShowDeleteTooltip(false)}
            >
                <FontAwesomeIcon icon={faTrash}/>
                <span className={`${showDeleteTooltip ? "" : "invisible"} ${styles['tooltip-text']} ${styles['tooltip-top']}`}>Delete</span>
            </a>
        </Aux>

    );
};
ItemActions.defaultProps = {
    showViewButton: false,
    onViewClicked: () => {},
    onEditClicked: () => {},
    onDeleteClicked: () => {},
};

ItemActions.propTypes = {
    object: PropTypes.object,
    showViewButton: PropTypes.bool,
    onViewClicked: PropTypes.func,
    onEditClicked: PropTypes.func,
    onDeleteClicked: PropTypes.func,
};

export default ItemActions