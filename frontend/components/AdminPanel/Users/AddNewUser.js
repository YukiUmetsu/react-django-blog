import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import Aux from "../../../hoc/Aux/Aux";
import Modal from "../../UI/Modal/Modal";
import Form from "../../UI/Form/Form";
import {FORM_DATA} from "../../../constants/FormDataConst";

const AddNewUser = (props) => {

    let [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
    // TODO user data submission.

    return (
        <Aux>
            <button className={`${props.btnClassNames} ${props.additionalBtnClassNames}`} onClick={()=>setIsNewUserModalOpen(true)}>
                <FontAwesomeIcon icon={faPlus} className="pr-1"/>  Add New User
            </button>
            <Modal modalOpen={isNewUserModalOpen} onCloseCallback={() => setIsNewUserModalOpen(false)}>
                <Form
                    form_id_prefix="New_User"
                    formData={FORM_DATA.NEW_USER_FORM}
                    onSubmitCallback={() => {console.log("submitted!")}}
                />
            </Modal>
        </Aux>
    );
};

AddNewUser.defaultProps = {
    btnClassNames: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
    additionalBtnClassNames: "",
};

AddNewUser.propTypes = {
    btnClassNames: PropTypes.string,
    additionalBtnClassNames: PropTypes.string,
};

export default AddNewUser