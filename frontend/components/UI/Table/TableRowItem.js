import React from 'react';
import PropTypes from 'prop-types';
import NumberIncreaseDisplay from "../Statistics/NumberDisplay/NumberIncreaseDisplay";
import NumberDecreaseDisplay from "../Statistics/NumberDisplay/NumberDecreaseDisplay";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {dateObjToStr} from "../../../lib/utils";

const TableRowItem = (props) => {

    let renderItem = () => {
        if(props.increase){
            return <td><NumberIncreaseDisplay content={props.content}/></td>
        } else if (props.decrease){
            return <td><NumberDecreaseDisplay content={props.content}/></td>
        } else if(props.isImage){
            return <td><img className="h-14 w-14 rounded-full" src={props.content} alt="" /></td>
        } else if(props.isBoolean){
            return (
                <td>
                    {props.content === 'true' || props.content === true ?
                        <FontAwesomeIcon icon={faCheck} className="text-teal-700"/> :
                        <FontAwesomeIcon icon={faTimes} className="text-gray-500"/>
                    }
                </td>
            );
        } else if(props.isDate){
            return <td>{dateObjToStr(props.content)}</td>
        }
        return <td>{props.content}</td>
    };

    return renderItem();
};

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
};

export default TableRowItem