import "./reactive-canvas-one.scss";
import { useEffect } from "react";
import * as THREE from "three";
import SceneInit from "../../utils/InitScene";
import testAudio from "../../assets/Music/test-audio.mp3";
import { vertexShader, fragmentShader } from "../../utils/Shaders";

export default function ReactiveCanvasOne() {
  let test, audioContext, audioElement, dataArray, analyser, source;

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
    };

    //*GUI

    //*Different Shapes
    // const planeGeometry = new THREE.BoxGeometry(64, 64, 8, 64, 64, 8);
    const planeGeometry = new THREE.SphereGeometry(16, 64, 64);
    // const planeGeometry = new THREE.PlaneGeometry(64, 64, 64, 64);

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
    planeMesh.scale.z = 2;
    planeMesh.position.y = 8;
    test.scene.add(planeMesh);

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
    <div>
      <div className="audio-player">
        <audio id="myAudio" src={testAudio} controls autoPlay onPlay={play} />
      </div>
      <canvas id="myThreeJsCanvas"></canvas>
    </div>
  );
}
