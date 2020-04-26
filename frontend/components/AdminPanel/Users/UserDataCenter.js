import React, {createContext, useEffect, useState} from 'react';
import {
    FILES_LIST_API, NOTIFICATION_AFTER_DATA_EDIT,
    SWR_DELETE_FETCH,
    SWR_FETCH, SWR_PATCH_FETCH,
    SWR_POST_FETCH,
    SWR_POST_FILE_FETCH, SWR_PUT_FETCH,
    USERS_LIST_API
} from "../../../constants";
import useSWR from "swr";
import {
    dClone,
    getObjsToAdd,
    isEmpty,
    removeDuplicatesById,
    removeFromData,
    replaceDataItem,
} from "../../../lib/utils";
import * as moment from "moment";

export const UserDataCenterContext = createContext({});

const UserDataCenter = (props) => {

    // loading users
    let [nextDataFetchUrl, setNextDataFetchUrl] = useState(USERS_LIST_API);
    let [data, setData] = useState([]);

    // creating a new user
    let [newUserFormData, setNewUserFormData] = useState(null);
    let [profileImg, setprofileImg] = useState(null);
    let [profileImgCreated, setProfileImgCreated] = useState(false);

    // editing a user
    let [editUserFormData, setEditUserFormData] = useState(null);
    let [dataManipulationComplete, setDataManipulationComplete] = useState(false);

    // deleting users
    let [dataIdsToBeDeleted, setDataIdsToBeDeleted] = useState([]);
    let [deleteCurrentIndex, setDeleteCurrentIndex] = useState(null);

    const initialAlertProps = {
        title:"Something went wrong",
        content:"Failed to load user data",
        hideAfterSeconds: 3,
        showAlert: false,
    };
    let [alertProps, setAlertProps] = useState(initialAlertProps);

    useEffect(() => {
       return () => {
           resetAlertProps();
           setDataManipulationComplete(false);
           setDataIdsToBeDeleted([]);
           setDeleteCurrentIndex(null);
           setNextDataFetchUrl(null);
       }
    }, []);

    /***
     * connect to server to fetch data
     */
    useSWR(
        nextDataFetchUrl,
        SWR_FETCH,
        {
            onSuccess: async (serverData) => {
                let newData = await getNewData(serverData.results);
                await setData(newData);
                await setNextDataFetchUrl(serverData.next);
            },
            onError: () => showDefaultServerErrorAlert(),
        }
    );


    /**
     * Creating a new user
     */
    const { data: user } = useSWR(
        newUserFormData ? [USERS_LIST_API, newUserFormData]: null,
        SWR_POST_FETCH,
        {
            errorRetryCount: 1,
            onSuccess: async (user) => {
                if(!user.hasOwnProperty('id')){
                    createAlertProps("Server connection error. ","Unable to create a user.");
                    clearNewUserFormStates(true);
                } else if(isEmpty(profileImg)){
                    setDataManipulationComplete(true);
                    createSuccessfulAlertProps("User creation", " User was successfully created!");
                }
            },
            onError: (error) => {
                console.log(error);
                createAlertProps("Server connection error", error.message);
                clearNewUserFormStates(true);
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
                    createAlertProps("Server connection error. ","Unable to create a user icon.");
                    clearNewUserFormStates(true);
                } else {
                    setProfileImgCreated(true);
                }
            },
            onError: (error) => {
                console.log(error);
                createAlertProps("Server connection error", error.message);
                clearNewUserFormStates(true);
            }
        }
    );

    useSWR(
        (!isEmpty(user) && !isEmpty(fileObj) && profileImgCreated) ?
            [USERS_LIST_API+user.id+'/', fileObj.id]
            : null,
        () => SWR_PATCH_FETCH(USERS_LIST_API+user.id+'/', {profile_img: fileObj.id}),
        {
            errorRetryCount: 1,
            onSuccess: (editedUser) => {
                if(!editedUser.hasOwnProperty('id')){
                    createAlertProps("Server connection error. ","Unable to set the Icon image to the new user.");
                    clearNewUserFormStates(true);
                } else {
                    clearNewUserFormStates();
                    setDataManipulationComplete(true);
                    createSuccessfulAlertProps("User creation", " User was successfully created!")
                }
            },
            onError: (error) => {
                createAlertProps("Server connection error", error.message);
                clearNewUserFormStates(true);
            }
        }
    );



    /**
     * Editing a user with profile_img
     */

    const { data: editedFileObj } = useSWR((!isEmpty(editUserFormData) && !isEmpty(profileImg)) ? [FILES_LIST_API, editUserFormData.id] : null,
        () => SWR_POST_FILE_FETCH(
            FILES_LIST_API,
            "image",
            `${editUserFormData.first_name}-${editUserFormData.last_name}-${moment().format('YYYY-MM-DD-HH-mm')}`,
            editUserFormData.id,
            profileImg),
        {
            errorRetryCount: 1,
            onSuccess: (fileObj) => {
                if(!fileObj.hasOwnProperty('id')){
                    createAlertProps("Server connection error. ","Unable to edit a user icon.");
                    clearEditUserFormStates(true);
                } else {
                    setProfileImgCreated(true);
                }
            },
            onError: (error) => {
                console.log(error);
                createAlertProps("Server connection error", error.message);
                clearEditUserFormStates(true);
            }
        }
    );

    useSWR(
        (!isEmpty(editedFileObj) &&  !isEmpty(editUserFormData) && profileImgCreated) ?
            [USERS_LIST_API+editUserFormData.id+'/', editedFileObj.id]
            : null,
        () => SWR_PATCH_FETCH(USERS_LIST_API+editUserFormData.id+'/', {...editUserFormData, ...{profile_img: editedFileObj.id}}),
        {
            errorRetryCount: 1,
            onSuccess: (editedUser) => {
                if(!editedUser.hasOwnProperty('id')){
                    createAlertProps("Server connection error. ","Unable to set the new icon image to the user.");
                    clearEditUserFormStates(true);
                } else {
                    clearEditUserFormStates();
                    setDataManipulationComplete(true);
                    createSuccessfulAlertProps("User Edit", " Successfully edited the user.")
                }
            },
            onError: (error) => {
                createAlertProps("Server connection error", error.message);
                clearEditUserFormStates(true);
            }
        }
    );

    /**
     * Editing a user without profile_img
     */
    useSWR(
        (!isEmpty(editUserFormData) && !profileImgCreated && isEmpty(profileImg)) ?
            [USERS_LIST_API+editUserFormData.id+'/', editUserFormData]
            : null,
        () => SWR_PATCH_FETCH(USERS_LIST_API+editUserFormData.id+'/', editUserFormData),
        {
            errorRetryCount: 1,
            onSuccess: (editedUser) => {
                if(!editedUser.hasOwnProperty('id')){
                    createAlertProps("Server connection error. ","Unable to set the new icon image to the user.");
                    clearEditUserFormStates(true);
                } else {
                    replaceDataItemWithNewOne(editedUser);
                    clearEditUserFormStates();
                    setDataManipulationComplete(true);
                    setAlertProps(
                        {...NOTIFICATION_AFTER_DATA_EDIT,
                            hideCallback: () => {resetAlertProps(); setDataManipulationComplete(false)}});
                }
            },
            onError: (error) => {
                createAlertProps("Server connection error", error.message);
                clearEditUserFormStates(true);
            }
        }
    );


    /***
     * connect server to delete a user
     */
    useSWR(
        (typeof deleteCurrentIndex === 'number' && !isEmpty(dataIdsToBeDeleted)) ?
            [USERS_LIST_API + dataIdsToBeDeleted[deleteCurrentIndex] + "/", deleteCurrentIndex]
            : null,
        SWR_DELETE_FETCH,
        {
            onSuccess: async () => {
                if(deleteCurrentIndex === dataIdsToBeDeleted.length-1){
                    await setDeleteCurrentIndex(null);
                    await setDataIdsToBeDeleted(null);
                    await showAlertAfterDeletion();
                } else {
                    await setDeleteCurrentIndex(deleteCurrentIndex+1);
                }
            },
            onError: () => showDefaultServerErrorAlert(),
        }
    );


    const getNewData = async (dataItems = []) => {
        if(isEmpty(dataItems)){
            return;
        }
        let itemsToAdd = [];
        let newData;

        if(isEmpty(data)){
            newData = dataItems;
        } else {
            newData = await dClone(data);
            newData = await newData.concat(dataItems);
            let userCurrentIds = data.map(item => item.id);
            itemsToAdd = getObjsToAdd(dataItems, userCurrentIds);
            if(!isEmpty(itemsToAdd)){
                newData = newData.concat(itemsToAdd);
            }
        }
        // remove duplicates
        newData = removeDuplicatesById(newData);
        return newData;
    };

    let showDefaultServerErrorAlert = () => {
        setAlertProps({
            ...initialAlertProps,
            showAlert: true,
            hideCallback: () => { setAlertProps(initialAlertProps);}
        });
    };

    let showAlertAfterDeletion = () => {
        setAlertProps({
            bgColor: 'teal',
            textColor: 'teal',
            exitColor: 'teal',
            showAlert: true,
            hideAfterSeconds: 3,
            title: 'Deletion',
            content: 'Data was successfully deleted',
            hideCallback: () => resetAlertProps()
        });
    };

    let createSuccessfulAlertProps = (title, content) => {
        setAlertProps({
            bgColor: 'teal',
            textColor: 'teal',
            exitColor: 'teal',
            showAlert: true,
            hideAfterSeconds: 3,
            title: title,
            content: content,
            hideCallback: () => resetAlertProps()
        });
    };

    let createAlertProps = (title = '', message = '') => {
        setAlertProps({
            title: title,
            content: message,
            showAlert: true,
            hideCallback: () => { setAlertProps(initialAlertProps);}
        });
    };

    const clearNewUserFormStates = (skipAlertProps = false) => {
        setAlertProps(initialAlertProps);
        setprofileImg(null);
        setNewUserFormData(null);
        setProfileImgCreated(false);
    };

    const clearEditUserFormStates = (skipAlertProps = false) => {
        setEditUserFormData(null);
        setProfileImgCreated(false);
        setAlertProps(initialAlertProps);
        setprofileImg(null);
    };


    const updateNextDataFetchUrl = url => {
        setNextDataFetchUrl(url);
    };

    const updateNewUserFormData = data => {
        if(isEmpty(data)){
            return;
        }
        setNewUserFormData(data);
    };

    const updateEditUserFormData = async data => {
        if(isEmpty(data)){
           return;
        }
        if(data.hasOwnProperty('profile_img')){
            await setprofileImg(data.profile_img[0]);
            delete data.profile_img;
            await setEditUserFormData(data);
        } else {
            await setEditUserFormData(data);
        }
    };

    const updateDeletionStates = (index = null, ids = []) => {
        if(typeof index === 'number'){
            setDeleteCurrentIndex(index);
        }
        if(!isEmpty(ids)){
            setDataIdsToBeDeleted(ids);
            let newData = removeFromData(ids, data);
            setData(newData);
        }
    };

    const updateProfileImg = (profileImg) => {
        if(isEmpty(profileImg)){
           return;
        }
        setprofileImg(profileImg);
    };

    const resetAlertProps = () => {
        setAlertProps(initialAlertProps);
        setDataManipulationComplete(false);
    };

    const replaceDataItemWithNewOne = dataItem => {
        let newData = replaceDataItem(dataItem, data);
        setData(newData);
    };

    return (
        <UserDataCenterContext.Provider value={{
            originalData: data,
            alertProps: alertProps,
            updateNextDataFetchUrl: updateNextDataFetchUrl,
            updateNewUserFormData: updateNewUserFormData,
            updateEditUserFormData: updateEditUserFormData,
            updateDeletionStates: updateDeletionStates,
            updateProfileImg: updateProfileImg,
            resetAlertProps: resetAlertProps,
            dataManipulationComplete: dataManipulationComplete,
        }}>
            {props.children}
        </UserDataCenterContext.Provider>
    );
};

export default UserDataCenter