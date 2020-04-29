import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';
import {faArrowUp} from "@fortawesome/free-solid-svg-icons/faArrowUp";

const NumberIncreaseDisplay = (props) => {
    return (
        <span className="text-green-500">
            <FontAwesomeIcon icon={faArrowUp} />{props.content}
        </span>
    );
};

NumberIncreaseDisplay.propTypes = {
    content: PropTypes.string
};

export default NumberIncreaseDisplay