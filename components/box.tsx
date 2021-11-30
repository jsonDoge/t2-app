/* eslint-disable no-param-reassign */
import React, {
  useRef, useState, useLayoutEffect, useEffect,
} from 'react';
import { useThree, useFrame } from '@react-three/fiber';

const KEY_CODES = {
  KeyW: 'w',
  KeyS: 's',
  KeyA: 'a',
  KeyD: 'd',
};

const validKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];

const Box: React.FC<{}> = () => {
  const { size, set } = useThree();
  const boxRef = useRef();
  const planeRef = useRef();
  const [ref, setRef] = useState<THREE.PerspectiveCamera>();

  const keysDown = useRef({
    w: false, a: false, s: false, d: false,
  });

  useFrame((state) => {
    if (keysDown.current.w) {
      // state.camera.position.z -= 0.1;
      state.camera.position.y += 0.075;
      state.camera.position.x -= 0.075;
    }
    if (keysDown.current.s) {
      // state.camera.position.z += 0.1;
      state.camera.position.y -= 0.075;
      state.camera.position.x += 0.075;
    }
    if (keysDown.current.a) {
      state.camera.position.y -= 0.075;
      state.camera.position.x -= 0.075;
    }
    if (keysDown.current.d) {
      state.camera.position.y += 0.075;
      state.camera.position.x += 0.075;
    }
    state.camera.updateProjectionMatrix();
  });

  useLayoutEffect(() => set({ camera: ref }), [ref, set]);

  const handleDownWasd = (e: KeyboardEvent) => {
    console.log('KEY DOWN', e.code);
    if (!validKeys.includes(e.code)) { return; }

    const key = KEY_CODES[e.code];

    keysDown.current[key] = true;
  };

  const handleUpWasd = (e: KeyboardEvent) => {
    if (!validKeys.includes(e.code)) { return; }

    const key = KEY_CODES[e.code];

    keysDown.current[key] = false;
  };

  useEffect(() => {
    console.log();
    window.addEventListener('keypress', handleDownWasd);
    window.addEventListener('keyup', handleUpWasd);

    return () => {
      window.removeEventListener('keypress', handleDownWasd);
      window.removeEventListener('keyup', handleUpWasd);
    };
  }, []);

  return (
    <>
      <pointLight intensity={0.4} color="yellow" position={[5, 0, 20]} />
      <perspectiveCamera
        ref={setRef}
        aspect={size.width / size.height}
        fov={55}
        position={[-2, 1, 7]}
        near={0.1}
        far={100}
        rotation={[45 * (Math.PI / 180), 45 * (Math.PI / 180), 35 * (Math.PI / 180)]}
        onUpdate={(self: any) => self.updateProjectionMatrix()}
      />
      <mesh
        ref={boxRef}
        position={[0, 0, 5]}
      >
        <boxGeometry args={[0, 1, 1]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <mesh
        ref={planeRef}
        rotation={[0, 0, 0]}
        position={[0, -2, 0]}
      >
        <planeGeometry
          args={[15, 15]}
          // side={THREE.DoubleSide}
        />
        <meshStandardMaterial
          color="#A0785A"
        />
      </mesh>
    </>
  );
};

export default Box;
