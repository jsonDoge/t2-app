/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
import React, {
  useRef, useState, useLayoutEffect, useEffect, createRef,
} from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import Tree from './tree';
import Fern from './fern';
import {
  ascendDescendPlots,
  fillGridPositions,
  fillSurroundRowPositions,
  generateMainGrid,
  generateSurroundRows,
} from './utils';

const KEY_CODES = {
  KeyW: 'w',
  KeyS: 's',
  KeyA: 'a',
  KeyD: 'd',
};

const gridSize = 7;

const validKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];

const Grid: React.FC<{}> = () => {
  const { size, set, scene } = useThree();
  const planeRef = useRef();
  const lightRef = useRef();
  const orthCameraRef = useRef();

  const mainPlotRefs = generateMainGrid(gridSize);
  const surroundPlotRefs = generateSurroundRows(gridSize);

  const [ref, setRef] = useState<THREE.PerspectiveCamera>();

  const cameraPlotDeviation = useRef({ x: 0, y: 0 });
  const keysDown = useRef({
    w: false, a: false, s: false, d: false,
  });

  const updateGrid = (
    deviationX: number,
    deviationY: number,
    surroundRefs: Array<Array<THREE.Mesh>>,
  ): void => {
    if (deviationY > 0) {
      surroundRefs[1].forEach((c) => {
        c.current.isAscending = true;
        c.current.castShadow = true;
      });
    } else if (deviationY < 0) {
      surroundRefs[0].forEach((c) => {
        c.current.isAscending = true;
        c.current.castShadow = true;
      });
    }

    if (deviationX > 0) {
      surroundRefs[3].forEach((c) => {
        c.current.isAscending = true;
        c.current.castShadow = true;
      });
    } else if (deviationX < 0) {
      surroundRefs[2].forEach((c) => {
        c.current.isAscending = true;
        c.current.castShadow = true;
      });
    }
  };

  useEffect(() => {
    fillGridPositions(mainPlotRefs, gridSize);
    fillSurroundRowPositions(surroundPlotRefs, gridSize + 2);
  }, []);

  // add target for manipulation
  useEffect(() => {
    scene.add(lightRef.current.target);
    orthCameraRef.current.left = -20;
    orthCameraRef.current.right = 20;
    orthCameraRef.current.top = 20;
    orthCameraRef.current.bottom = -20;
    orthCameraRef.current.near = 0.1;
    orthCameraRef.current.far = 2000;
    lightRef.current.shadow.camera = orthCameraRef.current;
  }, []);

  // ascention/descention
  useFrame(() => {
    ascendDescendPlots(mainPlotRefs);
    ascendDescendPlots(surroundPlotRefs);
  });

  // move plots after rise/lower animation finished
  useFrame(() => {
    if (surroundPlotRefs[0][0].current.isDescended) {
      surroundPlotRefs[0].forEach((c) => {
        c.current.isDescended = false;
        c.current.castShadow = false;
      });
    } else if (surroundPlotRefs[1][0].current.isDescended) {
      surroundPlotRefs[1].forEach((c) => {
        c.current.isDescended = false;
        c.current.castShadow = false;
      });
    } else if (surroundPlotRefs[2][0].current.isDescended) {
      surroundPlotRefs[2].forEach((c) => {
        c.current.isDescended = false;
        c.current.castShadow = false;
      });
    } else if (surroundPlotRefs[3][0].current.isDescended) {
      surroundPlotRefs[3].forEach((c) => {
        c.current.isDescended = false;
        c.current.castShadow = false;
      });
    }

    // HANDLING ascended movement
    if (surroundPlotRefs[0][0].current.isAscended) {
      // move all main grid down
      mainPlotRefs.forEach((r) => r.forEach((c) => {
        c.current.position.y -= 2.1;
      }));

      surroundPlotRefs[1].forEach((c) => {
        c.current.position.z = 0.12;
        c.current.position.y -= 2.1;
        c.current.isDescending = true;
        c.current.castShadow = true;
      });

      surroundPlotRefs[0].forEach((c) => {
        c.current.position.z = -0.12;
        c.current.position.y -= 2.1;
        c.current.isAscended = false;
        c.current.castShadow = false;
      });

      [...surroundPlotRefs[2], ...surroundPlotRefs[3]].forEach((c) => {
        c.current.position.y -= 2.1;
      });
    } else if (surroundPlotRefs[1][0].current.isAscended) {
      // move all main grid up
      mainPlotRefs.forEach((r) => r.forEach((c) => {
        c.current.position.y += 2.1;
      }));

      surroundPlotRefs[0].forEach((c) => {
        c.current.position.z = 0.12;
        c.current.position.y += 2.1;
        c.current.castShadow = true;
        c.current.isDescending = true;
      });

      surroundPlotRefs[1].forEach((c) => {
        c.current.position.z = -0.12;
        c.current.position.y += 2.1;
        c.current.isAscended = false;
        c.current.castShadow = false;
      });

      [...surroundPlotRefs[2], ...surroundPlotRefs[3]].forEach((c) => {
        c.current.position.y += 2.1;
      });
    } else if (surroundPlotRefs[2][0].current.isAscended) {
      // move all main grid left
      mainPlotRefs.forEach((r) => r.forEach((c) => {
        c.current.position.x -= 2.1;
      }));

      surroundPlotRefs[3].forEach((c) => {
        c.current.position.z = 0.12;
        c.current.position.x -= 2.1;
        c.current.castShadow = true;
        c.current.isDescending = true;
      });

      surroundPlotRefs[2].forEach((c) => {
        c.current.position.z = -0.12;
        c.current.position.x -= 2.1;
        c.current.isAscended = false;
        c.current.castShadow = false;
      });

      [...surroundPlotRefs[0], ...surroundPlotRefs[1]].forEach((c) => {
        c.current.position.x -= 2.1;
      });
    } else if (surroundPlotRefs[3][0].current.isAscended) {
      // move all main grid right
      mainPlotRefs.forEach((r) => r.forEach((c) => {
        c.current.position.x += 2.1;
      }));

      surroundPlotRefs[2].forEach((c) => {
        c.current.position.z = 0.12;
        c.current.position.x += 2.1;
        c.current.isDescending = true;
        c.current.castShadow = true;
      });

      surroundPlotRefs[3].forEach((c) => {
        c.current.position.z = -0.12;
        c.current.position.x += 2.1;
        c.current.isAscended = false;
        c.current.castShadow = false;
      });

      [...surroundPlotRefs[0], ...surroundPlotRefs[1]].forEach((c) => {
        c.current.position.x += 2.1;
      });
    }
  });

  useFrame((state) => {
    const cameraPlotDeviationX = Math.floor((state.camera.position.x - 10) / 2.1);
    const cameraPlotDevationY = Math.floor((state.camera.position.y - 8.5) / 2.1);

    if (cameraPlotDeviation.current.x !== cameraPlotDeviationX
      || cameraPlotDeviation.current.y !== cameraPlotDevationY) {
      updateGrid(
        cameraPlotDeviationX - cameraPlotDeviation.current.x,
        cameraPlotDevationY - cameraPlotDeviation.current.y,
        surroundPlotRefs,
      );
      cameraPlotDeviation.current.y = cameraPlotDevationY;
      cameraPlotDeviation.current.x = cameraPlotDeviationX;
    }

    if (keysDown.current.w) {
      state.camera.position.y += 0.075;
      state.camera.position.x -= 0.075;
      lightRef.current.position.y += 0.075;
      lightRef.current.position.x -= 0.075;
      lightRef.current.target.position.y += 0.075;
      lightRef.current.target.position.x -= 0.075;
    }

    if (keysDown.current.s) {
      state.camera.position.y -= 0.075;
      state.camera.position.x += 0.075;
      lightRef.current.position.y -= 0.075;
      lightRef.current.position.x += 0.075;
      lightRef.current.target.position.y -= 0.075;
      lightRef.current.target.position.x += 0.075;
    }

    if (keysDown.current.a) {
      state.camera.position.y -= 0.075;
      state.camera.position.x -= 0.075;
      lightRef.current.position.y -= 0.075;
      lightRef.current.position.x -= 0.075;
      lightRef.current.target.position.y -= 0.075;
      lightRef.current.target.position.x -= 0.075;
    }

    if (keysDown.current.d) {
      state.camera.position.y += 0.075;
      state.camera.position.x += 0.075;
      lightRef.current.position.y += 0.075;
      lightRef.current.position.x += 0.075;
      lightRef.current.target.position.y += 0.075;
      lightRef.current.target.position.x += 0.075;
    }

    state.camera.updateProjectionMatrix();
  });

  useLayoutEffect(() => set({ camera: ref }), [ref, set]);

  const handleDownWasd = (e: KeyboardEvent) => {
    if (!validKeys.includes(e.code)) { return; }

    const key: string = KEY_CODES[e.code];
    keysDown.current[key] = true;
  };

  const handleUpWasd = (e: KeyboardEvent) => {
    if (!validKeys.includes(e.code)) { return; }

    const key: string = KEY_CODES[e.code];
    keysDown.current[key] = false;
  };

  useEffect(() => {
    window.addEventListener('keypress', handleDownWasd);
    window.addEventListener('keyup', handleUpWasd);

    return () => {
      window.removeEventListener('keypress', handleDownWasd);
      window.removeEventListener('keyup', handleUpWasd);
    };
  }, []);

  return (
    <>
      <ambientLight
        intensity={0.05}
      />
      <directionalLight
        ref={lightRef}
        intensity={0.4}
        color="#FDF3c6"
        castShadow
        distance={100}
        position={[120, 80, 60, 0, 100]}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
        shadow-radius={2}
      />
      <orthographicCamera
        ref={orthCameraRef}
      />
      <perspectiveCamera
        ref={setRef}
        aspect={size.width / size.height}
        fov={65}
        position={[10, -8.5, 10]}
        near={1}
        far={10000}
        rotation={[30 * (Math.PI / 180), 30 * (Math.PI / 180), 40 * (Math.PI / 180)]}
        onUpdate={(self: any) => self.updateProjectionMatrix()}
      />
      {
        mainPlotRefs.map((r) => r.map((c) => (
          <mesh
            ref={c}
            castShadow
            receiveShadow
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
        )))
      }
      {
        surroundPlotRefs.map((r) => r.map((c) => (
          <mesh
            ref={c}
            castShadow
            receiveShadow
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
        )))
      }
      <Fern />
      <Tree position={[5, 10, 0]} />
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

export default Grid;
