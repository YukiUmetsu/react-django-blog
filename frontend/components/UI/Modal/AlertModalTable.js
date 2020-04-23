import React from 'react';
import PropTypes from 'prop-types';

const AlertModalTable = (props) => {

    let renderHeader = () => {
        return props.labels.map(label => {
            return <th className="px-4 py-2" key={label}>{label}</th>;
        });
    };

    let renderBody = () => {
        return props.data.map((row, index) => {
            return renderRow(row, index);
        })
    };

    let renderRow = (row, index) => {

        let renderInsideTr = () => {
            return row.map(column => {
                return renderColumns(column);
            })
        };

        return (
            <tr key={index}>
                {renderInsideTr()}
            </tr>
        );
    };

    let renderColumns = (column) => {
        return (<td className="px-4 py-2" key={column.accessor}>{column.content}</td>);
    };

    return (
        <table className="table-auto">
            <thead>
                <tr>
                    {renderHeader()}
                </tr>
            </thead>
            <tbody>
                {renderBody()}
            </tbody>
        </table>
    );
};

AlertModalTable.propTypes = {
    labels: PropTypes.array,
    data: PropTypes.array,
};

export default AlertModalTable