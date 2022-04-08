import "./reactive-canvas-one.scss";
import { useEffect, useState } from "react";
import * as THREE from "three";
import SceneInit from "../../utils/InitScene";
import { vertexShader, fragmentShader } from "../../utils/Shaders";
import { GUI } from "dat.gui";
import fullLogo from "../../assets/logos/full-logo.svg";
//*Component Imports
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { AudioUploader } from "../AudioUploader/AudioUploader";
import { AudioMicrophone } from "../AudioMicrophone/AudioMicrophone";
import { ShapeSelector } from "../ShapeSelector/ShapeSelector";
import { Instructions } from "../Instructions/Instructions";

let test, audioContext, audioElement, dataArray, analyser, source, gui;
export default function ReactiveCanvasOne() {
  //*state
  const [componentState, setComponentState] = useState("player");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);

  const togglePlay = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
  };

  const clearGui = () => {
    let myGuiContainer = document.getElementById("myGui");
    myGuiContainer.innerHTML = "";
  };

  const selectShape = (shape) => {
    setCurrentShape(shape);
  };

  const renderSwitch = (componentState) => {
    switch (componentState) {
      case "player":
        return (
          <AudioPlayer
            togglePlay={togglePlay}
            setComponentState={setComponentState}
          />
        );
      case "upload":
        return <AudioUploader setComponentState={setComponentState} />;
      case "microphone":
        return <AudioMicrophone setComponentState={setComponentState} />;
      default:
        return (
          <AudioPlayer
            togglePlay={togglePlay}
            setComponentState={setComponentState}
          />
        );
    }
  };

  const initGui = () => {
    gui = new GUI({ autoPlace: false });
    gui.domElement.id = "gui";
    let myGuiContainer = document.getElementById("myGui");
    myGuiContainer.appendChild(gui.domElement);
  };

  const setupAudioContext = () => {
    audioElement = document.getElementById("myAudio");
    audioContext = new window.AudioContext();
    source = audioContext.createMediaElementSource(audioElement);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 1024;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  };

  const render = (uniforms) => {
    //* note: update audio data
    analyser.getByteFrequencyData(dataArray);

    //* note: update uniforms
    uniforms.u_data_arr.value = dataArray;

    //* note: call render function on every animation frame
    requestAnimationFrame(() => {
      render(uniforms);
    });
  };

  const play = () => {
    if (audioContext === undefined) {
      setupAudioContext();
    }

    //*Dynamically passes data to the shaders
    const uniforms = {
      u_amplitude: {
        type: "f",
        value: 20.0,
      },
      u_data_arr: {
        type: "float[64]",
        value: dataArray,
      },
      u_color_r: {
        type: "f",
        value: 32.0,
      },
      u_color_g: {
        type: "f",
        value: 32.0,
      },
      u_color_b: {
        type: "f",
        value: 32.0,
      },
    };

    //*Different Shapes
    const choseShape = (currentShape) => {
      switch (currentShape) {
        case "sphere":
          return new THREE.SphereGeometry(64, 64, 64);
        case "plane":
          return new THREE.PlaneGeometry(64, 64, 64, 64);
        case "torus":
          return new THREE.TorusGeometry(64, 20, 10, 100);
        default:
          return "none";
      }
    };

    const planeGeometry = choseShape(currentShape);

    const planeCustomMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms, //* This is the info that causes changes to the shaders. In this case, Data array and time
      vertexShader: vertexShader(),
      fragmentShader: fragmentShader(),
      wireframe: true,
    });

    const planeMesh = new THREE.Mesh(planeGeometry, planeCustomMaterial);
    planeMesh.rotation.x = -Math.PI / 2 + Math.PI / 4;
    planeMesh.scale.x = 2;
    planeMesh.scale.y = 2;
    planeMesh.scale.z = 0.5;
    planeMesh.position.y = 8;
    test.scene.add(planeMesh);

    clearGui();
    initGui();
    //*AUDIO
    const audioWaveGui = gui.addFolder("audio");
    audioWaveGui
      .add(uniforms.u_amplitude, "value", 1.0, 100.0)
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
    color.add(uniforms.u_color_r, "value", 0.0, 250.0).name("R").listen();
    color.add(uniforms.u_color_g, "value", 0.0, 250.0).name("G").listen();
    color.add(uniforms.u_color_b, "value", 0.0, 250.0).name("B").listen();
    if (isPlaying) {
      render(uniforms);
    }
  };

  //*component did update
  useEffect(() => {
    test = new SceneInit("myThreeJsCanvas");
    test.initScene();
    test.animate();

    if (currentShape) {
      play();
    }
  }, [currentShape, isPlaying]);

  return (
    <>
      <div className="reactive-canvas__controls">
        <div className="reactive-canvas__logo-card">
          <img
            className="reactive-canvas__logo"
            src={fullLogo}
            alt="SoundSauce Logo"
          />
        </div>
        <ShapeSelector currentShape={currentShape} selectShape={selectShape} />
        {!currentShape && <Instructions instruction={"shape"} />}
        {currentShape && renderSwitch(componentState)}
        {audioContext === undefined && <Instructions instruction={"audio"} />}
        <div id="myGui" className="reactive-canvas__gui"></div>
      </div>
      <div className="reactive-canvas__container" id="canvas-container">
        <canvas id="myThreeJsCanvas"></canvas>
      </div>
    </>
  );
}
