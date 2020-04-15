import React, {useState} from 'react';
import DatePicker from "react-datepicker";
import PropTypes from 'prop-types';

const DateRangePicker = (props) => {
    let [ selectedStartDate, setSelectedStartDate ] = useState(null);
    let [ selectedEndDate, setSelectedEndDate ] = useState(null);

    let selectedStartDateHandler = (date) => {
        props.onDateRangeChanged([date, selectedEndDate], ...props.onDateRangeChangedArguments);
        setSelectedStartDate(date);
    };

    let selectedEndDateHandler = (date) => {
        props.onDateRangeChanged([selectedStartDate, date], ...props.onDateRangeChangedArguments);
        setSelectedEndDate(date);
    };

    return (
        <div className={`text-gray-600 leading-tight`} style={{width: 'min-content'}}>
            <DatePicker
                selected={selectedStartDate}
                onChange={date => selectedStartDateHandler(date)}
                selectsStart
                showYearDropdown
                className="shadow h-full py-1 rounded border border-gray-300"
                placeholderText="Start Date"
            />
            <DatePicker
                selected={selectedEndDate}
                onChange={date => selectedEndDateHandler(date)}
                selectsEnd
                minDate={selectedStartDate}
                showYearDropdown
                className="shadow h-full py-1 rounded border border-gray-300"
                placeholderText="End Date"
            />
        </div>
    );
};

DateRangePicker.defaultProps = {
    onDateRangeChanged: () => {},
    onDateRangeChangedArguments: [],
};

DateRangePicker.propTypes = {
    onDateRangeChanged: PropTypes.func,
    onDateRangeChangedArguments: PropTypes.array,
};

export default DateRangePicker