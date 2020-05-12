import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useForm} from 'react-hook-form'
import CSRFTokenInput from "./CSRFTokenInput";
import PropTypes from 'prop-types';
import Toggle from "./Toggle";
import {object as yupObj} from "yup";
import {isEmpty} from "../../../lib/utils";
import {API_BASE, DEFAULT_PERSON_PHOTO} from "../../../constants";
import PackmanSpinner from "../Spinner/PackmanSpinner";
import Alert from "../Notifications/Alert";
import dynamic from "next/dynamic";
const DynamicTextInput = dynamic(
    () => import('./FormTextInput'),
    { ssr: false }
);
const DynamicSelect = dynamic(
    () => import('./FormSelect'),
    { ssr: false }
);
const DynamicImageSelect = dynamic(
    () => import('./FormImageSelect'),
    { ssr: false }
);

const Form = (props) => {

    let initialFormDataState = useMemo(() => {
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
    }, [props.formData, props.object]);

    let [formDataState, setFormDataState] = useState(initialFormDataState);
    let [loading, setLoading] = useState(props.loading ? props.loading : false);
    let [formError, setFormError] = useState(props.formError);

    const formConfig = {
        reValidateMode: 'onChange',
        submitFocusError: true,
        validationSchema: yupObj().shape(props.formData.validationSchema),
    };
    const { register, handleSubmit, reset, errors } = useForm(formConfig);

    useEffect(() => {
        setFormDataState(initialFormDataState);
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
        return (
            <DynamicTextInput
                key={id}
                form_id_prefix={props.form_id_prefix}
                inputClass={inputClass}
                id={id}
                inputValue={inputValue}
                label={label}
                type={type}
                reference={register}
                isHidden={type === 'hidden'}
                length={length}
                error={error}
                updateFormDataState={updateFormDataState}
                formDataState={formDataState}
            />);
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
        return (
            <DynamicSelect
                key={id}
                id={id}
                label={label}
                value={value}
                options={options}
                length={length}
                error={error}
                form_id_prefix={props.form_id_prefix}
                updateFormDataState={updateFormDataState}
                reference={register}
            />);
    };

    let renderImageIcon = (id, label, value, multiple=false, accept="image/*", length, error = null) => {
        let source = DEFAULT_PERSON_PHOTO;
        if(!isEmpty(value) && typeof value.file === 'string'){
            source = API_BASE + value.file;
        }
        if(!isEmpty(value) && typeof value.desc === 'string' && value.desc !== ''){
            label = value.desc;
        }
        let displayId = `${props.form_id_prefix}_form_${id}`;

        return (
            <DynamicImageSelect
                key={displayId}
                id={id}
                displayId={displayId}
                label={label}
                multiple={multiple}
                accept={accept}
                length={length}
                error={error}
                imgSource={source}
                reference={register}
                updateFormDataState={updateFormDataState}
            />
        );
    };

    return (
        <form
            id={props.form_element_id}
            className={`w-full max-w-lg mx-${props.mx} my-${props.my} px-${props.px} py-${props.py}`}
            onSubmit={handleSubmit(onSubmit)}>
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

Form.defaultProps = {
    form_element_id: 'form',
    mx: '5',
    my: '5',
    px: '0',
    py: '0',
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
    form_element_id: PropTypes.string,
    mx: PropTypes.string,
    my: PropTypes.string,
    px: PropTypes.string,
    py: PropTypes.string,
};

export default Form