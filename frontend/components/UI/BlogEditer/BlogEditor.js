import React, {useEffect, useRef} from 'react';
import Head from 'next/head';
import Aux from "../../../hoc/Aux/Aux";
import dynamic from 'next/dynamic'
import PackmanSpinner from "../Spinner/PackmanSpinner";
import PropTypes from 'prop-types';
import {BLOG_EDITOR_OPTIONS} from "../../../constants";
import {isEmpty} from "../../../lib/utils";
import {debounce} from 'lodash';

const SunEditor = dynamic(
    () => import('suneditor-react'),
    { ssr: false, loading: () => <PackmanSpinner/> }
);

const BlogEditor = (props) => {

    // make sure that this function is created just once with useRef
    // wait for 0.5 seconds and execute only once.
    let onChangeDebounced = useRef(debounce((newValue) => {
        props.onChangeCallback(newValue)
    }, 500));

    let onChangeHandler = (content) => {
        onChangeDebounced.current(content);
    };

    let onLoadHandler = () => {
        props.onLoadCallback();
    };

    let editorOptions = () => {
        let originalOptions = BLOG_EDITOR_OPTIONS;
        if(!isEmpty(props.height)){
            originalOptions.height = props.height;
        }
        return originalOptions;
    };

    return (
        <Aux>
            <Head>
                <link href="/css/suneditor.min.css" rel="stylesheet" />
            </Head>
            <div className="mx-10 my-10 w-full">
                <SunEditor
                    setOptions={editorOptions()}
                    showToolbar={true}
                    placeholder="Please type here ..."
                    onChange={onChangeHandler}
                    onLoad={onLoadHandler}
                    name={props.name}
                    height={props.height}
                    ref={props.reference}
                />
            </div>
        </Aux>
    );
};
BlogEditor.defaultProps = {
    name: 'sun-editor',
    height: 200,
    onChangeCallback: () => {},
    onLoadCallback: () => {},
};

BlogEditor.propTypes = {
    name: PropTypes.string,
    height: PropTypes.number,
    onChangeCallback: PropTypes.func,
    onLoadCallback: PropTypes.func,
    reference: PropTypes.any
};

export default BlogEditor