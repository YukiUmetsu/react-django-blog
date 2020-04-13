import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";

const NumberDecreaseDisplay = (props) => {
    return (
        <span className="text-red-500">
            <FontAwesomeIcon icon={faArrowDown} />{props.content}
        </span>
    );
};

NumberDecreaseDisplay.propTypes = {
    content: PropTypes.string
};

export default NumberDecreaseDisplay