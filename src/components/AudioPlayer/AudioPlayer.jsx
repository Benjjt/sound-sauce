import React from "react";
import "../AudioPlayer/audio-player.scss";
import { BsUpload } from "react-icons/bs";
import { BsFillMicFill } from "react-icons/bs";
import testMusic from "../../assets/Music/test-audio2.mp3";
import RickRoll from "../../assets/Music/RickRoll.mp3";

const AudioPlayer = ({ togglePlay, setComponentState }) => {
  return (
    <div className="audio-player">
      <div className="audio-player__options">
        <BsUpload
          onClick={() => setComponentState("upload")}
          className="audio-player__icon"
        />
        <BsFillMicFill
          onClick={() => setComponentState("microphone")}
          className="audio-player__icon"
        />
      </div>
      <div className="audio-player__container">
        <audio
          id="myAudio"
          controls
          onPlay={togglePlay}
          onPause={togglePlay}
          src={testMusic}
        ></audio>
      </div>
    </div>
  );
};

export default AudioPlayer;
