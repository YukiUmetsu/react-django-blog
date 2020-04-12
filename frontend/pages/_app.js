import React from 'react'
import App from 'next/app'
import '../assets/styles/style.css'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

import { faChess, faNewspaper, faSearch, faPaperPlane, faAngleDown, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons'
import { faYoutube, faFacebook, faInstagram, faHtml5 } from '@fortawesome/free-brands-svg-icons'

library.add(faYoutube, faFacebook, faInstagram, faChess, faNewspaper, faSearch, faPaperPlane, faHtml5, faAngleDown, faVolumeUp, faVolumeMute);

class Blog extends App {
    render() {
        const { Component, pageProps } = this.props
        return <Component {...pageProps} />
    }
}

export default Blog