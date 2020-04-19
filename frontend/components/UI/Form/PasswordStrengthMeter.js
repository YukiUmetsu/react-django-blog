import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';
import zxcvbn from 'zxcvbn';
import {faLaugh, faMeh, faSadTear, faSmile} from "@fortawesome/free-solid-svg-icons";

const PasswordStrengthMeter = (props) => {

    let [password, setPassword] = useState(props.password);

    useEffect(() => {
        setPassword(props.password);
    },[props.password]);

    const styleArr = {
        '0': { label: 'weak', width: 25, icon: <FontAwesomeIcon icon={faSadTear} />, color: 'bg-red-500'},
        '1': { label: 'weak', width: 25, icon: <FontAwesomeIcon icon={faSadTear} />, color: 'bg-red-500'},
        '2': { label: 'meh', width: 50, icon: <FontAwesomeIcon icon={faMeh} />, color: 'bg-yellow-500'},
        '3': { label: 'good', width: 75, icon: <FontAwesomeIcon icon={faSmile} />, color: 'bg-blue-500'},
        '4': { label: 'awesome', width: 100, icon: <FontAwesomeIcon icon={faLaugh} />, color: 'bg-green-500'},
    };

    let result = zxcvbn(password).score;
    let width = styleArr[''+result]['width'];
    let icon = styleArr[''+result]['icon'];
    let label = styleArr[''+result]['label'];
    let bgColor = styleArr[''+result]['color'];

    return (
        <div className="w-full">
            <div className="shadow w-full bg-gray-300 h-6">
                <div className={`${bgColor} text-sm leading-none py-1 text-center text-white h-6`} style={{width: `${width}%`}}>
                    {label} {icon}
                </div>
            </div>
        </div>
    );
};

PasswordStrengthMeter.propTypes = {
    password: PropTypes.string,
};

export default PasswordStrengthMeter