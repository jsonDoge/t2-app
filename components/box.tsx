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

const coordinates = [
  [0, 0],
  [2.1, 2.1],
  [2.1, -2.1],
  [-2.1, 2.1],
  [-2.1, -2.1],
  [2.1, 0],
  [0, 2.1],
  [0, -2.1],
  [-2.1, 0],
];

const validKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];

const Box: React.FC<{}> = () => {
  const { size, set } = useThree();
  const planeRef = useRef();
  const [ref, setRef] = useState<THREE.PerspectiveCamera>();

  const keysDown = useRef({
    w: false, a: false, s: false, d: false,
  });

  useFrame((state) => {
    if (keysDown.current.w) {
      state.camera.position.y += 0.075;
      state.camera.position.x -= 0.075;
    }
    if (keysDown.current.s) {
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
      <pointLight
        intensity={3}
        color="#FDF3c6"
        castShadow
        distance={100}
        position={[30, 30, 20]}
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
      />
      <perspectiveCamera
        ref={setRef}
        aspect={size.width / size.height}
        fov={55}
        position={[-2, 1, 7]}
        near={0.1}
        far={100}
        rotation={[40 * (Math.PI / 180), 40 * (Math.PI / 180), 40 * (Math.PI / 180)]}
        onUpdate={(self: any) => self.updateProjectionMatrix()}
      />
      {
        coordinates.map((c) => (
          <mesh
            position={[...c, 0.1]}
            castShadow
            receiveShadow={false}
            onPointerOver={(self) => {
              self.eventObject.material.color = {
                r: 0.2578125, g: 0.74609375, b: 0.34765625,
              };
            }}
            onPointerOut={(self) => {
              self.eventObject.material.color = {
                r: 0.19806931954941637, g: 0.5332764040016892, b: 0.24620132669705552,
              };
            }}
          >
            <boxGeometry args={[2, 2, 0.2]} />
            <meshStandardMaterial color="#7BC188" />
          </mesh>
        ))
      }

      <mesh
        ref={planeRef}
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry
          args={[10000, 10000]}
        />
        <meshStandardMaterial
          color="#DCAB80"
        />
      </mesh>
    </>
  );
};

export default Box;
