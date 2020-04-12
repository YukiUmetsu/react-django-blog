import React, {useEffect} from "react";
import ReactAudioPlayer from 'react-audio-player';
import PropTypes from 'prop-types';

const Audio = (props) => {

    useEffect(() => {
        let player = document.querySelector(`#${props.id}`);
        if(props.startPlaying){
            player.play();
        } else if(props.startPausing){
            player.pause();
        }
    },[props.startPlaying]);

    let onEndedHandler = () => {
        props.onEnded();
    };

    return (
        <ReactAudioPlayer
            {...props}
            children={props.children}
            onEnded={onEndedHandler}
            controls={props.controls}
        />
    );
};

Audio.defaultProps = {
    autoPlay: false,
    controls: false,
    className: '',
    crossOrigin: '', // CORS: use-credentials, anonymous or ""
    muted: false,
    volume: 1.0,
    loop: false,
    src: "",
    id: "react-audio-player",
};

Audio.propTypes = {
    autoPlay: PropTypes.bool,
    controls: PropTypes.bool,
    className: PropTypes.string,
    crossOrigin: PropTypes.string, // CORS: use-credentials, anonymous or ""
    muted: PropTypes.bool,
    volume: PropTypes.number,
    loop: PropTypes.bool,
    src: PropTypes.string,
    id: PropTypes.string,
    onEnded: PropTypes.func,
    onError: PropTypes.func,
    onPause: PropTypes.func,
    onPlay: PropTypes.func,
    children: PropTypes.element,
    startPlaying: PropTypes.bool,
    startPausing: PropTypes.bool,
};

export default Audio