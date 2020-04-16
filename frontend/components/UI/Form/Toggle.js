import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './Toggle.module.css';

const Toggle = (props) => {

    let [isON, setIsON] = useState(false);

    useEffect(()=> {
        setIsON(props.isON);
    }, [props.isON]);

    let onChangeHandler = () => {
        setIsON(!isON);
        props.onChangeCallback(isON, props.inputId);
    };

    return (
        <div className={props.outerDivClassNames}>

            <label
                htmlFor={props.inputId}
                className="flex items-center cursor-pointer">

                <div className="relative">

                    <input id={props.inputId} name={props.inputId} type="checkbox" className="hidden" checked={isON} onChange={() => onChangeHandler()} ref={props.reference}/>

                    <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"> </div>

                    <div className={`${styles['toggle__dot']} absolute w-6 h-6 bg-white rounded-full shadow inset-y-1 left-0`}> </div>

                </div>

                <div className="ml-3 text-gray-700 font-medium">{isON ? props.onDisplay: props.offDisplay}</div>
            </label>

        </div>
    );
};

Toggle.defaultProps = {
    inputId: 'toggle',
    isON: false,
    offDisplay: 'Off',
    onDisplay: 'On',
    onChangeCallback: () => {},
    outerDivClassNames: "flex items-center justify-center w-full mb-24"
};

Toggle.propTypes = {
    inputId: PropTypes.string,
    isON: PropTypes.bool,
    offDisplay: PropTypes.string,
    onDisplay: PropTypes.string,
    onChangeCallback: PropTypes.func,
    outerDivClassNames: PropTypes.string,
    reference: PropTypes.any
};

export default Toggle