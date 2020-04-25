import React, {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form'
import CSRFTokenInput from "./CSRFTokenInput";
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faCamera} from "@fortawesome/free-solid-svg-icons";
import Toggle from "./Toggle";
import * as yup from "yup";
import {isEmpty} from "../../../lib/utils";
import {IMG_HOST} from "../../../constants";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import PackmanSpinner from "../Spinner/PackmanSpinner";
import Alert from "../Notifications/Alert";

const Form = (props) => {

    let setInitialFormDataState = () => {
        let initialState = {};
        for (let i = 0; i < props.formData.elements.length; i++) {
            let element = props.formData.elements[i];
            let defaultEmptyValue = "";
            if(element.type === 'boolean'){
                defaultEmptyValue = false;
            }
            let givenValue = isEmpty(props.object) ? defaultEmptyValue : props.object[element.accessor];
            if(givenValue === undefined || givenValue === null){
                continue;
            }
            initialState[element.accessor] = givenValue;
        }
        return initialState;
    };

    let [formDataState, setFormDataState] = useState(setInitialFormDataState());
    let [showChangeImageCover, setShowChangeImageCover] = useState(false);
    let [loading, setLoading] = useState(props.loading ? props.loading : false);
    let [formError, setFormError] = useState(props.formError);
    let imageElementRef = useRef();

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

    useEffect( () => {
        setLoading(props.loading);
    }, [props.loading]);

    useEffect( () => {
        setFormError(props.formError);
    }, [props.formError]);

    useEffect(() => {
        if(props.dataManipulationComplete){
            setLoading(false);
        }
    }, [props.dataManipulationComplete]);

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
        setLoading(true);
        if(!isEmpty(props.object)){
            // this is editing form since object exist. remove unchanged values.
            let objKeys = Object.keys(props.object);
            for (let i = 0; i < objKeys.length; i++) {
                let objKey = objKeys[i];
                if(data[objKey] === props.object[objKey]){
                    delete data[objKey];
                }
            }
        }
        await props.onSubmitCallback(data);
    };

    const renderFormElements = () => {
        if(loading){
            return <PackmanSpinner/>
        }
        if(!isEmpty(formError)){
            return <Alert
                title="Something went wrong"
                content={formError.message}
                closeCallback={() => setFormError(false)} />
        }
        return props.formData.elements.map(element => {
            if (!element.editable) {
                return;
            }
            let initialValue = isEmpty(props.object) ? "" : props.object[element.accessor];
            let error = (errors[element.accessor]) ? errors[element.accessor] : null;
            if (['text', 'password', 'hidden'].includes(element.type)) {
                return renderTextInput(element.accessor, element.label, element.type, initialValue, element.formLength, error)
            }
            if (element.type === 'boolean') {
                if(isEmpty(props.object)){
                    initialValue = false;
                }
                return renderToggle(element.accessor, element.label, initialValue, element.formLength, error)
            }
            if (element.type === 'select') {
                return renderSelectOptions(element.accessor, element.label, initialValue, element.options, element.formLength, error)
            }
            if(element.type === "image"){
                return renderImageIcon(element.accessor, element.label, initialValue, element.multiple, element.accept, element.formLength, error)
            }
        }).filter(x => x !== undefined);
    };

    const renderTextInput = (id, label, type, value, length, error=null) => {
        let inputValue = (formDataState[id]) ? formDataState[id] : "";
        let inputClass = 'appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white';
        if(type === 'hidden'){
            inputClass='invisible';
            return (
                <input
                    readOnly
                    className={inputClass}
                    id={`${props.form_id_prefix}_form_${id}`}
                    name={id}
                    key={id}
                    type={type}
                    value={inputValue}
                    ref={register}
                    placeholder={label}
                />
            );
        }
        return (
            <div key={id} className={`w-full md:w-${length} px-3 mb-6 md:mb-0`}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={id}>
                    {label}
                </label>
                <input
                    className={inputClass}
                    id={`${props.form_id_prefix}_form_${id}`}
                    name={id}
                    type={type}
                    value={inputValue}
                    ref={register}
                    placeholder={label}
                    onChange={(e)=> updateFormDataState(id, e.target.value)}
                />
                {error? <p className="text-red-500 text-xs italic">{error.message}</p> : ""}
                <div className="mt-2 mb-4">
                    {id === 'password' ? <PasswordStrengthMeter password={formDataState['password']}/> : ""}
                </div>
            </div>
        );
    };

    const renderToggle = (id, label, value, length, error=null) => {
        let isON = (formDataState[id]=== null|| formDataState[id]===undefined) ? false: formDataState[id];
        if(typeof isON !== "boolean"){
            isON = false;
        }

        return (
                <Toggle
                    key={`${props.form_id_prefix}_form_${id}`}
                    displayInputId = {`${props.form_id_prefix}_form_${id}`}
                    inputId={id}
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

    let renderImageIcon = (id, label, value, multiple=false, accept="image/*", length, error = null) => {
        let source = isEmpty(value) ? `${IMG_HOST}media/uploads/2020/04/05/default-person.png` : value;
        let displayId = `${props.form_id_prefix}_form_${id}`;

        return (
            <div key={id} className={`rounded-lg p-6 w-${length}`}>
                <div
                    className="relative rounded-full h-20 w-20 md:w-24 md:h-24 rounded-full mx-auto bg-gray-400 overflow-hidden"
                    onMouseEnter={() => setShowChangeImageCover(true)}
                    onMouseLeave={() => setShowChangeImageCover(false)}
                >
                    <img
                        ref={imageElementRef}
                        className="bottom-0 h-20 w-20 md:w-24 md:h-24 rounded-full mx-auto"
                        src={source} alt={label}
                    />

                    <div
                        id="change-image-cover"
                        className={`${showChangeImageCover? "": "hidden"} absolute w-full bottom-0 bg-black text-white opacity-75 text-center pt-2`}>
                        <label htmlFor={displayId}>
                        <p className="text-xs">change image</p>
                        <FontAwesomeIcon icon={faCamera} className="text-white"/>

                        <input
                            id={displayId}
                            name={id}
                            type="file"
                            onChange={(e) => imageChangedHandler(id, e)}
                            className={`invisible h-full`}
                            ref={register}
                            multiple={multiple}
                            accept={accept}
                        />
                        </label>
                    </div>
                </div>
                {error? <p className="text-red-500 text-xs italic">{error.message}</p> : ""}
            </div>
        );
    };

    let imageChangedHandler = (accessor, e) => {
        const files = Array.from(e.target.files);
        if(isEmpty(files[0])){
            return;
        }
        let tempImageURL = URL.createObjectURL(files[0]);
        imageElementRef.current.src = tempImageURL;
        updateFormDataState(accessor, files[0]);
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
    form_id_prefix: PropTypes.string,
    onSubmitCallback: PropTypes.func,
    onSubmitSuccessCallback: PropTypes.func,
    onSubmitFailCallback: PropTypes.func,
    loading: PropTypes.bool,
    formError: PropTypes.object,
    dataManipulationComplete: PropTypes.bool,
};

export default Form