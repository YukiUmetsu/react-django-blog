import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEdit, faEye} from "@fortawesome/free-solid-svg-icons";
import Aux from "../../../hoc/Aux/Aux";
import PropTypes from 'prop-types';

const ItemActions = (props) => {
    return (
        <Aux>
            <a className="bg-teal-300 cursor-pointer rounded p-1 mx-1 text-white" onClick={() => props.onViewClicked()}>
                <FontAwesomeIcon icon={faEye} />
            </a>
            <a className="bg-teal-300 cursor-pointer rounded p-1 mx-1 text-white" onClick={() => props.onEditClicked()}>
                <FontAwesomeIcon icon={faEdit} />
            </a>
            <a className="bg-teal-300 cursor-pointer rounded p-1 mx-1 text-red-500" onClick={() => props.onDeleteClicked()}>
                <FontAwesomeIcon icon={faEdit} />
            </a>
        </Aux>

    );
};

ItemActions.propTypes = {
    onViewClicked: PropTypes.func,
    onEditClicked: PropTypes.func,
    onDeleteClicked: PropTypes.func,
};

export default ItemActions