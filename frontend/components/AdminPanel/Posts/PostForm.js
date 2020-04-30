import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form'
import CSRFTokenInput from "../../UI/Form/CSRFTokenInput";
import PropTypes from 'prop-types';
import {object as yupObj} from "yup";
import {PostsDataCenterContext} from "./PostsDataCenter";
import {isEmpty} from "../../../lib/utils";
import PackmanSpinner from "../../UI/Spinner/PackmanSpinner";
import Alert from "../../UI/Notifications/Alert";
import Toggle from "../../UI/Form/Toggle";
import {API_BASE, DEFAULT_POST_MAIN_PHOTO, SANITIZE_HTML_OPTIONS} from "../../../constants";
import dynamic from "next/dynamic";
import parse, {domToReact} from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';
import Aux from "../../../hoc/Aux/Aux";
import Modal from "../../UI/Modal/Modal";
import useInterval from "../../../lib/useInterval";
import moment from "moment";

const DynamicTextInput = dynamic(
    () => import('../../UI/Form/FormTextInput'),
    { ssr: false }
);
const DynamicSelect = dynamic(
    () => import('../../UI/Form/FormSelect'),
    { ssr: false }
);
const DynamicImageSelect = dynamic(
    () => import('../../UI/Form/FormImageSelect'),
    { ssr: false }
);
const BlogEditor = dynamic(
    () => import('../../UI/BlogEditer/BlogEditor'),
    { ssr: false }
);

const HTML_PARSE_OPTIONS = {
    replace: ({attribs, name, children}) => {
        if(name === 'table'){
            return <table className="table-auto">{domToReact(children, HTML_PARSE_OPTIONS)}</table>
        }
        if(name === 'td'){
            return <td className="border px-6 py-4">{domToReact(children, HTML_PARSE_OPTIONS)}</td>
        }
        if(name === 'ol'){
            return <ol className="list-decimal">{domToReact(children, HTML_PARSE_OPTIONS)}</ol>
        }
        if(name === 'ul'){
            return <ul className="list-disc">{domToReact(children, HTML_PARSE_OPTIONS)}</ul>
        }
        if(name === 'blockquote'){
            return <blockquote className="flex flex-wrap flex-col bg-white text-indigo-700 border-l-8 italic border-gray-400 px-4 py-3">
                {domToReact(children, HTML_PARSE_OPTIONS)}
            </blockquote>
        }
        if(name === 'hr' && attribs.hasOwnProperty('class')){
            if(attribs.class === '__se__solid'){
                return <hr className="border-1 border-gray-600 border-solid"/>
            }
            if(attribs.class === '__se__dashed'){
                return <hr className="border-1 border-gray-600 border-dashed"/>
            }
            if(attribs.class === '__se__dotted'){
                return <hr className="border-1 border-gray-600 border-dotted"/>
            }
        }
        if(name==='p' && attribs.hasOwnProperty('class') && attribs.class==='__se__p-bordered'){
            return <p className="py-4 px-8 bg-white shadow-lg rounded-lg my-20 mt-2 text-gray-600">{domToReact(children, HTML_PARSE_OPTIONS)}</p>
        }
        if(name === 'h1'){
           return <h1 className="font-black text-4xl">{domToReact(children, HTML_PARSE_OPTIONS)}</h1>
        }
        if(name === 'h2'){
            return <h2 className="font-extrabold text-3xl">{domToReact(children, HTML_PARSE_OPTIONS)}</h2>
        }
        if(name === 'h3'){
            return <h3 className="font-bold text-2xl">{domToReact(children, HTML_PARSE_OPTIONS)}</h3>
        }
        if(name === 'h4'){
            return <h4 className="font-semibold text-xl">{domToReact(children, HTML_PARSE_OPTIONS)}</h4>
        }
        if(name === 'h5'){
            return <h5 className="font-medium text-lg">{domToReact(children, HTML_PARSE_OPTIONS)}</h5>
        }
    }
};

