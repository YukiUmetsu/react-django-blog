import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

const InputSearchItem = (props) => {

    let [inputValue, setInputValue] = useState("");

    // make sure that this function is created just once with useRef
    // wait for 0.5 seconds and execute only once.
    let onChangeDebounced = useRef(debounce((newValue) => {
        props.onChangedCallback(newValue, ...props.onChangedCallbackArguments)
    }, 500));


    let inputValueChangedHandler = (e) => {
        let newValue = e.target.value;
        setInputValue(newValue);
        onChangeDebounced.current(newValue);
    };

    return (
        <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id={props.elementId}
            type="text"
            onChange={(e)=>inputValueChangedHandler(e)}
            value={inputValue}
            placeholder={props.placeholder}
        />
    );
};

InputSearchItem.defaultProps = {
    elementId: "",
    placeholder: "type to search",
    onChangedCallback: () => {},
    onChangedCallbackArguments: [],
};

InputSearchItem.propTypes = {
    elementId: PropTypes.string,
    placeholder: PropTypes.string,
    onChangedCallback: PropTypes.func,
    onChangedCallbackArguments: PropTypes.array,
};

export default InputSearchItem