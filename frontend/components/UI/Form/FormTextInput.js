import React from 'react';
import PropTypes from 'prop-types';
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const FormTextInput = React.memo((props) => {

    let renderHiddenInput = () => {
        return (
            <input
                readOnly
                className={props.inputClass}
                id={`${props.form_id_prefix}_form_${props.id}`}
                name={props.id}
                key={props.id}
                type={props.type}
                value={props.inputValue}
                ref={props.ref}
                placeholder={props.label}
            />
        );
    };

    let renderInput = () => {
        return (
            <div key={props.id} className={`w-full md:w-${props.length} px-3 mb-6 md:mb-0`}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={props.id}>
                    {props.label}
                </label>
                <input
                    className={props.inputClass}
                    id={`${props.form_id_prefix}_form_${props.id}`}
                    name={props.id}
                    type={props.type}
                    value={props.inputValue}
                    ref={props.reference}
                    placeholder={props.label}
                    onChange={(e)=> props.updateFormDataState(props.id, e.target.value)}
                />
                {props.error? <p className="text-red-500 text-xs italic">{props.error.message}</p> : ""}
                <div className="mt-2 mb-4">
                    {props.id === 'password' ? <PasswordStrengthMeter password={props.formDataState['password']}/> : ""}
                </div>
            </div>
        );
    };

    return (props.isHidden) ? renderHiddenInput() : renderInput();
});

FormTextInput.propTypes = {
    form_id_prefix: PropTypes.string,
    inputClass: PropTypes.string,
    id: PropTypes.string,
    inputValue: PropTypes.any,
    label: PropTypes.string,
    type: PropTypes.string,
    reference: PropTypes.any,
    isHidden: PropTypes.bool,
    length: PropTypes.string,
    error: PropTypes.any,
    updateFormDataState: PropTypes.func,
    formDataState: PropTypes.object,
};

export default FormTextInput