import React, {useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import PropTypes from 'prop-types';
import styles from './DateInput.module.css';
import moment from 'moment-timezone';

const DateInput = (props) => {
    let [ selectedDate, setSelectedDate ] = useState(null);
    // set default timezone
    moment.tz.setDefault(moment.tz.guess());

    let selectedDateHandler = (date) => {
        props.onDateChanged(date);
        setSelectedDate(date);
        props.updateFormDataState(props.inputName, date);
    };

    useEffect(() => {
        if(props.defaultDate){
            setSelectedDate(props.defaultDate)
        }
    }, [props.defaultDate]);

    return (
        <div key={props.inputName} className={`text-gray-600 mt-4 leading-tight w-full md:w-${props.length} ${styles['customDatePickerWidth']}`}>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={props.inputName}>
                {props.label}
            </label>
            <DatePicker
                selected={(selectedDate) ? moment(selectedDate).toDate() : ''}
                onChange={date => selectedDateHandler(date)}
                minDate={props.minDate}
                dateFormat="MM/dd/yyyy h:mm aa"
                showYearDropdown
                className="w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                placeholderText={props.placeholderText}
                styles={{minWidth: '100%', width: '100%'}}
                showTimeInput
                timeInputLabel="Time:"
            />
            <input type="hidden" className={`hidden invisible`} name={props.inputName} ref={props.reference} value={selectedDate ? selectedDate : ''}/>
            {props.error? <p className="text-red-500 text-xs italic">{props.error.message}</p> : ""}
        </div>
    );
};

DateInput.defaultProps = {
    label: 'Date',
    inputName: '',
    placeholderText: '',
    minDate: Date.now(),
    onDateChanged: () => {},
    updateFormDataState: () => {},
};

DateInput.propTypes = {
    label: PropTypes.string,
    defaultDate: PropTypes.any,
    inputName: PropTypes.string,
    placeholderText: PropTypes.string,
    minDate: PropTypes.any,
    length: PropTypes.string,
    reference: PropTypes.any,
    onDateChanged: PropTypes.func,
    error: PropTypes.any,
    updateFormDataState: PropTypes.func,
};

export default DateInput