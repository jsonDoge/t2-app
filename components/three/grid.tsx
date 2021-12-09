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
  resetSurroundPlotsAfterDescention,
  updateCameraAndLightPositionOnKeyDown,
  updatePlotPositionAfterAscention,
} from './utils';
import Plant from './plant';
import Corn from './corn';
import Potato from './potato';
import Carrot from './carrot';
import Weed from './weed';
import Grass1 from './grass1';

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

  const [
    perspectiveCameraRef,
    setPerspectiveCameraRef,
  ] = useState<THREE.PerspectiveCamera>();

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
  // orthCamera to set shadow limits (to not be cut off)
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
    resetSurroundPlotsAfterDescention(surroundPlotRefs);

    // HANDLING ascended movement
    updatePlotPositionAfterAscention(mainPlotRefs, surroundPlotRefs);
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

    updateCameraAndLightPositionOnKeyDown(state, lightRef, keysDown);
    state.camera.updateProjectionMatrix();
  });

  useLayoutEffect(
    () => set({ camera: perspectiveCameraRef }),
    [perspectiveCameraRef, set],
  );

  const updateWasdStateOnDown = (e: KeyboardEvent) => {
    if (!validKeys.includes(e.code)) { return; }

    const key: string = KEY_CODES[e.code];
    keysDown.current[key] = true;
  };

  const updateWasdStateOnUp = (e: KeyboardEvent) => {
    if (!validKeys.includes(e.code)) { return; }

    const key: string = KEY_CODES[e.code];
    keysDown.current[key] = false;
  };

  const getRand = (min, max) => min + Math.random() * (max - min);

  useEffect(() => {
    window.addEventListener('keypress', updateWasdStateOnDown);
    window.addEventListener('keyup', updateWasdStateOnUp);

    return () => {
      window.removeEventListener('keypress', updateWasdStateOnDown);
      window.removeEventListener('keyup', updateWasdStateOnUp);
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
        ref={setPerspectiveCameraRef}
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
      <Plant position={[4.5, 4, 0.2]} />
      <Corn position={[6.4, 3.9, 0.3]} />
      <Corn position={[5.9, 3.9, 0.3]} />
      <Corn position={[6.9, 3.9, 0.3]} />
      <Potato position={[6.4, 2, 0.3]} />
      <Potato position={[5.9, 2, 0.3]} />
      <Potato position={[6.9, 2, 0.3]} />
      <Carrot position={[6.4, -0.3, 0.24]} />
      <Carrot position={[5.9, -0.3, 0.24]} />
      <Carrot position={[6.9, -0.3, 0.24]} />
      <Weed position={[3.9, -0.5, 0.3]} rotation={[0, 0, 90 * (Math.PI / 180)]} />
      <Weed position={[5, -0.5, 0.3]} rotation={[0, 0, 45 * (Math.PI / 180)]} />
      <Weed position={[4.5, 0.3, 0.3]} />
      {
        (
          new Array(100).fill().map(
            () => (
              <Grass1
                position={[getRand(-20, 20), getRand(-20, 20), 0]}
                rotation={[0, 0, getRand(0, 360) * (Math.PI / 180)]}
              />
            ),
          )
        )
      }
      {
        (
          new Array(10).fill().map(
            () => (
              <>
                <Fern
                  position={[getRand(-20, 20), getRand(-20, 20), 0]}
                  rotation={[0, 0, (Math.round(getRand(0, 4)) * 90) * (Math.PI / 180)]}
                />
                <Tree
                  position={[getRand(-20, 20), getRand(-20, 20), 0]}
                  rotation={[0, 0, (Math.round(getRand(0, 4)) * 90) * (Math.PI / 180)]}
                />
              </>
            ),
          )
        )
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
      <gridHelper
        rotation={[90 * (Math.PI / 180), 0, 0]}
        position={[1.1, 1.1, 0]}
        args={[2100, 1000, '#382A21', '#382A21']}
      />
    </>
  );
};

export default Grid;
