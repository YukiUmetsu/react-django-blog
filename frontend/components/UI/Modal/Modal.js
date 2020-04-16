import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Aux from "../../../hoc/Aux/Aux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimes} from "@fortawesome/free-solid-svg-icons";

const Modal = (props) => {

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
        await setOpacity(0);  // opacity 100 => 0
        await setTimeout(() => setModalOpen(false),550);  // => display:none
        await props.onCloseCallback();
    };

    let openModalHandler = async () => {
        setModalOpen(true); // display:none =>  normal
        await setTimeout(() => setOpacity(100), 200); // opacity 0 => 100
        await props.onOpenCallback();
    };


    return (
        <Aux>
            <div
                id="modal"
                 className={`fixed opacity-${opacity} top-0 right-0 bottom-0 left-0 z-100 w-full h-full flex items-center justify-center ${modalOpen? "": "hidden"} transition duration-500 ease-in-out transition-opacity`}>
                <div
                    id="modal-overlay"
                    className={`fixed w-full h-full opacity-75 ${props.overlayClassNames}`}
                    onClick={() => closeModalHandler()}> </div>
                <div
                    id="modal-content-box"
                    className={`relative bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg overflow-y-auto ${props.contentBoxClassNames}`}>
                    {props.children}

                    <span className="absolute top-0 right-0 p-4 z-900" onClick={() => closeModalHandler()}>
                        <FontAwesomeIcon icon={faTimes} className={`h-12 w-12 fill-current ${props.closeButtonClassNames} hover:text-black`}/>
                    </span>
                </div>
            </div>
        </Aux>
    );
};

Modal.defaultProps = {
    modalOpen: false,
    overlayClassNames: 'bg-gray-800',
    closeButtonClassNames: 'text-gray-900',
    onCloseCallback: () => {},
    onOpenCallback: () => {},
};

Modal.propTypes = {
    modalOpen: PropTypes.bool,
    overlayClassNames: PropTypes.string,
    contentBoxClassNames: PropTypes.string,
    closeButtonClassNames: PropTypes.string,
    onCloseCallback: PropTypes.func,
    onOpenCallback: PropTypes.func,
};
export default Modal