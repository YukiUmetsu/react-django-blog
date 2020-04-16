import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form'
import CSRFTokenInput from "./CSRFTokenInput";
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import Toggle from "./Toggle";
import * as yup from "yup";

const Form = (props) => {

    let setInitialFormDataState = () => {
        let initialState = {};
        for (let i = 0; i < props.formData.elements.length; i++) {
            let element = props.formData.elements[i];
            let givenValue = props.object[element.accessor];
            if(givenValue === undefined || givenValue === null){
                continue;
            }
            initialState[element.accessor] = givenValue;
        }
        return initialState;
    };

    let [formDataState, setFormDataState] = useState(setInitialFormDataState());
    const formConfig = {
        reValidateMode: 'onChange',
        submitFocusError: true,
        validationSchema: yup.object().shape(props.formData.validationSchema),
    };
    const { register, handleSubmit, reset, errors, triggerValidation } = useForm(formConfig);

    useEffect(() => {
        setFormDataState(setInitialFormDataState());
    },[props.object]);

    useEffect(() => {
        if(props.resetForm){
            reset();
        }
    }, [props.resetForm]);

    let updateFormDataState = (accessor, value) => {
        let updatedElement = {};
        updatedElement[accessor] = value;
        setFormDataState({...formDataState, ...updatedElement});
    };

    let triggerAllValidation = async () => {
        for (let i = 0; i < props.formData.elements.length; i++) {
            let element = props.formData.elements[i];
            if(!element.editable){
                continue;
            }
            await triggerValidation(element.accessor);
        }
    };

    const onSubmit = async data => {
        console.log(data);
        props.onSubmitCallback();
        // TODO connect to the server
    };

    const renderFormElements = () => {
        return props.formData.elements.map(element => {
            if (!element.editable) {
                return;
            }
            let error = (errors[element.accessor]) ? errors[element.accessor] : null;
            if (element.type === 'text') {
                return renderTextInput(element.accessor, element.label, props.object[element.accessor], element.formLength, error)
            }
            if (element.type === 'boolean') {
                return renderToggle(element.accessor, element.label, props.object[element.accessor], element.formLength, error)
            }
            if (element.type === 'select') {
                return renderSelectOptions(element.accessor, element.label, props.object[element.accessor], element.options, element.formLength, error)
            }
        }).filter(x => x !== undefined);
    };

    const renderTextInput = (id, label, value, length, error=null) => {
        let inputValue = (formDataState[id]) ? formDataState[id] : "";
        return (
            <div key={id} className={`w-full md:w-${length} px-3 mb-6 md:mb-0`}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={id}>
                    {label}
                </label>
                <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id={`form_${id}`}
                    name={id}
                    type="text"
                    value={inputValue}
                    ref={register}
                    placeholder={label}
                    onChange={(e)=> updateFormDataState(id, e.target.value)}
                />
                {error? <p className="text-red-500 text-xs italic">{error.message}</p> : ""}
            </div>
        );
    };

    const renderToggle = (id, label, value, length, error=null) => {
        let isON = (formDataState[id]=== null|| formDataState[id]===undefined) ? false: formDataState[id];

        return (
                <Toggle
                    key={`form_${id}`}
                    inputId={`form_${id}`}
                    isON={isON}
                    onDisplay={'is '+label}
                    offDisplay={'not '+label}
                    onChangeCallback={(newValue, inputId) => updateFormDataState(inputId, newValue)}
                    outerDivClassNames={`flex items-center justify-center w-full md:w-${length} mb-2`}
                    reference={register}
                />);
    };

    const renderSelectOptions = (id, label, value, options=[], length, error=null) => {

        let renderOptions = (options) => {
            return options.map(option => {
                return (<option>{option}</option>);
            });
        };

        return (
            <div className={`w-full md:w-${length} px-3 mb-6 md:mb-0`}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                       htmlFor={id}>
                    {label}
                </label>
                <div className="relative">
                    <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id={id}>
                        {renderOptions(options)}
                        ref={register}
                        onChange={(e)=> updateFormDataState(id, e.target.value)}
                    </select>
                    <div
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <FontAwesomeIcon icon={faAngleDown}/>
                    </div>
                </div>
                {error? <p className="text-red-500 text-xs italic">{error.message}</p> : ""}
            </div>
        );
    };

    return (
        <form className="w-full max-w-lg mx-5 my-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap -mx-3 mb-6">
                {renderFormElements()}
            </div>
            <CSRFTokenInput/>
            <button type="submit" className="w-full text-center py-3 rounded bg-green-600 text-white hover:bg-green-900 focus:outline-none my-1">
                Submit
            </button>
        </form>
    );
};

Form.propTypes = {
    object: PropTypes.object,
    formData: PropTypes.object,
    resetForm: PropTypes.bool,
    onSubmitCallback: PropTypes.func,
    onSubmitSuccessCallback: PropTypes.func,
    onSubmitFailCallback: PropTypes.func,
};

export default Form