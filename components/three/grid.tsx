/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
import React, {
  useRef, useLayoutEffect, useEffect, createRef,
} from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';

// Objects
import Tree from './tree';
import Fir from './fir';
import Corn from './corn';
import Potato from './potato';
import Carrot from './carrot';
import Weed from './weed';
import Grass1 from './grass1';

// Utils
import {
  ascendDescendPlots,
  fillGridPositions,
  fillSurroundRowPositions,
  generateMainGrid,
  generateSurroundRows,
  resetSurroundPlotsAfterDescention,
  updateGrid,
  updatePlotPositionAfterAscention,
  updatePositionOnKeyDown,
} from './utils';
import {
  createPositionCompareFn,
  createRotationCompareFn,
  fillBackgroundObjects,
  fillBackgroundObjectsGrass,
  getInvisiblePerimeter,
  getSemiTransparentPerimeter,
  updateBackgroundObjectsToSpecs,
} from './utils/background';
import { MappedPlots, ObjectSpecs } from './utils/interfaces';

import MainPlots from './mainPlots';
import Plot from './plot';

const KEY_CODES = {
  KeyW: 'w',
  KeyS: 's',
  KeyA: 'a',
  KeyD: 'd',
};

const gridSize = 7;

const validKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];

interface IGrid {
  onPlotSelect: (x: number, y: number) => void,
  onCenterMove: (x: number, y: number) => void,
  center: { x: number, y: number },
  mappedPlots: MappedPlots
}

