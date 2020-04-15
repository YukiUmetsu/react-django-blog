import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Aux from "../../../hoc/Aux/Aux";

const YesNoPicker = (props) => {

    let [selectedValue, setSelectedValue] = useState("");

    let onValueChangedHandler = (e) => {
        let element = e.target;
        let newValue = element.options[element.selectedIndex].value;
        setSelectedValue(newValue);
        props.onValueChanged(newValue, ...props.onValueChangedArguments);
    };

    return (
        <select
            onChange={(e) => onValueChangedHandler(e)}
            className="block appearance-none border rounded w-full text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:shadow-outline"
            id={`${props.selectElementId}`}
            value={selectedValue}
        >
            <option value="">Yes/No</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
        </select>
    );
};

YesNoPicker.defaultProps = {
    onValueChangedArguments: [],
    onValueChanged: () => {},
    selectElementId: "yes-no-picker",
};

YesNoPicker.propTypes = {
    onValueChangedArguments: PropTypes.array,
    onValueChanged: PropTypes.func,
    selectElementId: PropTypes.string,
};

export default YesNoPicker