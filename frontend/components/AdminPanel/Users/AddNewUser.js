import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Aux from "../../../hoc/Aux/Aux";
import Modal from "../../UI/Modal/Modal";
import {isEmpty, removeFromMutableObject} from "../../../lib/utils";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import dynamic from "next/dynamic";
const DynamicForm = dynamic(
    () => import('../../UI/Form/Form'),
    { ssr: false }
);

const AddNewUser = React.memo((props) => {

    const {
        updateNewUserFormData: updateNewUserFormData,
        updateProfileImg: updateProfileImg,
        dataManipulationComplete: dataManipulationComplete,
    } = useContext(props.dataCenterContext);
    let [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
    let [dataUpdateError, setDataUpdateError] = useState(null);
    let [formLoading, setFormLoading] = useState(false);
    let [fileFields, setFileFields] = useState([]);

    const fileFieldsTypes = ['image', 'file'];

    let submitHandler = async (data) => {
        await setFormLoading(true);

        if(isEmpty(fileFields)){
            // no image field exist
            await updateNewUserFormData(data);
            return;
        }

        // support just one file per obj creation for now.
        if(data[fileFields[0]].length > 0){
            await updateProfileImg(data[fileFields[0]][0]);
            await removeFromMutableObject(data, fileFields[0]);
            await updateNewUserFormData(data);

        } else {
            // file was not submitted.
            await removeFromMutableObject(data, fileFields[0]);
            await updateNewUserFormData(data);
        }
    };

    useEffect(() => {
        if(dataManipulationComplete){
            setFormLoading(false);
            setIsNewUserModalOpen(false);
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
            <button
                id="add-new-user-btn"
                className={`${props.btnClassNames} ${props.additionalBtnClassNames}`}
                onClick={()=>setIsNewUserModalOpen(true)}>
                <FontAwesomeIcon icon={faPlus} className="pr-1"/>  {props.btnTitle}
            </button>
            <Modal modalOpen={isNewUserModalOpen} onCloseCallback={() => setIsNewUserModalOpen(false)}>
                <DynamicForm
                    form_element_id='new_user_form'
                    form_id_prefix={props.form_id_prefix}
                    formData={props.formData}
                    onSubmitCallback={submitHandler}
                    loading={formLoading}
                    formError={dataUpdateError}
                    object={null}
                    mx={'0'}
                    my={'0'}
                    px={'20'}
                    py={'20'}
                />
            </Modal>
        </Aux>
    );
});

AddNewUser.defaultProps = {
    btnClassNames: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
    additionalBtnClassNames: "",
    form_id_prefix: "new_"
};

AddNewUser.propTypes = {
    btnTitle: PropTypes.string,
    btnClassNames: PropTypes.string,
    additionalBtnClassNames: PropTypes.string,
    form_id_prefix: PropTypes.string,
    formData: PropTypes.any
};

export default AddNewUser