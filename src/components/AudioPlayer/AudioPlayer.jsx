import React, { useState, useRef, useEffect } from "react";
import "../AudioPlayer/audio-player.scss";
import { BsArrowLeftShort } from "react-icons/bs";
import { BsArrowRightShort } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import testMusic from "../../assets/Music/test-audio.mp3";

const AudioPlayer = () => {
  //*state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  //*references
  const audioPlayer = useRef(); //* reference our audio component
  const progressBar = useRef(); //* reference to progress bar
  const animationRef = useRef(); //*reference the animation

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes} : ${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backThirty = () => {
    progressBar.current.value = Number(progressBar.current.value - 30);
    changeRange();
  };

  const forwardThirty = () => {
    progressBar.current.value = Number(progressBar.current.value + 30);
    changeRange();
  };

  return (
    <div className="audio-player">
      <audio ref={audioPlayer} src={testMusic}></audio>
      <button onClick={backThirty} className="audio-player__forward-backward">
        <BsArrowLeftShort /> 30
      </button>
      <button className="audio-player__play-pause" onClick={togglePlayPause}>
        {isPlaying ? <FaPause /> : <FaPlay className="audio-player__play" />}
      </button>
      <button
        onClick={forwardThirty}
        className="audio-player__forward-backward"
      >
        <BsArrowRightShort /> 30
      </button>

      {/* {CURRENT TIME} */}
      <div className="audio-player__current-time">
        {calculateTime(currentTime)}
      </div>

      {/* {PROGRESS BAR} */}
      <div>
        <input
          type="range"
          className="audio-player__progress"
          defaultValue="0"
          ref={progressBar}
          onChange={changeRange}
        />
      </div>

      {/* {DURATION} */}
      <div className="audio-player__duration">
        {duration && !isNaN(duration) && calculateTime(duration)}
      </div>
    </div>
  );
};

export default AudioPlayer;
