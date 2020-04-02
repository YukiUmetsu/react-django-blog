import React from 'react';
import {DUMMY_CATEGORY_DROPDOWN_ITEMS, SORT_BY_DROPDOWN_ITEMS} from "../../../constants";
import Dropdown from "../Dropdown/Dropdown";

const PostFilterDropdown = (props) => {
    return (
        <div className="flex mx-auto justify-center">
            <div className="inline-flex justify-center">
                <div className="flex-1">
                    <Dropdown {...DUMMY_CATEGORY_DROPDOWN_ITEMS}/>
                </div>
                <div className="flex-1">
                    <Dropdown {...SORT_BY_DROPDOWN_ITEMS}/>
                </div>
            </div>
        </div>
    );
};

export default PostFilterDropdown