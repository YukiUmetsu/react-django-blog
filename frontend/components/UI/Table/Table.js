import React from 'react';
import TableRow from "./TableRow";
import PropTypes from 'prop-types';
import TableCSS from './Table.module.css';

const Table = (props) => {

    let renderHeader = (headerItems) => {
        return headerItems.map((item, index) => {
            return <th scope="col" key={index}>{item}</th>
        })
    };

    let renderBody = (bodyItems) => {
        return bodyItems.map((item, index) => {
            return <TableRow rowCount={index} items={item} key={index}/>
        })
    };

    return (
        <div className={TableCSS["table-responsive"]}>
            <table className={`${TableCSS.table} text-grey-darkest`}>
                <thead className="bg-gray-600 text-white text-normal">
                <tr>
                    {renderHeader(props.header)}
                </tr>
                </thead>
                <tbody>
                    {renderBody(props.body)}
                </tbody>
            </table>
        </div>
    );
};

Table.propTyles = {
    header: PropTypes.array,
    body: PropTypes.array,
};

export default Table