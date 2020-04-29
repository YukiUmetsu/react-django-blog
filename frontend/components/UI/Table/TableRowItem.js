import React from 'react';
import PropTypes from 'prop-types';
import NumberIncreaseDisplay from "../Statistics/NumberDisplay/NumberIncreaseDisplay";
import NumberDecreaseDisplay from "../Statistics/NumberDisplay/NumberDecreaseDisplay";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {formatDate, getDisplayContentFromObj, isEmpty} from "../../../lib/utils";
import {API_BASE} from "../../../constants";
import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";

const TableRowItem = React.memo((props) => {

    const columnAccessor = props.column.accessor;
    const content = props.rowObj[columnAccessor];
    const rowObjId = props.rowObj.id;

    const renderTextContent = () => {
        let content = getDisplayContentFromObj(props.column, props.rowObj);
        if(typeof content === 'string'){
            return <td>{content}</td>
        }
        if(props.column.isTag === true){
            return (
                <td>
                    {content.map((item, index) => {
                        return (
                            <span key={`${index}-${item}`} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                #{item}
                            </span>);
                    })}
                </td>);
        }
        if(Array.isArray(content)){
            return (<td>{content.join(', ')}</td>);
        }
    };

    let renderItem = () => {
        if(props.increase){
            return <td><NumberIncreaseDisplay content={content}/></td>
        } else if (props.decrease){
            return <td><NumberDecreaseDisplay content={content}/></td>
        } else if(props.isImage){
            if(content === null){
                return <td> </td>
            }
            if(typeof content === 'string'){
                return <td><img className="h-11 w-10 rounded-full" src={content} alt="" /></td>
            } else if(!isEmpty(content.file)){
                return <td><img className="h-11 w-10 rounded-full" src={API_BASE+content.file} alt={content.desc} /></td>
            }

        } else if(props.isBoolean){
            return (
                <td>
                    {content === true ?
                        <FontAwesomeIcon id={`${columnAccessor}-${rowObjId}`} icon={faCheck} className="text-teal-700"/>:
                        <FontAwesomeIcon id={`${columnAccessor}-${rowObjId}`} icon={faTimes} className="text-grey-400"/>
                    }
                </td>
            );
        } else if(props.isDate){
            return <td>{formatDate(content)}</td>
        }
        return renderTextContent();
    };

    return renderItem();
});

TableRowItem.defaultProps = {
    increase: false,
    decrease: false,
    content: "",
    isImage: false,
    isDate: false,
    isBoolean: false,
};

TableRowItem.propTypes = {
    increase: PropTypes.bool,
    decrease: PropTypes.bool,
    content: PropTypes.any,
    isImage: PropTypes.bool,
    isDate: PropTypes.bool,
    isBoolean: PropTypes.bool,
    column: PropTypes.any,
    rowObj: PropTypes.object,
};

export default TableRowItem