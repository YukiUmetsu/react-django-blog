import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import Aux from "../../../hoc/Aux/Aux";
import Modal from "../../UI/Modal/Modal";
import Form from "../../UI/Form/Form";
import {isEmpty, removeFromMutableObject} from "../../../lib/utils";

const AddNewPost = (props) => {

    const {
        updateNewObjFormData: updateNewObjFormData,
        updateImgFieldObj: updateImgFieldObj,
        dataManipulationComplete: dataManipulationComplete,
    } = useContext(props.dataCenterContext);
    let [isNewObjModalOpen, setIsNewObjModalOpen] = useState(false);
    let [dataUpdateError, setDataUpdateError] = useState(null);
    let [formLoading, setFormLoading] = useState(false);
    let [fileFields, setFileFields] = useState([]);

    const fileFieldsTypes = ['image', 'file'];

    let submitHandler = async (data) => {
        await setFormLoading(true);

        if(isEmpty(fileFields)){
            // no image field exist
            await updateNewObjFormData(data);
            return;
        }

        // support just one file per obj creation for now.
        if(data[fileFields[0]].length > 0){
            await updateImgFieldObj(data[fileFields[0]][0]);
            await removeFromMutableObject(data, fileFields[0]);
            await updateNewObjFormData(data);

        } else {
            // file was not submitted.
            await removeFromMutableObject(data, fileFields[0]);
            await updateNewObjFormData(data);
        }
    };

    useEffect(() => {
        if(dataManipulationComplete){
            setFormLoading(false);
            setIsNewObjModalOpen(false);
        }
    }, [dataManipulationComplete]);

    useEffect(() => {
        updateFileFields();
    }, [props.formData]);

    let updateFileFields = () => {
        let formFileFields = props.formData.elements.map(element => {
            if(fileFieldsTypes.includes(element.type)){
                return element.accessor;
            }
        }).filter(x => !isEmpty(x));
        if(!isEmpty(formFileFields)){
            setFileFields(formFileFields);
        }
    };

    return (
        <Aux>
            <button className={`${props.btnClassNames} ${props.additionalBtnClassNames}`} onClick={()=>setIsNewObjModalOpen(true)}>
                <FontAwesomeIcon icon={faPlus} className="pr-1"/>  {props.btnTitle}
            </button>
            <Modal modalOpen={isNewObjModalOpen} onCloseCallback={() => setIsNewObjModalOpen(false)}>
                <Form
                    form_id_prefix={props.form_id_prefix}
                    formData={props.formData}
                    onSubmitCallback={submitHandler}
                    loading={formLoading}
                    formError={dataUpdateError}
                    object={null}
                />
            </Modal>
        </Aux>
    );
};

AddNewPost.defaultProps = {
    btnClassNames: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
    additionalBtnClassNames: "",
    form_id_prefix: "new_"
};

AddNewPost.propTypes = {
    btnTitle: PropTypes.string,
    btnClassNames: PropTypes.string,
    additionalBtnClassNames: PropTypes.string,
    form_id_prefix: PropTypes.string,
    formData: PropTypes.any
};

export default AddNewPost