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
import PropTypes from 'prop-types';

export const PostsDataCenterContext = createContext({});

const PostsDataCenter = (props) => {

    // variables that change per data center
    const imgFieldName = 'main_img';
    const objNameSm = 'post';
    const objNameCp = 'Post';
    const imgFieldDisplayName = 'post main image';
    const imgFileNamePrefixField = 'title';

    // loading objects
    let [nextDataFetchUrl, setNextDataFetchUrl] = useState(props.firstApiFetchURL);
    let initialData = (props.mainDataRequired) ? [] : ['data not required'];
    let [data, setData] = useState(initialData);
    let [categories, setCategories] = useState([]);
    let [users, setUsers] = useState([]);
    let [postStates, setPostStates] = useState([]);

    let [dataLoadingDone, setDataLoadingDone] = useState(!props.mainDataRequired);
    let [usersLoadingDone, setUsersLoadingDone] = useState(!props.userDataRequired);
    let [categoriesLoadingDone, setCategoriesLoadingDone] = useState(false);
    let [postStatesLoadingDone, setPostStatesLoadingDone] = useState(false);
    let [idsToLoad, setIdsToLoad] = useState(props.idsToLoad ? props.idsToLoad : []);
    let [idsToLoadIndex, setIdsToLoadIndex] = useState(0);

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

    let [createdPostObj, setCreatedPostObj] = useState(null);

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

    /***
     * Load individual objects
     */
    useSWR(
        (!isEmpty(idsToLoad) && idsToLoadIndex <= idsToLoad.length-1) ?
            [props.listApiUrl + idsToLoad[idsToLoadIndex] + '/'] : null,
        SWR_FETCH,
        {
            onSuccess: async (anObj) => {
                if(anObj.hasOwnProperty('id')){
                    let newData = dClone(data);
                    newData.push(anObj);
                    setData(newData);
                    if(idsToLoadIndex + 1 <= idsToLoad.length-1){
                        setIdsToLoadIndex(idsToLoadIndex+1)
                    }

                } else {
                    showDefaultServerErrorAlert();
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
     * Creating a new object. Create imgField first.
     */
    const { data: fileObj } = useSWR(
        (!isEmpty(imgFieldObj) && isEmpty(createdPostObj) && !imgFieldObjCreated) ?
            [FILES_LIST_API, imgFieldObj.desc] : null,
        () => SWR_POST_FILE_FETCH(
            FILES_LIST_API,
            "image",
            `${imgFieldObj.desc}-${moment().format('YYYY-MM-DD-HH-mm')}`,
            imgFieldObj.user,
            imgFieldObj.file),
        {
            errorRetryCount: 1,
            onSuccess: async (fileObj) => {
                if(!fileObj.hasOwnProperty('id')){
                    let message = `Unable to create a ${objNameSm} main image.`;
                    if(fileObj.hasOwnProperty('detail')){
                        message = fileObj.detail;
                    }
                    createAlertProps("Server error. ", message);
                    setDataManipulationComplete(true);
                    clearNewFormStates(true);
                    return;
                }

                if(!isEmpty(newObjFormData)){
                    let cloneNewObjFormData = dClone(newObjFormData);
                    cloneNewObjFormData[imgFieldName] = fileObj.id;
                    await setNewObjFormData(cloneNewObjFormData);
                }
                setImgFieldObj(null);
                await setImgFieldObjCreated(true);
            },
            onError: (error) => {
                console.log(error);
                createAlertProps("Server connection error", error.message);
                clearNewFormStates(true);
            }
        }
    );

    const { data: createdObject } = useSWR(
        (newObjFormData && typeof newObjFormData[imgFieldName] !== 'object' && imgFieldObjCreated && fileObj && isEmpty(createdPostObj))?
            [props.listApiUrl, newObjFormData['title']]: null,
        () => SWR_POST_FETCH(
            props.listApiUrl,
            {...newObjFormData, tags: Object.values(newObjFormData.tags)}
        ),
        {
            errorRetryCount: 1,
            onSuccess: async (createdObject) => {
                if(!createdObject.hasOwnProperty('id')){
                    setDataManipulationComplete(true);
                    createAlertProps("Server connection error. ",`Unable to create a ${objNameSm}.`);
                    clearNewFormStates(true);
                } else {
                    setCreatedPostObj(createdObject);
                    setDataManipulationComplete(true);
                    clearNewFormStates();
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




    /**
     * Editing a object with image field
     */

    const { data: updatedFileObj } = useSWR((!isEmpty(imgFieldObj) && !isEmpty(createdPostObj)) ? [FILES_LIST_API, imgFieldObj.desc] : null,
        () => SWR_POST_FILE_FETCH(
            FILES_LIST_API,
            "image",
            `${imgFieldObj.desc}-${moment().format('YYYY-MM-DD-HH-mm')}`,
            imgFieldObj.user,
            imgFieldObj.file),
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
        (!isEmpty(createdPostObj) && editFormData && !isEmpty(imgFieldObj) && imgFieldObjCreated && updatedFileObj)?
            [props.listApiUrl + createdPostObj.id + '/', editFormData]: null,
        () => SWR_POST_FETCH(
            props.listApiUrl + createdPostObj.id + '/',
            {...newObjFormData, tags: Object.values(editFormData.tags)}
        ),
        {
            errorRetryCount: 1,
            onSuccess: (editedObject) => {
                if(!editedObject.hasOwnProperty('id')){
                    createAlertProps("Server connection error. ",`Unable to update the ${objNameSm}.`);
                    clearEditFormStates(true);
                } else {
                    replaceDataItemWithNewOne(editedObject);
                    setCreatedPostObj(editedObject);
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
        (!isEmpty(createdPostObj) && !isEmpty(editFormData) && !imgFieldObjCreated && isEmpty(imgFieldObj)) ?
            [props.listApiUrl+editFormData.id+'/', editFormData]
            : null,
        () => SWR_PATCH_FETCH(props.listApiUrl+editFormData.id+'/', editFormData),
        {
            errorRetryCount: 1,
            onSuccess: (editedObject) => {
                if(!editedObject.hasOwnProperty('id')){
                    createAlertProps("Server connection error. ",`Unable to set the new ${imgFieldDisplayName}`);
                    clearEditFormStates(true);
                } else {
                    replaceDataItemWithNewOne(editedObject);
                    setCreatedPostObj(editedObject);
                    clearEditFormStates();
                    createSuccessfulAlertProps(`${objNameCp} Edit`, ` Successfully edited the ${objNameSm}.`);
                    setDataManipulationComplete(true);
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
            [props.listApiUrl + dataIdsToBeDeleted[deleteCurrentIndex] + "/", deleteCurrentIndex]
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
        setImgFieldObj(null);
        setEditFormData(null);
        setImgFieldObjCreated(false);
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

    const updateCreatedPostObj = (postObj) => {
        if(isEmpty(postObj)){
           return;
        }
        setCreatedPostObj(postObj);
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
            createdPostObj: createdPostObj,
            categories: categories,
            postStates: postStates,
            alertProps: alertProps,
            updateNextDataFetchUrl: updateNextDataFetchUrl,
            updateNewObjFormData: updateNewObjFormData,
            updateEditObjFormData: updateEditObjFormData,
            updateDeletionStates: updateDeletionStates,
            updateImgFieldObj: updateImgFieldObj,
            updateCreatedPostObj: updateCreatedPostObj,
            resetAlertProps: resetAlertProps,
            dataManipulationComplete: dataManipulationComplete,
        }}>
            {props.children}
        </PostsDataCenterContext.Provider>
    );
};

PostsDataCenter.defaultProps = {
    mainDataRequired: true,
    userDataRequired: true,
    firstApiFetchURL: POSTS_LIST_API,
    listApiUrl: POSTS_LIST_API,
    idsToLoad: [],
};

PostsDataCenter.propTypes = {
    postDataRequired: PropTypes.bool,
    userDataRequired: PropTypes.bool,
    firstApiFetchURL: PropTypes.string,
    listApiUrl: PropTypes.string,
    idsToLoad: PropTypes.array,
};

export default PostsDataCenter