import React, {useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera} from "@fortawesome/free-solid-svg-icons/faCamera";
import {isEmpty} from "../../../lib/utils";
import PropTypes from 'prop-types';

const FormImageSelect = React.memo((props) => {

    let [showChangeImageCover, setShowChangeImageCover] = useState(false);
    let imageElementRef = useRef();

    let imageChangedHandler = (e) => {
        const files = Array.from(e.target.files);
        if(isEmpty(files[0])){
            return;
        }
        imageElementRef.current.src = URL.createObjectURL(files[0]);
        if(props.updateFormDataState){
            props.updateFormDataState(props.id, files[0]);
        }
    };

    let renderLabel = () => {
        if(props.displayImgLabel && props.label){
            return <label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`}>{props.label}</label>
        }
    };

    return (
        <div key={props.id} className={`rounded-lg p-6 w-${props.length}`}>
            {renderLabel()}
            <div
                className={props.outerDivClassName}
                onMouseEnter={() => setShowChangeImageCover(true)}
                onMouseLeave={() => setShowChangeImageCover(false)}
            >
                <img
                    ref={imageElementRef}
                    className={props.imgClassName}
                    src={props.imgSource} alt={props.label}
                />

                <div
                    id="change-image-cover"
                    className={`${showChangeImageCover? "": "hidden"} ${props.hoverOverlayClassName}`}>
                    <label htmlFor={props.displayId}>
                        <p className={props.overlayPTextClassName}>change image</p>
                        <p className={props.overlayPCameraIconClassName}><FontAwesomeIcon icon={faCamera} className="text-white" size={props.cameraIconSize}/></p>
                        <input
                            id={props.displayId}
                            name={props.id}
                            type="file"
                            onChange={(e) => imageChangedHandler(e)}
                            className={`invisible h-full`}
                            ref={props.reference}
                            multiple={props.multiple}
                            accept={props.accept}
                        />
                    </label>
                </div>
            </div>
            {props.error? <p className="text-red-500 text-xs italic">{props.error.message}</p> : ""}
        </div>
    );
});

FormImageSelect.defaultProps = {
    outerDivClassName: 'relative rounded-full h-20 w-20 md:w-24 md:h-24 rounded-full mx-auto bg-gray-400 overflow-hidden',
    imgClassName: 'bottom-0 h-20 w-20 md:w-24 md:h-24 rounded-full mx-auto',
    hoverOverlayClassName: 'absolute w-full bottom-0 bg-black text-white opacity-75 text-center pt-2',
    displayImgLabel: false,
    cameraIconSize: '1x',
    overlayPTextClassName: 'text-xs',
    overlayPCameraIconClassName: '',
};

FormImageSelect.propTypes = {
    id: PropTypes.string,
    displayId: PropTypes.string,
    length: PropTypes.string,
    label: PropTypes.string,
    reference: PropTypes.any,
    accept: PropTypes.any,
    imgSource: PropTypes.any,
    updateFormDataState: PropTypes.func,
    error: PropTypes.any,
    multiple: PropTypes.any,
    outerDivClassName: PropTypes.string,
    imgClassName: PropTypes.string,
    hoverOverlayClassName: PropTypes.string,
    displayImgLabel: PropTypes.bool,
    cameraIconSize: PropTypes.string,
};

export default FormImageSelect