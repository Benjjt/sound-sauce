const vertexShader = (option, floatValue) => {
  return `
      varying float x;
      varying float y;
      varying float z;
      varying vec3 vUv;

      uniform float u_time;
      uniform float u_amplitude;
      uniform float[64] u_data_arr;

      void main() {
        vUv = position;

        x = abs(position.x);
	      y = abs(position.y);

        float floor_x = round(x);
	      float floor_y = round(y);

        float x_multiplier = (32.0 - x) / 8.0;
        float y_multiplier = (32.0 - y) / 8.0;

      
        z = ${option}(u_data_arr[int(floor_x)] / ${floatValue} + u_data_arr[int(floor_y)] /${floatValue} ) * u_amplitude; //musicaly reactive standard wave
     

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, z, 1.0);
      }
    `;
};

const fragmentShader = () => {
  return `
    varying float x;
    varying float y;
    varying float z;
    varying vec3 vUv;

    uniform float u_time;
    

    void main() {
      

      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      if (vUv.x < 0.0) {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
      } else {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
      gl_FragColor = vec4(abs(sin(u_time * .001)), 0.0, 0.0, 1.0);
      gl_FragColor = vec4((32.0 - abs(x)) / 32.0, (32.0 - abs(y)) / 32.0, (abs(x + y) / 2.0) / 32.0, 1.0);
    }
  `;
};

export { vertexShader, fragmentShader };
