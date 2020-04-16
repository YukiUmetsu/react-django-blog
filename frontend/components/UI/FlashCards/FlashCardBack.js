import React, {useState, useEffect} from 'react';
import './FlashCard.module.css';
import PropTypes from 'prop-types';

const FlashCardBack = (props) => {
    let classesHide = ["h-full", "w-full", "absolute", "top-0", "transition", `duration-${props.animationTime}`, "ease-out", "transform", "origin-center", "opacity-0", "rotateY-180"];
    let classesShow = ["h-full", "w-full", "absolute", "top-0", "transition", `duration-${props.animationTime}`, "ease-out", "transform", "origin-center", "z-10"];
    let notActiveInitialClasses = ["w-full", "absolute", "top-0", "rotateY--180", "hidden", "z-0"];
    let initialClasses = props.isActive ? new Set() : new Set(notActiveInitialClasses);
    let [ classes , setClasses ] = useState(initialClasses);

    useEffect(() => {
        if(!props.isActive){
            // hide
            setClasses(new Set(classesHide));
        } else {
            // show
            setClasses(new Set(classesShow));
        }
    }, [props.isActive]);

    let onClickHandler = () => {
        if(props.isActive){
            // hide
            setClasses(new Set(classesHide));
        } else {
            // show
            setClasses(new Set(classesShow));
        }

        props.onClickFunc();
    };

    return (
        <div className={ [...classes].join(" ") } onClick={() => onClickHandler()}>
            {props.children}
        </div>
    );
};

FlashCardBack.defaultProps = {
    animationTime: 700
};

FlashCardBack.propTypes = {
    isActive: PropTypes.bool,
    onClickFunc: PropTypes.func,
    animationTime: PropTypes.number,
};
export default FlashCardBack