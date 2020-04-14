import React, {useState} from 'react';
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";

const SelectableTableHeaderSearchesItem = (props) => {

    let [ selectedStartDate, setSelectedStartDate ] = useState(null);
    let [ selectedEndDate, setSelectedEndDate ] = useState(null);

    let selectedStartDateHandler = (date) => {
        // TODO date picked
        setSelectedStartDate(date);
    };

    let selectedEndDateHandler = (date) => {
        // TODO
        setSelectedEndDate(date);
    };

    let renderSearches = () => {
        if(!props.isSortableColumn){
            return "";
        }
        if(props.type === 'date'){
            return (
                <div className={`text-gray-600 leading-tight`} style={{width: 'min-content'}}>
                    <DatePicker
                        selected={selectedStartDate}
                        onChange={date => selectedStartDateHandler(date)}
                        locale="en-US"
                        selectsStart
                        showYearDropdown
                        className="shadow h-full py-1 rounded border border-gray-300"
                        placeholderText="Start Date"
                    />
                    <DatePicker
                        selected={selectedEndDate}
                        onChange={date => selectedEndDateHandler(date)}
                        locale="en-US"
                        selectsEnd
                        minDate={selectedStartDate}
                        showYearDropdown
                        className="shadow h-full py-1 rounded border border-gray-300"
                        placeholderText="End Date"
                    />
                </div>
            );
        }
        if(props.type === 'boolean'){
            return (
                <select
                    className="block appearance-none border rounded w-full text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:shadow-outline"
                    id="grid-state">
                    <option value="">Yes/No</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
            );
        }
        return (
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={props.accessor}
                type="text"
                placeholder={`Search by ${props.label}`}
            />
        );
    };

    return (
        <th scope="col" key={props.accessor}>
            {renderSearches()}
        </th>
    );
};

SelectableTableHeaderSearchesItem.propTyles = {
    isSortableColumn: PropTypes.bool,
    accessor: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
};

export default SelectableTableHeaderSearchesItem