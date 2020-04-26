import React from 'react';
import PropTypes from 'prop-types';
import NumberIncreaseDisplay from "../Statistics/NumberDisplay/NumberIncreaseDisplay";
import NumberDecreaseDisplay from "../Statistics/NumberDisplay/NumberDecreaseDisplay";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {formatDate, isEmpty} from "../../../lib/utils";
import {API_BASE} from "../../../constants";

const TableRowItem = React.memo((props) => {

    let renderItem = () => {
        if(props.increase){
            return <td><NumberIncreaseDisplay content={props.content}/></td>
        } else if (props.decrease){
            return <td><NumberDecreaseDisplay content={props.content}/></td>
        } else if(props.isImage){
            if(props.content === null){
                return <td> </td>
            }
            if(typeof props.content === 'string'){
                return <td><img className="h-11 w-10 rounded-full" src={props.content} alt="" /></td>
            } else if(!isEmpty(props.content.file)){
                return <td><img className="h-11 w-10 rounded-full" src={API_BASE+props.content.file} alt={props.content.desc} /></td>
            }

        } else if(props.isBoolean){
            return (
                <td>
                    {props.content === true ?
                        <FontAwesomeIcon id={`${props.columnAccessor}-${props.rowObjId}`} icon={faCheck} className="text-teal-700"/>:
                        <FontAwesomeIcon id={`${props.columnAccessor}-${props.rowObjId}`} icon={faTimes} className="text-grey-400"/>
                    }
                </td>
            );
        } else if(props.isDate){
            return <td>{formatDate(props.content)}</td>
        }
        return <td>{props.content}</td>
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
    columnAccessor: "",
    rowObjId: 0,
};

TableRowItem.propTypes = {
    increase: PropTypes.bool,
    decrease: PropTypes.bool,
    content: PropTypes.any,
    isImage: PropTypes.bool,
    isDate: PropTypes.bool,
    isBoolean: PropTypes.bool,
    columnAccessor: PropTypes.string,
    rowObjId: PropTypes.number,
};

export default TableRowItem