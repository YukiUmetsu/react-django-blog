import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types';
import {faAngleDown} from "@fortawesome/free-solid-svg-icons/faAngleDown";

const FormSelect = React.memo((props) => {

    const selectClassName = "block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500";

    const renderOptions = (options) => {
        return options.map((option, index) => {
            return (<option key={index}>{option}</option>);
        });
    };

    return (
        <div className={`w-full md:w-${props.length} px-3 mb-6 md:mb-0`} key={`${props.form_id_prefix}_form_div_${props.id}`}>

            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor={props.id}>
                {props.label}
            </label>

            <div className="relative">
                <select
                    className={selectClassName}
                    id={`${props.form_id_prefix}_form_${props.id}`}
                    name={props.id}
                    ref={props.reference}
                    onChange={(e)=> props.updateFormDataState(props.id, e.target.value)}
                >
                    {renderOptions(props.options)}
                </select>

                <div
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FontAwesomeIcon icon={faAngleDown}/>
                </div>
            </div>

            {props.error? <p className="text-red-500 text-xs italic">{props.error.message}</p> : ""}
        </div>
    );
});

FormSelect.propTypes = {
    form_id_prefix: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    reference: PropTypes.any,
    length: PropTypes.string,
    error: PropTypes.any,
    updateFormDataState: PropTypes.func,
};

export default FormSelect