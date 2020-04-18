import React, {useEffect} from 'react';
import Head from 'next/head';
import Aux from "../../../hoc/Aux/Aux";
import dynamic from 'next/dynamic'
import PackmanSpinner from "../Spinner/PackmanSpinner";
import PropTypes from 'prop-types';
import {BLOG_EDITOR_OPTIONS} from "../../../constants";

const SunEditor = dynamic(
    () => import('suneditor-react'),
    { ssr: false, loading: () => <PackmanSpinner/> }
);

const BlogEditor = (props) => {

    let onChangeHandler = (content) => {
        props.onChangeCallback(content);
    };

    let onLoadHandler = () => {
        props.onLoadCallback();
    };

    return (
        <Aux>
            <Head>
                <link href="/css/suneditor.min.css" rel="stylesheet" />
            </Head>
            <div className="mx-10 my-10">
                <SunEditor
                    setOptions={BLOG_EDITOR_OPTIONS}
                    showToolbar={true}
                    placeholder="Please type here ..."
                    onChange={onChangeHandler}
                    onLoad={onLoadHandler}
                />
            </div>
        </Aux>
    );
};
BlogEditor.defaultProps = {
    onChangeCallback: () => {},
    onLoadCallback: () => {},
};

BlogEditor.propTypes = {
    onChangeCallback: PropTypes.func,
    onLoadCallback: PropTypes.func,
};

export default BlogEditor