const Grid: React.FC<IGrid> = ({
  onPlotSelect = () => {},
  onCenterMove = () => {},
  center,
  mappedPlots = {},
}) => {
  const { size, set, scene } = useThree();
  const planeRef = useRef();
  const lightRef = useRef();
  const backgroundTreeRefs = new Array(100).fill(undefined).map(() => createRef<THREE.Mesh>());
  const backgroundFirRefs = new Array(100).fill(undefined).map(() => createRef<THREE.Mesh>());
  const backgroundGrassRefs = new Array(400).fill(undefined).map(() => createRef<THREE.Mesh>());
  const backgroundTreeSpecsRef = useRef<Array<ObjectSpecs>>([]);
  const backgroundFirSpecsRef = useRef<Array<ObjectSpecs>>([]);
  const backgroundGrassSpecsRef = useRef<Array<ObjectSpecs>>([]);
  const centerRef = useRef({ x: 3, y: 3 });
  const teleportedRef = useRef(false);

  const perspectiveCameraOffset = {
    x: 9.7,
    y: -8.3,
    z: 10,
  };

  const directionalLightOffset = {
    x: 113.7,
    y: 73.7,
    z: 60,
  };

  const cameraInitialPosition = {
    x: perspectiveCameraOffset.x + (centerRef.current.x * 2.1),
    y: perspectiveCameraOffset.y + (centerRef.current.y * 2.1),
    z: perspectiveCameraOffset.z,
  };

  const directionalLightInitialPosition = {
    x: directionalLightOffset.x + (centerRef.current.x * 2.1),
    y: directionalLightOffset.y + (centerRef.current.y * 2.1),
    z: directionalLightOffset.z,
  };

  const backgroundPlantOffset = {
    x: -15,
    y: -15,
  };

  const orthCameraRef = useRef();

  const mainPlotRefs = generateMainGrid(gridSize);
  const surroundPlotRefs = generateSurroundRows(gridSize);

  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera>();

  const keysDown = useRef({
    w: false, a: false, s: false, d: false,
  });

  const treePositionCompareFn = createPositionCompareFn('1');
  const treeRotationCompareFn = createRotationCompareFn(1);
  const firPositionCompareFn = createPositionCompareFn('2');
  const firRotationCompareFn = createRotationCompareFn(2);
  const grassPositionCompareFn = createPositionCompareFn('3');
  const grassRotationCompareFn = createRotationCompareFn(3);

  const fillBackground = () => {
    const invisibleCoordinates = getInvisiblePerimeter(centerRef.current);
    const semiTransparentCoordinates = getSemiTransparentPerimeter(centerRef.current);
    backgroundTreeSpecsRef.current = fillBackgroundObjects(
      centerRef.current.x + backgroundPlantOffset.x,
      centerRef.current.y + backgroundPlantOffset.y,
      30,
      invisibleCoordinates,
      semiTransparentCoordinates,
      treePositionCompareFn,
      treeRotationCompareFn,
    );

    backgroundFirSpecsRef.current = fillBackgroundObjects(
      centerRef.current.x + backgroundPlantOffset.x,
      centerRef.current.y + backgroundPlantOffset.y,
      30,
      invisibleCoordinates,
      semiTransparentCoordinates,
      firPositionCompareFn,
      firRotationCompareFn,
    );

    backgroundGrassSpecsRef.current = fillBackgroundObjectsGrass(
      (centerRef.current.x + backgroundPlantOffset.x) * 2.1,
      (centerRef.current.y + backgroundPlantOffset.y) * 2.1,
      30 * 2.1,
      invisibleCoordinates,
      semiTransparentCoordinates,
      grassPositionCompareFn,
      grassRotationCompareFn,
    );
  };

  const updateBackground = () => {
    if (backgroundTreeRefs.length !== 0) {
      updateBackgroundObjectsToSpecs(
        backgroundTreeRefs,
        backgroundTreeSpecsRef,
      );
    }

    if (backgroundFirRefs.length !== 0) {
      updateBackgroundObjectsToSpecs(
        backgroundFirRefs,
        backgroundFirSpecsRef,
      );
    }

    if (backgroundGrassRefs.length !== 0) {
      updateBackgroundObjectsToSpecs(
        backgroundGrassRefs,
        backgroundGrassSpecsRef,
      );
    }
  };

  const updateBackgroundObjects = () => {
    fillBackground();
    updateBackground();
  };

  const updateCenterCoordinates = (x: number, y: number) => {
    centerRef.current = { x, y };

    onCenterMove(x, y);
  };

  const onCenterSet = () => {
    perspectiveCameraRef.current.position.x = (center.x * 2.1) + perspectiveCameraOffset.x;
    perspectiveCameraRef.current.position.y = (center.y * 2.1) + perspectiveCameraOffset.y;
    lightRef.current.position.x = (center.x * 2.1) + directionalLightOffset.x;
    lightRef.current.position.y = (center.y * 2.1) + directionalLightOffset.y;
    lightRef.current.target.position.x = (center.x - gridSize) * 2.1;
    lightRef.current.target.position.y = (center.y - gridSize) * 2.1;
    teleportedRef.current = true;
  };

  // USE EFFECTS

  useEffect(() => {
    fillBackground();
    fillGridPositions(
      mainPlotRefs, gridSize, centerRef.current.x, centerRef.current.y,
    );
    fillSurroundRowPositions(
      surroundPlotRefs, gridSize + 2, centerRef.current.x, centerRef.current.y,
    );
  }, []);

  useEffect(() => {
    if (
      center.x === centerRef.current.x
      && center.y === centerRef.current.y
    ) { return; }
    onCenterSet();
  }, [center.x, center.y]);

  // add target for manipulation
  // orthCamera to set shadow limits (to not be cut off)
  useEffect(() => {
    // target
    scene.add(lightRef.current.target);

    // orthCamera for shadowing
    orthCameraRef.current.left = -20;
    orthCameraRef.current.right = 20;
    orthCameraRef.current.top = 20;
    orthCameraRef.current.bottom = -20;
    orthCameraRef.current.near = 0.1;
    orthCameraRef.current.far = 2000;
    lightRef.current.shadow.camera = orthCameraRef.current;
  }, []);

  useEffect(() => {
    window.addEventListener('keypress', updateWasdStateOnDown);
    window.addEventListener('keyup', updateWasdStateOnUp);

    return () => {
      window.removeEventListener('keypress', updateWasdStateOnDown);
      window.removeEventListener('keyup', updateWasdStateOnUp);
    };
  }, []);

  useEffect(() => {
    updateBackgroundObjects();
  }, []);

  // USE FRAMES

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
    const newCenterX = Math.floor(
      (state.camera.position.x - perspectiveCameraOffset.x) / 2.1,
    );
    const newCenterY = Math.floor(
      (state.camera.position.y - perspectiveCameraOffset.y) / 2.1,
    );

    if (centerRef.current.x !== newCenterX
      || centerRef.current.y !== newCenterY) {
      const diffX = newCenterX - centerRef.current.x;
      const diffY = newCenterY - centerRef.current.y;

      updateCenterCoordinates(
        newCenterX,
        newCenterY,
      );

      if (!teleportedRef.current) {
        updateGrid(
          diffX,
          diffY,
          surroundPlotRefs,
        );
      } else {
        teleportedRef.current = false;
        fillBackground();
        fillGridPositions(
          mainPlotRefs, gridSize, centerRef.current.x, centerRef.current.y,
        );
        fillSurroundRowPositions(
          surroundPlotRefs, gridSize + 2, centerRef.current.x, centerRef.current.y,
        );
      }

      updateBackgroundObjects();
    }

    updatePositionOnKeyDown(state.camera.position, keysDown);
    updatePositionOnKeyDown(lightRef.current.position, keysDown);
    updatePositionOnKeyDown(lightRef.current.target.position, keysDown);

    state.camera.updateProjectionMatrix();
  });

  useLayoutEffect(
    () => {
      if (!perspectiveCameraRef?.current) { return; }

      set({ camera: perspectiveCameraRef.current });

      // set initial position manually so React wouldn't re-render
      perspectiveCameraRef.current.position.x = cameraInitialPosition.x;
      perspectiveCameraRef.current.position.y = cameraInitialPosition.y;
      perspectiveCameraRef.current.position.z = cameraInitialPosition.z;
    },
    [perspectiveCameraRef?.current, set],
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
        position={[
          directionalLightInitialPosition.x,
          directionalLightInitialPosition.y,
          directionalLightInitialPosition.z,
        ]}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
        shadow-radius={2}
      />
      <orthographicCamera
        ref={orthCameraRef}
      />
      <perspectiveCamera
        ref={perspectiveCameraRef}
        aspect={size.width / size.height}
        fov={65}
        near={1}
        far={10000}
        rotation={[30 * (Math.PI / 180), 30 * (Math.PI / 180), 40 * (Math.PI / 180)]}
        onUpdate={(self: any) => self.updateProjectionMatrix()}
      />
      <MainPlots
        mainPlotRefs={mainPlotRefs}
        centerRef={centerRef}
        onPlotSelect={onPlotSelect}
        mappedPlots={mappedPlots}
      />
      {
        surroundPlotRefs.map((r) => r.map((c) => (
          <Plot
            reference={c}
          />
        )))
      }
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
          backgroundTreeRefs.map(
            (ref) => (<Tree reference={ref} />),
          )
        )
      }
      {
        (
          backgroundFirRefs.map(
            (ref) => (<Fir reference={ref} />),
          )
        )
      }
      {
        (
          backgroundGrassRefs.map(
            (ref) => (<Grass1 reference={ref} />),
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
