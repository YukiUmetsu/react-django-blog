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
    const tdClassName = (props.column.displayClassName) ? props.column.displayClassName : '';

    const renderTextContent = () => {
        let content = getDisplayContentFromObj(props.column, props.rowObj);
        if(typeof content === 'string'){
            return <td className={tdClassName}>{content}</td>
        }
        if(props.column.isTag === true){
            return (
                <td className={tdClassName}>
                    {content.map((item, index) => {
                        if(index === 2){
                            return <span>...</span>
                        } else if(index > 2){
                            return '';
                        }
                        return (
                            <span key={`${index}-${item}`} className="text-xs inline-block bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700 mr-2">
                                #{item}
                            </span>);
                    })}
                </td>);
        }
        if(Array.isArray(content)){
            return (<td className={tdClassName}>{content.join(', ')}</td>);
        }
    };

    let renderItem = () => {
        if(props.increase){
            return <td className={tdClassName}><NumberIncreaseDisplay content={content}/></td>
        } else if (props.decrease){
            return <td className={tdClassName}><NumberDecreaseDisplay content={content}/></td>
        } else if(props.isImage){
            if(content === null){
                return <td className={tdClassName}> </td>
            }
            if(typeof content === 'string'){
                return <td className={tdClassName}><img className="h-11 w-10 rounded-full" src={content} alt="" /></td>
            } else if(!isEmpty(content.file)){
                return <td className={tdClassName}><img className="h-11 w-10 rounded-full" src={API_BASE+content.file} alt={content.desc} /></td>
            }

        } else if(props.isBoolean){
            return (
                <td className={tdClassName}>
                    {content === true ?
                        <FontAwesomeIcon id={`${columnAccessor}-${rowObjId}`} icon={faCheck} className="text-teal-700"/>:
                        <FontAwesomeIcon id={`${columnAccessor}-${rowObjId}`} icon={faTimes} className="text-grey-400"/>
                    }
                </td>
            );
        } else if(props.isDate){
            return <td className={tdClassName}>{formatDate(content)}</td>
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