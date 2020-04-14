import React, {createContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Aux from "../../../hoc/Aux/Aux";
import {sortObjects} from "../../../lib/utils";
export const SortCallbackContext = createContext({});

const Paginator = (props) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemCountPerPage, setItemCountPerPage] = useState(15);
    const [totalData, setTotalData] = useState(props.originalData);
    const [data, setData] = useState(totalData.slice(0,itemCountPerPage-1));

    const childrenElements = React.Children.map(props.children, child => {
        return React.cloneElement(child, {
            data: data,
            originalData: props.originalData,
        });
    });

    useEffect(() => {
        if(totalData.length <= itemCountPerPage){
            setData(totalData);
        } else {
            setData( totalData.slice((currentPage-1)*itemCountPerPage, (currentPage*itemCountPerPage)));
        }

    },[currentPage, itemCountPerPage, totalData]);


    let totalPageCount = Math.ceil(totalData.length / itemCountPerPage);
    let baseClass = `block hover:${props.hoverTextColorClass} hover:${props.hoverBgColorClass} ${props.textColorClass} px-3 py-2`;
    let disabledClass = `select-none block ${props.disabledTextColorClass} ${props.disabledBgColorClass} px-3 py-2`;

    let previousClickHandler = (isPreviousAvailable) => {
        if(isPreviousAvailable){
            return () => {
                setCurrentPage(currentPage-1);
                props.onPreviousClicked()
            };
        } else {
            return null;
        }
    };

    let renderPrevious = () => {
        let isPreviousAvailable = currentPage - 1 > 0;
        return (
            <li onClick={previousClickHandler(isPreviousAvailable)} className={isPreviousAvailable? baseClass: disabledClass}>
                <a>Previous</a>
            </li>);
    };

    let nextClickHandler = (isNextAvailable) => {
        if(isNextAvailable){
            return () => {
                setCurrentPage(currentPage+1);
                props.onNextClicked()
            };
        } else {
            return null;
        }
    };

    let renderNext = () => {
        let isNextAvailable = currentPage < totalPageCount;
        return (
            <li onClick={nextClickHandler(isNextAvailable)} className={isNextAvailable? baseClass: disabledClass}>
                <a>Next</a>
            </li>);
    };

    let renderBody = () => {
        if(totalPageCount < 8){
            // create an array of empty x totalPageCount and iterate it.
            return Array(totalPageCount).fill().map((x,i) => {
                return renderItem(i+1);
            });
        }
        // too many to list every item.
        // always show first last. otherwise +-2 pages around the current page
        return Array(totalPageCount).fill().map((x,i) => {
            return renderItem(i+1);
        });
    };

    let renderItem = (index) => {
        let isFirstItem = (index === 1);
        let isLastItem = (index === totalPageCount);
        let shouldShow = isFirstItem || isLastItem|| (index<=currentPage+props.onShowRange && index>=currentPage-props.onShowRange);
        if(!shouldShow){
            return;
        }
        let isActive = index === currentPage;
        let itemClassName = `block ${props.hoverTextColorClass} ${props.hoverBgColorClass} px-3 py-2`;
        if(!isActive){
            itemClassName = baseClass
        }
        let renderContent = (index) => {
            let outOfRangeLess = (index < currentPage - props.onShowRange - 1);
            let outOfRangeMore = (index > currentPage + props.onShowRange + 1);
            if (isFirstItem && outOfRangeLess) {
                return <a>&#60;&#60;</a>
            } else if(isLastItem && outOfRangeMore){
                return <a>&#62;&#62;</a>
            } else {
                return <a>{index}</a>
            }
        };

        return (
            <li
                key={index}
                onClick={() => {
                    setCurrentPage(index);
                    props.onItemClicked(index);
                }}
                className={itemClassName} >
                {renderContent(index)}
            </li>
        );
    };

    let itemCountChangeHandler = (e) => {
        setItemCountPerPage(e.target.value);
        setCurrentPage(1);
    };

    let sortDataAsc = (columnAccessor) => {
        let [{type: selectedColumnType}, ...rest] = props.columns.filter(column => {
            return column.accessor === columnAccessor
        });
        let sortedData = sortObjects(totalData, columnAccessor, selectedColumnType,'asc');
        setTotalData(sortedData);
    };

    let sortDataDesc = (columnAccessor) => {
        let [{type: selectedColumnType}, ...rest] = props.columns.filter(column => {
            return column.accessor === columnAccessor
        });
        setTotalData(sortObjects(totalData, columnAccessor, selectedColumnType,'desc'));
    };

    return (
        <Aux>
            <SortCallbackContext.Provider value={{asc: sortDataAsc, desc: sortDataDesc}} >
            <div className={`flex w-full sm:w-full md:w-full lg:w-1/4 lg:w-1/5 h-10 mb-4 float-right ${props.isActionRequired?'lg:-mb-10 xl:-mb-10': ''}`}>
                <p className="w-full bold self-center">Rows Per Page</p>
                <select
                    id="itemCountPerPage"
                    onChange={(e) => itemCountChangeHandler(e)}
                    value={itemCountPerPage}
                    className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                    <option>15</option>
                    <option>25</option>
                    <option>50</option>
                </select>
            </div>
            {childrenElements}
            <div className="content-start">
                <ul className="flex list-reset border border-gray-400 rounded w-auto font-sans mt-7" style={{width: 'min-content'}}>
                    {renderPrevious()}
                    {renderBody()}
                    {renderNext()}
                </ul>
            </div>
            </SortCallbackContext.Provider>
        </Aux>
    );
};

Paginator.defaultProps = {
    originalData: [],
    columns: [],
    onShowRange: 3,
    textColorClass: 'text-blue-500',
    bgColorClass: 'bg-blue-500',
    hoverBgColorClass: 'bg-blue-500',
    hoverTextColorClass: 'text-white',
    disabledTextColorClass: 'text-gray-800',
    disabledBgColorClass: 'bg-gray-300',
    onPreviousClicked: () => {},
    onNextClicked: () => {},
    onItemClicked: () => {},
};

Paginator.propTypes = {
    originalData: PropTypes.array,
    columns: PropTypes.array,
    //-------------optional↓---------------//
    onShowRange: PropTypes.number,
    onPreviousClicked: PropTypes.func,
    onNextClicked: PropTypes.func,
    onItemClicked: PropTypes.func,
    textColorClass: PropTypes.string,
    bgColorClass: PropTypes.string,
    hoverBgColorClass: PropTypes.string,
    hoverTextColorClass: PropTypes.string,
    disabledTextColorClass: PropTypes.string,
    disabledBgColorClass: PropTypes.string,
};

export default Paginator