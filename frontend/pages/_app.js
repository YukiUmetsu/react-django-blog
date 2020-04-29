import React from 'react'
import App from 'next/app'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
import '../assets/styles/style.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
import 'react-datepicker/dist/react-datepicker.css';
import Router from 'next/router';

class Blog extends App {

    state = { isPageLoading: false };

    componentDidMount() {
        Router.events.on('routeChangeStart', () => {
            this.setState({ isPageLoading: true });
        });

        Router.events.on('routeChangeComplete', () => {
            this.setState({ isPageLoading: false });
        });

        Router.events.on('routeChangeError', () => {
            this.setState({ isPageLoading: false });
        });
    }

    componentWillUnmount() {
        Router.events.off('routeChangeStart', this.setState({ isPageLoading: false}))
    }

    render() {
        const { Component, pageProps } = this.props;
        return <Component {...pageProps} isPageLoading={this.state.isPageLoading} />
    }
}

export default Blog