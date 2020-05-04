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
                return renderColumns(column, props.columns[column.accessor]);
            })
        };

        return (
            <tr key={index}>
                {renderInsideTr()}
            </tr>
        );
    };

    let renderColumns = (column, columnInfo) => {
        if(columnInfo.isTag){
            return (
                <td>
                    {column.content.map((item, index) => {
                        return (
                            <span key={`${index}-${item}`} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                #{item}
                            </span>);
                    })}
                </td>);
        }
        if(Array.isArray(column.content)){
            return (<td className="px-4 py-2" key={column.accessor}>{column.content.join(' ')}</td>);
        }
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
    columns: PropTypes.object,
};

export default AlertModalTable