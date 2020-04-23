import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

const Alert = (props) => {

    let [showAlert, setShowAlert] = useState(props.showAlert);
    let [timer, setTimer] = useState(null);

    useEffect(() => {
        setShowAlert(props.showAlert);

        if(props.hideAfterSeconds !== 0 && showAlert){
            let timer = setTimeout(async () => {
                await setShowAlert(false);
                await props.hideCallback();
            }, props.hideAfterSeconds*1000);
            setTimer(timer);
        }

        // clear timeout when unmount
        return () => {
            if(timer){
                clearTimeout(timer);
            }
        };
    }, [props.showAlert, showAlert]);

    return (
        <div className={`${showAlert ? "": "hidden"} relative bg-${showAlert ? props.bgColor: ""}-100 border border-${showAlert ? props.bgColor: ""}-400 text-${showAlert ? props.textColor: ""}-700 px-4 py-3 mt-4 mb-4 rounded`} role="alert">
            <strong className="font-bold pr-1">{props.title}</strong>
            <span className="block sm:inline">{props.content}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={()=>props.closeCallback()}>
                    <svg className={`fill-current h-6 w-6 text-${props.exitColor}-500`} role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                    </svg>
                </span>
        </div>
    );;
};

Alert.defaultProps = {
  bgColor: "red",
  textColor: "red",
  exitColor: "red",
  showAlert: true,
  hideAfterSeconds: 0,
  hideCallback: () => {},
};

Alert.propTypes = {
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  exitColor: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  closeCallback: PropTypes.func,
  showAlert: PropTypes.bool,
  hideAfterSeconds: PropTypes.number,
  hideCallback: PropTypes.func,
};

export default Alert