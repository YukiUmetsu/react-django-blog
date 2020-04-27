import React, {createContext, useEffect, useState} from 'react';
import {
    FILES_LIST_API, NOTIFICATION_AFTER_DATA_EDIT,
    SWR_DELETE_FETCH,
    SWR_FETCH, SWR_PATCH_FETCH,
    SWR_POST_FETCH,
    SWR_POST_FILE_FETCH, SWR_PUT_FETCH,
    POSTS_LIST_API, CATEGORIES_LIST_API, USERS_LIST_API, POST_STATES_LIST_API
} from "../../../constants";
import useSWR from "swr";
import {
    addDataItem,
    dClone,
    getObjsToAdd,
    isEmpty,
    removeDuplicatesById,
    removeFromData,
    replaceDataItem,
} from "../../../lib/utils";
import * as moment from "moment";

export const PostsDataCenterContext = createContext({});

const PostsDataCenter = (props) => {

    // variables that change per data center
    const imgFieldName = 'main_img';
    const objNameSm = 'post';
    const objNameCp = 'Post';
    const imgFieldDisplayName = 'post main image';
    const imgFileNamePrefixField = 'title';
    const listApi = POSTS_LIST_API;

    // loading objects
    let [nextDataFetchUrl, setNextDataFetchUrl] = useState(listApi);
    let [data, setData] = useState([]);
    let [categories, setCategories] = useState([]);
    let [users, setUsers] = useState([]);
    let [postStates, setPostStates] = useState([]);

    let [dataLoadingDone, setDataLoadingDone] = useState(false);
    let [usersLoadingDone, setUsersLoadingDone] = useState(false);
    let [categoriesLoadingDone, setCategoriesLoadingDone] = useState(false);
    let [postStatesLoadingDone, setPostStatesLoadingDone] = useState(false);

    // creating a new object
    let [newObjFormData, setNewObjFormData] = useState(null);
    let [imgFieldObj, setImgFieldObj] = useState(null);
    let [imgFieldObjCreated, setImgFieldObjCreated] = useState(false);

    // editing a object
    let [editFormData, setEditFormData] = useState(null);
    let [dataManipulationComplete, setDataManipulationComplete] = useState(false);

    // deleting objects
    let [dataIdsToBeDeleted, setDataIdsToBeDeleted] = useState([]);
    let [deleteCurrentIndex, setDeleteCurrentIndex] = useState(null);

    const initialAlertProps = {
        title:"Something went wrong",
        content:`Failed to load ${objNameSm} data`,
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

    useEffect(() => {
        if(dataLoadingDone && !usersLoadingDone){
            setNextDataFetchUrl(USERS_LIST_API);
        }
        if(dataLoadingDone && usersLoadingDone && !categoriesLoadingDone){
            setNextDataFetchUrl(CATEGORIES_LIST_API)
        }
        if(dataLoadingDone && usersLoadingDone && !categoriesLoadingDone){
            setNextDataFetchUrl(CATEGORIES_LIST_API)
        }
        if(dataLoadingDone && usersLoadingDone && categoriesLoadingDone && !postStatesLoadingDone){
            setNextDataFetchUrl(POST_STATES_LIST_API)
        }
    }, [dataLoadingDone, usersLoadingDone, categoriesLoadingDone, postStatesLoadingDone]);

    /***
     * connect to server to fetch data
     */
    useSWR(
        nextDataFetchUrl,
        SWR_FETCH,
        {
            onSuccess: async (serverData) => {
                if(!dataLoadingDone){
                    let newData = await getNewData(serverData.results, data);
                    await setData(newData);
                    await setNextDataFetchUrl(serverData.next);
                }
                if(dataLoadingDone && !usersLoadingDone){
                    let newData = await getNewData(serverData.results, users);
                    await setUsers(newData);
                    await setNextDataFetchUrl(serverData.next);
                }
                if(dataLoadingDone && usersLoadingDone && !categoriesLoadingDone){
                    let newData = await getNewData(serverData.results, categories);
                    await setCategories(newData);
                    await setNextDataFetchUrl(serverData.next);
                }
                if(dataLoadingDone && usersLoadingDone && categoriesLoadingDone && !postStatesLoadingDone){
                    let newData = await getNewData(serverData.results, postStates);
                    await setPostStates(newData);
                    await setNextDataFetchUrl(serverData.next);
                }

                if(isEmpty(serverData.next)){
                    await setDataLoadingStateWhenDoneLoadingData();
                }
            },
            onError: () => showDefaultServerErrorAlert(),
        }
    );

    let setDataLoadingStateWhenDoneLoadingData = async () => {
        if(!isEmpty(data) && !dataLoadingDone){
            await setDataLoadingDone(true);
        }
        if(dataLoadingDone && !isEmpty(users) && !usersLoadingDone){
            await setUsersLoadingDone(true);
        }
        if(usersLoadingDone && !categoriesLoadingDone && !postStatesLoadingDone){
            await setCategoriesLoadingDone(true);
        }
        if(categoriesLoadingDone && !postStatesLoadingDone){
            await setPostStatesLoadingDone(true);
        }
    };


    /**
     * Creating a new object
     */
    const { data: createdObject } = useSWR(
        newObjFormData ? [listApi, newObjFormData]: null,
        SWR_POST_FETCH,
        {
            errorRetryCount: 1,
            onSuccess: async (createdObject) => {
                if(!createdObject.hasOwnProperty('id')){
                    setDataManipulationComplete(true);
                    createAlertProps("Server connection error. ",`Unable to create a ${objNameSm}.`);
                    clearNewFormStates(true);
                } else if(isEmpty(imgFieldObj)){
                    setDataManipulationComplete(true);
                    createSuccessfulAlertProps(`${objNameCp} creation`, ` ${objNameCp} was successfully created!`);
                }
            },
            onError: (error) => {
                console.log(error);
                setDataManipulationComplete(true);
                createAlertProps("Server connection error", error.message);
                clearNewFormStates(true);
            }
        });

    const { data: fileObj } = useSWR((!isEmpty(createdObject) && !isEmpty(imgFieldObj)) ? [FILES_LIST_API, createdObject.id] : null,
        () => SWR_POST_FILE_FETCH(
            FILES_LIST_API,
            "image",
            `${createdObject[imgFileNamePrefixField]}-${moment().format('YYYY-MM-DD-HH-mm')}`,
            createdObject.id,
            imgFieldObj),
        {
            errorRetryCount: 1,
            onSuccess: (fileObj) => {
                if(!fileObj.hasOwnProperty('id')){
                    let message = `Unable to create a ${objNameSm} main image.`;
                    if(fileObj.hasOwnProperty('detail')){
                        message = fileObj.detail;
                    }
                    createAlertProps("Server error. ", message);
                    setDataManipulationComplete(true);
                    clearNewFormStates(true);
                } else {
                    setImgFieldObjCreated(true);
                }
            },
            onError: (error) => {
                console.log(error);
                createAlertProps("Server connection error", error.message);
                clearNewFormStates(true);
            }
        }
    );

    useSWR(
        (!isEmpty(createdObject) && !isEmpty(fileObj) && imgFieldObjCreated) ?
            [listApi+createdObject.id+'/', fileObj.id]
            : null,
        () => SWR_PATCH_FETCH(listApi+createdObject.id+'/', {[imgFieldName]: fileObj.id}),
        {
            errorRetryCount: 1,
            onSuccess: (editedObject) => {
                if(!editedObject.hasOwnProperty('id')){
                    createAlertProps("Server connection error. ",`Unable to set the ${imgFieldDisplayName} to the new ${objNameSm}.`);
                    clearNewFormStates(true);
                } else {
                    setData(addDataItem(editedObject, data));
                    clearNewFormStates();
                    setDataManipulationComplete(true);
                    createSuccessfulAlertProps(`${objNameCp} creation`, ` ${objNameCp} was successfully created!`)
                }
            },
            onError: (error) => {
                createAlertProps("Server connection error", error.message);
                clearNewFormStates(true);
            }
        }
    );



    /**
     * Editing a object with image field
     */

    const { data: editedFileObj } = useSWR((!isEmpty(editFormData) && !isEmpty(imgFieldObj)) ? [FILES_LIST_API, editFormData.id] : null,
        () => SWR_POST_FILE_FETCH(
            FILES_LIST_API,
            "image",
            `${editFormData[imgFileNamePrefixField]}-${moment().format('YYYY-MM-DD-HH-mm')}`,
            editFormData.id,
            imgFieldObj),
        {
            errorRetryCount: 1,
            onSuccess: (fileObj) => {
                if(!fileObj.hasOwnProperty('id')){
                    let message = `Unable to edit a ${imgFieldDisplayName}.`;
                    if(fileObj.hasOwnProperty('detail')){
                        message = fileObj.detail;
                    }
                    createAlertProps("Server error. ", message);
                    setDataManipulationComplete(true);
                    clearEditFormStates(true);
                } else {
                    setImgFieldObjCreated(true);
                }
            },
            onError: (error) => {
                console.log(error);
                createAlertProps("Server connection error", error.message);
                clearEditFormStates(true);
            }
        }
    );

    useSWR(
        (!isEmpty(editedFileObj) &&  !isEmpty(editFormData) && imgFieldObjCreated) ?
            [listApi+editFormData.id+'/', editedFileObj.id]
            : null,
        () => SWR_PATCH_FETCH(listApi+editFormData.id+'/', {...editFormData, ...{[imgFieldName]: editedFileObj.id}}),
        {
            errorRetryCount: 1,
            onSuccess: (editedObject) => {
                if(!editedObject.hasOwnProperty('id')){
                    createAlertProps("Server connection error. ",`Unable to set the new ${imgFieldDisplayName} to the ${objNameSm}.`);
                    clearEditFormStates(true);
                } else {
                    replaceDataItemWithNewOne(editedObject);
                    clearEditFormStates();
                    setDataManipulationComplete(true);
                    createSuccessfulAlertProps(`${objNameCp} Edit`, ` Successfully edited the ${objNameSm}.`)
                }
            },
            onError: (error) => {
                createAlertProps("Server connection error", error.message);
                clearEditFormStates(true);
            }
        }
    );

    /**
     * Editing a object without image field
     */
    useSWR(
        (!isEmpty(editFormData) && !imgFieldObjCreated && isEmpty(imgFieldObj)) ?
            [listApi+editFormData.id+'/', editFormData]
            : null,
        () => SWR_PATCH_FETCH(listApi+editFormData.id+'/', editFormData),
        {
            errorRetryCount: 1,
            onSuccess: (editedObject) => {
                if(!editedObject.hasOwnProperty('id')){
                    createAlertProps("Server connection error. ",`Unable to set the new ${imgFieldDisplayName}`);
                    clearEditFormStates(true);
                } else {
                    replaceDataItemWithNewOne(editedObject);
                    clearEditFormStates();
                    setDataManipulationComplete(true);
                    setAlertProps(
                        {...NOTIFICATION_AFTER_DATA_EDIT,
                            hideCallback: () => {resetAlertProps(); setDataManipulationComplete(false)}});
                }
            },
            onError: (error) => {
                createAlertProps("Server connection error", error.message);
                clearEditFormStates(true);
            }
        }
    );


    /***
     * connect server to delete a object
     */
    useSWR(
        (typeof deleteCurrentIndex === 'number' && !isEmpty(dataIdsToBeDeleted)) ?
            [listApi + dataIdsToBeDeleted[deleteCurrentIndex] + "/", deleteCurrentIndex]
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


    const getNewData = async (dataItems = [], currentDataState) => {
        if(isEmpty(dataItems)){
            return;
        }
        let itemsToAdd = [];
        let newData;

        if(isEmpty(currentDataState)){
            newData = dataItems;
        } else {
            newData = await dClone(currentDataState);
            newData = await newData.concat(dataItems);
            let objCurrentIds = currentDataState.map(item => item.id);
            itemsToAdd = getObjsToAdd(dataItems, objCurrentIds);
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
            hideCallback: () => resetAlertProps(),
            closeCallback: () => resetAlertProps()
        });
    };

    let createAlertProps = (title = '', message = '') => {
        setAlertProps({
            title: title,
            content: message,
            showAlert: true,
            hideAfterSeconds: 3,
            hideCallback: () => resetAlertProps(),
            closeCallback: () => resetAlertProps()
        });
    };

    const clearNewFormStates = (skipAlertProps = false) => {
        if(!skipAlertProps){
            setAlertProps(initialAlertProps);
        }
        setImgFieldObj(null);
        setNewObjFormData(null);
        setImgFieldObjCreated(false);
    };

    const clearEditFormStates = (skipAlertProps = false) => {
        if(!skipAlertProps){
            setAlertProps(initialAlertProps);
        }
        setEditFormData(null);
        setImgFieldObjCreated(false);
        setImgFieldObj(null);
    };


    const updateNextDataFetchUrl = url => {
        setNextDataFetchUrl(url);
    };

    const updateNewObjFormData = data => {
        if(isEmpty(data)){
            return;
        }
        setNewObjFormData(data);
    };

    const updateEditObjFormData = async data => {
        if(isEmpty(data)){
           return;
        }
        if(data.hasOwnProperty(imgFieldName)){
            await setImgFieldObj(data[imgFieldName][0]);
            delete data[imgFieldName];
            await setEditFormData(data);
        } else {
            await setEditFormData(data);
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

    const updateImgFieldObj = (imgFieldObj) => {
        if(isEmpty(imgFieldObj)){
           return;
        }
        setImgFieldObj(imgFieldObj);
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
        <PostsDataCenterContext.Provider value={{
            originalData: data,
            users: users,
            categories: categories,
            postStates: postStates,
            alertProps: alertProps,
            updateNextDataFetchUrl: updateNextDataFetchUrl,
            updateNewObjFormData: updateNewObjFormData,
            updateEditObjFormData: updateEditObjFormData,
            updateDeletionStates: updateDeletionStates,
            updateImgFieldObj: updateImgFieldObj,
            resetAlertProps: resetAlertProps,
            dataManipulationComplete: dataManipulationComplete,
        }}>
            {props.children}
        </PostsDataCenterContext.Provider>
    );
};

export default PostsDataCenter