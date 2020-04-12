import React, { useState } from 'react';
import './FlashCard.module.css';
import FlashCardFront from "./FlashCardFront";
import FlashCardContentTemplate from "./FlashCardContentTemplate";
import FlashCardBack from "./FlashCardBack";
import PropTypes from 'prop-types';

const FlashCard = (props) => {
    let [ isFrontActive, setIsFrontActive ] = useState(true);

    return (
        <div className="text-center relative flex">
            <FlashCardFront isActive={isFrontActive} onClickFunc={() => setIsFrontActive(!isFrontActive)} >
                <FlashCardContentTemplate {...props.data.front} />
            </FlashCardFront>
            <FlashCardBack isActive={!isFrontActive} onClickFunc={() => setIsFrontActive(!isFrontActive)} >
                <FlashCardContentTemplate {...props.data.back} />
            </FlashCardBack>
        </div>
    );
};

FlashCard.propTypes = {
    data: PropTypes.object
};

export default FlashCard