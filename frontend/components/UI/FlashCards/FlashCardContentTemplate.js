import React, { useState } from 'react';
import './FlashCard.module.css';
import {isEmpty} from "../../../lib/utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Audio from "../Audio/Audio";
import PropTypes from 'prop-types';
import {faVolumeMute} from "@fortawesome/free-solid-svg-icons/faVolumeMute";
import {faVolumeUp} from "@fortawesome/free-solid-svg-icons/faVolumeUp";

const FlashCardContentTemplate = (props) => {

    let [ isAudioPlaying, setIsAudioPlaying ] = useState(false);
    let [ stopAudioPlaying, setStopAudioPlaying ] = useState(false);

    let renderImage = (imageSrc="", alt="") => {
        if (isEmpty(imageSrc)){
            return "";
        }
        return (
            <img className="w-full object-cover h-48" src={imageSrc} alt={alt} />
            );
    };

    let audioIconClickedHandler = (e) => {
        e.stopPropagation();
        if(isAudioPlaying) {
            setStopAudioPlaying(true);
        }
        setIsAudioPlaying(!isAudioPlaying);
    };

    let renderAudio = (audioSrc) => {
        if(isEmpty(audioSrc)){
          return "";
        }
        let icon = isAudioPlaying ? faVolumeMute : faVolumeUp;
        return (
          <div
              onClick={(e) => {audioIconClickedHandler(e);}}>
              <FontAwesomeIcon icon={icon}/>
              <Audio
                  src={audioSrc}
                  startPlaying={isAudioPlaying}
                  startPausing={!isAudioPlaying}
                  onPlay={()=> {setStopAudioPlaying(false)}}
                  onPause={() => {setStopAudioPlaying(false)}}
                  onEnded={() => {
                      setIsAudioPlaying(false);
                      setStopAudioPlaying(false);
                  }}
              />
          </div>)
    };

    return (
        <div className="rounded overflow-hidden shadow-lg h-full flex justify-center">
            <div className="pb-4 self-center">
                {renderImage(props.image)}
                <div className="font-bold text-xl mb-2 pt-4">{props.title}</div>
                <p className="text-gray-700 text-base">
                    {props.content}
                </p>
                {renderAudio(props.audio)}
            </div>
        </div>
    );
};


FlashCardContentTemplate.propTypes = {
    title: PropTypes.string,
    image: PropTypes.string,
    audio: PropTypes.string,
    content: PropTypes.string,
};

export default FlashCardContentTemplate