import "./reactive-canvas-one.scss";
import { useEffect, useState } from "react";
import * as THREE from "three";
import SceneInit from "../../utils/InitScene";
import { vertexShader, fragmentShader } from "../../utils/Shaders";
import { GUI } from "dat.gui";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { AudioUploader } from "../AudioUploader/AudioUploader";
import { AudioMicrophone } from "../AudioMicrophone/AudioMicrophone";
import soundsauce from "../../assets/logos/sound-sauce.svg";

export default function ReactiveCanvasOne() {
  let test, audioContext, audioElement, dataArray, analyser, source, gui;

  //*state
  const [componentState, setComponentState] = useState("player");
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      play();
    } else {
    }
  };

  const renderSwitch = (componentState) => {
    switch (componentState) {
      case "player":
        return (
          <AudioPlayer
            play={play}
            togglePlay={togglePlay}
            setComponentState={setComponentState}
          />
        );
      case "upload":
        return <AudioUploader setComponentState={setComponentState} />;
      case "microphone":
        return <AudioMicrophone setComponentState={setComponentState} />;
      default:
        return <AudioPlayer setComponentState={setComponentState} />;
    }
  };

  const initGui = () => {
    gui = new GUI({ autoPlace: false });
    gui.domElement.id = "gui";
    let myGuiContainer = document.getElementById("myGui");
    myGuiContainer.appendChild(gui.domElement);
  };

  const setupAudioContext = () => {
    audioContext = new window.AudioContext();
    audioElement = document.getElementById("myAudio");
    source = audioContext.createMediaElementSource(audioElement);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 1024;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  };

  const play = async () => {
    if (audioContext === undefined) {
      setupAudioContext();
    }

    const uniforms = {
      u_time: {
        type: "f",
        value: 1.0,
      },
      u_amplitude: {
        type: "f",
        value: 3.0,
      },
      u_data_arr: {
        type: "float[64]",
        value: dataArray,
      },
      u_color_r: { type: "f", value: 32.0 },
    };

    //*Different Shapes
    const planeGeometry = new THREE.TorusGeometry(50, 20, 10, 100);
    // const planeGeometry = new THREE.BoxGeometry(64, 64, 8, 64, 64, 8);
    // const planeGeometry = new THREE.SphereGeometry(16, 64, 64);
    // const planeGeometry = new THREE.PlaneGeometry(64, 64, 64, 64);
    const planeCustomMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms, //* This is the info that causes changes to the shaders. In this case, Data array and time
      vertexShader: vertexShader("sin", "50.0"),
      fragmentShader: fragmentShader(),
      wireframe: true,
    });

    const planeMesh = new THREE.Mesh(planeGeometry, planeCustomMaterial);
    planeMesh.rotation.x = -Math.PI / 2 + Math.PI / 4;
    planeMesh.scale.x = 2;
    planeMesh.scale.y = 2;
    planeMesh.scale.z = 2;
    planeMesh.position.y = 8;
    test.scene.add(planeMesh);

    if (gui === undefined) {
      initGui();
      //*AUDIO
      const audioWaveGui = gui.addFolder("audio");
      audioWaveGui
        .add(uniforms.u_amplitude, "value", 1.0, 50.0)
        .name("amplitude")
        .listen();

      //*SHAPE RESPONSE
      const shapeResponse = gui.addFolder("shape");
      shapeResponse
        .add(planeCustomMaterial, "wireframe")
        .name("wireframe")
        .listen();

      //*COLOURS
      const color = gui.addFolder("colour");
      color.add(uniforms.u_color_r, "value", 0.0, 100.0).name("R").listen();
    }

    const render = (time) => {
      //* note: update audio data
      analyser.getByteFrequencyData(dataArray);

      //* note: update uniforms
      uniforms.u_time.value = time;
      uniforms.u_data_arr.value = dataArray;

      //* note: call render function on every animation frame
      console.log(dataArray);
      requestAnimationFrame(render);
    };

    render();
  };

  useEffect(() => {
    test = new SceneInit("myThreeJsCanvas");
    test.initScene();
    test.animate();
  }, []);

  return (
    <>
      <div className="reactive-canvas__controls">
        <div className="reactive-canvas__logo-card">
          <img
            className="reactive-canvas__logo"
            src={soundsauce}
            alt="SoundSauce Logo"
          />
        </div>
        {renderSwitch(componentState)}
        <div id="myGui" className="reactive-canvas__gui"></div>
      </div>
      <div className="reactive-canvas__container" id="canvas-container">
        <canvas id="myThreeJsCanvas"></canvas>
      </div>
    </>
  );
}