const PostForm = React.memo((props) => {

    let {categories, postStates} = useContext(PostsDataCenterContext);

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
    let [contentHtml, setContentHtml] = useState('');
    let [previewModalOpen, setPreviewModalOpen] = useState(false);
    let [isSaved, setIsSaved] = useState(false);
    let [lastSavedAt, setLastSavedAt] = useState(null);

    useInterval(() => savePost(), 1000*20);

    const excludedField = ['content'];

    const formConfig = {
        reValidateMode: 'onChange',
        submitFocusError: true,
        validationSchema: yupObj().shape(props.formData.validationSchema),
    };
    const { register, handleSubmit, triggerValidation, reset, errors } = useForm(formConfig);

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


    let savePost = async () => {
        let result = await triggerAllValidation();
        if(!result || isSaved || !isEmpty(errors)){
            return;
        }
        // TODO send data to the server!
        await setSavedStates();
    };

    let setSavedStates = () => {
        setLoading(false);
        setIsSaved(true);
        setLastSavedAt(moment().format('YYYY/MM/DD HH:mm'));
    };

    let updateFormDataState = (accessor, value) => {
        let updatedElement = {};
        updatedElement[accessor] = value;
        setFormDataState({...formDataState, ...updatedElement});
    };

    let postStatesOptions = useMemo(() => {
        if(isEmpty(postStates)){
            return [];
        }
        return postStates.map(item => {
            return {value: item.id, displayOption: item.name};
        });
    }, [postStates]);

    let categoryOptions = useMemo(() => {
        if(isEmpty(categories)){
            return [];
        }
        return categories.map(item => {
            return {value: item.id, displayOption: item.name};
        }).sort((a, b) => {
            let textA = a.displayOption.toUpperCase();
            let textB = b.displayOption.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }, [categories]);

    const onSubmit = async data => {
        console.log('submit!!!');
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
        let result = await props.onSubmitCallback(data);
        if(result){
            setSavedStates();
        }
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
            if (!element.editable || excludedField.includes(element.accessor)) {
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
        if(id === 'category'){
            options = categoryOptions;
        } else if(id === 'post_state'){
            options = postStatesOptions
        }
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
        let source = DEFAULT_POST_MAIN_PHOTO;
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
                displayImgLabel={true}
                outerDivClassName={`relative rounded w-full mx-auto bg-gray-400 overflow-hidden`}
                imgClassName={`bottom-0 w-full rounded mx-auto`}
                hoverOverlayClassName={`absolute text-center mx-auto w-full h-48 bottom-0 bg-black text-white opacity-75 text-center pt-2`}
                cameraIconSize={'2x'}
                overlayPTextClassName={`text-sm mt-2`}
                overlayPCameraIconClassName={`mt-4`}
            />
        );
    };

    let triggerAllValidation = async () => {
        let formKeys = props.formData.elements.map(element => element.accessor);
        let result = formKeys.map(async key => {
            return await triggerValidation(key);
        });
        let allResult = await Promise.all(result);
        let filteredResult = allResult.filter(x => x === false);
        return filteredResult.length === 0;
    };

    let editorOnChangeHandler = (content) => {
        setContentHtml(sanitizeHtml(content, SANITIZE_HTML_OPTIONS));
        setIsSaved(false);
    };

    let renderPostContentReview = () => {
        if(typeof window !== 'undefined'){
            return parse(contentHtml, HTML_PARSE_OPTIONS);
        }
    };

    let renderSaveStatus = () => {
        if(!isEmpty(errors)){
            let errorKeys = Object.keys(errors);
            return errorKeys.map((errKey) => {
                return <p className="text-red-500 text-sm italic text-right">{errors[errKey].message}</p>
            });
        }
        if(isSaved){
            return <p className="text-gray-600 text-sm italic text-right">Saved at {lastSavedAt}</p>;
        }
        return <p className="text-gray-600 text-sm italic text-right">Not saved</p>;
    };

    return (
        <Aux>
            <form className="w-full px-20 my-5" onSubmit={handleSubmit(onSubmit)} suppressContentEditableWarning={true}>
                <div className="flex flex-wrap -mx-3 mb-6 text-center self-center">
                    {renderFormElements()}
                    <div className="w-full -mb-5 pb-0">
                        {errors['content'] ? <p className="text-red-500 text-md italic text-center">*{errors['content']['message']}</p> : ""}
                    </div>
                    <BlogEditor name='content' height={500} reference={register} onChangeCallback={(content) => editorOnChangeHandler(content)}/>
                    <div className="mt-0 pt-0 mx-10 w-full align-right">
                        {renderSaveStatus()}
                    </div>
                    <textarea readOnly name='content' ref={register} className={`hidden`} value={contentHtml}/>
                </div>
                <CSRFTokenInput/>
                <button type="submit" className="w-1/3 text-center py-3 rounded bg-green-600 text-white hover:bg-green-900 focus:outline-none my-1">
                    Save
                </button>
                <button
                    className="w-1/3 mx-5 text-center py-3 rounded bg-blue-500 hover:bg-blue-700 text-white focus:outline-none my-1"
                    onClick={() => setPreviewModalOpen(true)}
                >
                    Preview
                </button>
            </form>
            <Modal onCloseCallback={() => setPreviewModalOpen(false)} modalOpen={previewModalOpen} contentBoxClassNames="overflow-scroll">
                <div className="mb-10 min-h-10 py-10 px-10" suppressContentEditableWarning={true}>
                    {renderPostContentReview()}
                </div>
            </Modal>
        </Aux>
    );
});

PostForm.defaultProps = {
    onSubmitCallback: () => {},
};

PostForm.propTypes = {
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

export default PostForm