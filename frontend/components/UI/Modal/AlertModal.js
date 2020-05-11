import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Aux from "../../../hoc/Aux/Aux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";

const AlertModal = (props) => {

    let [modalOpen, setModalOpen] = useState(false);
    let [opacity, setOpacity] = useState(0);

    useEffect(() => {
        if(props.modalOpen){
            openModalHandler();
        } else {
            setModalOpen(props.modalOpen);
        }

    }, [props.modalOpen]);

    let closeModalHandler = async () => {
        props.onCloseCallback();
        await setOpacity(0);  // opacity 100 => 0
        await setTimeout(() => setModalOpen(false),550);  // => display:none
    };

    let openModalHandler = async () => {
        props.onOpenCallback();
        setModalOpen(true); // display:none =>  normal
        await setTimeout(() => setOpacity(100), 200); // opacity 0 => 100
    };

    let confirmedHandler = async () => {
        await props.onConfirmedCallback(props.associatedObjId);
        await setOpacity(0);  // opacity 100 => 0
        await setTimeout(() => setModalOpen(false),550);  // => display:none
    };

    return (
        <Aux>
            <div
                id={props.modalId}
                className={`fixed opacity-${opacity} top-0 right-0 bottom-0 left-0 z-100 w-full h-full flex items-center justify-center ${modalOpen? "": "hidden"} transition duration-500 ease-in-out transition-opacity`}>
                <div
                    id="modal-overlay"
                    className={`fixed w-full h-full opacity-75 ${props.overlayClassNames}`}
                    onClick={() => closeModalHandler()}> </div>
                <div
                    id="modal-content-box"
                    className={`rounded-md relative bg-white w-11/12 md:w-11/12 lg:w-1/2 xl:w-1/2 mx-auto rounded shadow-lg overflow-y-auto ${props.contentBoxClassNames}`}>

                    <div role="alert" className="inline-block min-w-full">
                        <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                            {props.title}
                        </div>
                        <div className="border border-t-0 border-red-400 rounded-b px-4 py-3 text-gray-700">
                            {props.children}
                            <div className="mx-auto flex justify-center mt-6">
                                <button className="alert-confirm bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => confirmedHandler()}>
                                    Confirm
                                </button>
                                <button className="alert-cancel bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => closeModalHandler()}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>


                    <span className="absolute top-0 right-0 px-3 py-0 z-900 text-white" onClick={() => closeModalHandler()}>
                        <FontAwesomeIcon icon={faTimes} className={`h-12 w-12 text-white fill-current ${props.closeButtonClassNames}`}/>
                    </span>
                </div>
            </div>
        </Aux>
    );
};

AlertModal.defaultProps = {
    modalId: 'modal',
    modalOpen: false,
    overlayClassNames: 'bg-gray-800',
    closeButtonClassNames: 'text-gray-900',
    onCloseCallback: () => {},
    onOpenCallback: () => {},
    onConfirmedCallback: () => {},
    associatedObjId: null,
};

AlertModal.propTypes = {
    modalId: PropTypes.string,
    title: PropTypes.string,
    modalOpen: PropTypes.bool,
    overlayClassNames: PropTypes.string,
    contentBoxClassNames: PropTypes.string,
    closeButtonClassNames: PropTypes.string,
    onCloseCallback: PropTypes.func,
    onOpenCallback: PropTypes.func,
    onConfirmedCallback: PropTypes.func,
    associatedObjId: PropTypes.any,
};
export default AlertModal