import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import Aux from "../../../hoc/Aux/Aux";
import Modal from "../../UI/Modal/Modal";
import Form from "../../UI/Form/Form";
import {FORM_DATA} from "../../../constants/FormDataConst";
import {isEmpty} from "../../../lib/utils";
import cloneDeep from 'lodash/cloneDeep';
import {FILES_LIST_API, SWR_PATCH_FETCH, SWR_POST_FETCH, SWR_POST_FILE_FETCH, USERS_LIST_API} from "../../../constants";
import useSWR from "swr";
import * as moment from 'moment';

const AddNewUser = (props) => {

    let [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
    let [newUserData, setNewUserData] = useState(null);
    let [profileImg, setprofileImg] = useState(null);
    let [profileImgCreated, setProfileImgCreated] = useState(false);
    let [dataUpdateError, setDataUpdateError] = useState(null);
    let [formLoading, setFormLoading] = useState(false);

    let submitHandler = async (data) => {
        await setFormLoading(true);
        await setprofileImg(data.profile_img[0]);
        await setNewUserData({...data, profile_img: null});
    };

    let createErrorObj = (message = '') => {
        return {error: {message: message}}
    };

    const { data: user } = useSWR(
        newUserData ? [USERS_LIST_API, newUserData]: null,
        SWR_POST_FETCH,
        {
            errorRetryCount: 1,
            onSuccess: async (user) => {
                if(!user.hasOwnProperty('id')){
                    setDataUpdateError(createErrorObj("Server connection error. Unable to create a user."));
                    clearNewUserFormStatesExceptError();
                }
            },
            onError: (error) => {
                console.log(error);
                setDataUpdateError(error);
                clearNewUserFormStatesExceptError();
            }
        });

    const { data: fileObj } = useSWR((!isEmpty(user) && !isEmpty(profileImg)) ? [FILES_LIST_API, user] : null,
        () => SWR_POST_FILE_FETCH(
            FILES_LIST_API,
            "image",
            `${user.first_name}-${user.last_name}-${moment().format('YYYY-MM-DD-HH-mm')}`,
            user.id,
            profileImg),
        {
            errorRetryCount: 1,
            onSuccess: (fileObj) => {
                if(!fileObj.hasOwnProperty('id')){
                    setDataUpdateError(createErrorObj("Server connection error. Unable to create a user icon."));
                    clearNewUserFormStatesExceptError();
                } else {
                    setProfileImgCreated(true);
                }
            },
            onError: (error) => {
                console.log(error);
                setDataUpdateError(error);
                clearNewUserFormStatesExceptError();
            }
        }
    );

    const { data: editedUser } = useSWR((!isEmpty(user) && !isEmpty(fileObj) && profileImgCreated) ? [USERS_LIST_API+user.id+'/', fileObj.id]: null,
        () => SWR_PATCH_FETCH(USERS_LIST_API+user.id+'/', {profile_img: fileObj.id}),
        {
            errorRetryCount: 1,
            onSuccess: (editedUser) => {
                if(!editedUser.hasOwnProperty('id')){
                    setDataUpdateError(createErrorObj("Server connection error. Unable to set the Icon image to the new user."))
                    clearNewUserFormStatesExceptError();
                } else {
                    clearNewUserFormStates();
                    setIsNewUserModalOpen(false);
                }
            },
            onError: (error) => {
                console.log(error);
                setDataUpdateError(error);
                clearNewUserFormStatesExceptError();
            }
        }
    );

    const clearNewUserFormStates = () => {
        setFormLoading(false);
        setDataUpdateError(null);
        setprofileImg(null);
        setNewUserData(null);
        setProfileImgCreated(false);
        setNewUserData(null);
    };

    const clearNewUserFormStatesExceptError = () => {
        setFormLoading(false);
        setDataUpdateError(null);
        setprofileImg(null);
        setNewUserData(null);
        setProfileImgCreated(false);
        setNewUserData(null);
    };

    return (
        <Aux>
            <button className={`${props.btnClassNames} ${props.additionalBtnClassNames}`} onClick={()=>setIsNewUserModalOpen(true)}>
                <FontAwesomeIcon icon={faPlus} className="pr-1"/>  Add New User
            </button>
            <Modal modalOpen={isNewUserModalOpen} onCloseCallback={() => setIsNewUserModalOpen(false)}>
                <Form
                    form_id_prefix="New_User"
                    formData={FORM_DATA.NEW_USER_FORM}
                    onSubmitCallback={submitHandler}
                    loading={formLoading}
                    formError={dataUpdateError}
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