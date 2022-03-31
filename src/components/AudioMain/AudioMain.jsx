import React, { useState } from "react";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { AudioUploader } from "../AudioUploader/AudioUploader";
import { AudioMicrophone } from "../AudioMicrophone/AudioMicrophone";

export const AudioMain = () => {
  const [componentState, setComponentState] = useState("player");

  const renderSwitch = (componentState) => {
    switch (componentState) {
      case "player":
        return <AudioPlayer setComponentState={setComponentState} />;
      case "upload":
        return <AudioUploader setComponentState={setComponentState} />;
      case "microphone":
        return <AudioMicrophone setComponentState={setComponentState} />;
      default:
        return <AudioPlayer setComponentState={setComponentState} />;
    }
  };

  return <>{renderSwitch(componentState)}</>;
};
