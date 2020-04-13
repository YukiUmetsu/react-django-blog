import React from 'react';
import PropTypes from 'prop-types';
import TableRowItem from "./TableRowItem";

const TableRow = (props) => {

    let renderItems = (items) => {
        return items.map((item, index) => {
           return <TableRowItem {...item} key={index}/>
        })
    };

    return (
        <tr key={props.rowCount}>
            <th scope="row">{props.rowCount}</th>
            {renderItems(props.items)}
        </tr>
    );
};

TableRow.propTypes = {
    rowCount: PropTypes.number,
    items: PropTypes.array
};

export default TableRow