/* eslint-disable no-param-reassign */
import React, {
  useRef, useState, useLayoutEffect, useEffect, createRef,
} from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import Cube from './cube';

const KEY_CODES = {
  KeyW: 'w',
  KeyS: 's',
  KeyA: 'a',
  KeyD: 'd',
};

const gridSize = 7;

const generateMainGrid = (size: number) => {
  const mainRefs: Array<Array<THREE.Mesh>> = [];
  for (let y = 0; y < size; y += 1) {
    if (!mainRefs[y]) { mainRefs[y] = []; }
    for (let x = 0; x < size; x += 1) {
      const plotRef = createRef<THREE.Mesh>();
      mainRefs[y][x] = plotRef;
    }
  }
  return mainRefs;
};

// rows [0, 1] - along side y , [2, 3] - along side x
const generateSurroundRows = (size: number) => {
  const surroundRefs: Array<Array<THREE.Mesh>> = [];
  for (let y = 0; y < 4; y += 1) {
    if (!surroundRefs[y]) { surroundRefs[y] = []; }

    for (let x = 0; x < size; x += 1) {
      const plotRef = createRef<THREE.Mesh>();
      surroundRefs[y][x] = plotRef;
    }
  }
  return surroundRefs;
};

const fillGridPositions = (grid: Array<Array<THREE.Mesh>>, size: number) => {
  const minValue = ((size - 1) / -2) * 2.1;

  grid.forEach((row: Array<THREE.Mesh>, rowIndex: number) => {
    row.forEach((ref: THREE.Mesh, columnIndex: number) => {
      ref.current.position.x = minValue + columnIndex * 2.1;
      ref.current.position.y = minValue + rowIndex * 2.1;
      ref.current.position.z = -0.12;
      ref.current.isAscending = true;
    });
  });
};

const fillSurroundRowPositions = (grid: Array<Array<THREE.Mesh>>, size: number) => {
  const minValue = ((size - 1) / -2) * 2.1;

  // along Y axis
  grid[0].forEach((ref, columnIndex) => {
    ref.current.position.x = minValue + (columnIndex + 1) * 2.1;
    ref.current.position.y = minValue;
    ref.current.position.z = -0.12;
    ref.current.castShadow = false;
  });

  grid[1].forEach((ref, columnIndex) => {
    ref.current.position.x = minValue + (columnIndex + 1) * 2.1;
    ref.current.position.y = minValue + (size - 1) * 2.1;
    ref.current.position.z = -0.12;
    ref.current.castShadow = false;
  });

  // along X axis
  grid[2].forEach((ref, columnIndex) => {
    ref.current.position.x = minValue;
    ref.current.position.y = minValue + (columnIndex + 1) * 2.1;
    ref.current.position.z = -0.12;
    ref.current.castShadow = false;
  });

  grid[3].forEach((ref, columnIndex) => {
    ref.current.position.x = minValue + (size - 1) * 2.1;
    ref.current.position.y = minValue + (columnIndex + 1) * 2.1;
    ref.current.position.z = -0.12;
    ref.current.castShadow = false;
  });
};

const validKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];

const Grid: React.FC<{}> = () => {
  const { size, set } = useThree();
  const planeRef = useRef();
  const lightRef = useRef();

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
  });

  // ascention/descention
  useFrame(() => {
    mainPlotRefs.forEach((r) => r.forEach((c) => {
      if (c.current.isAscending) {
        c.current.position.z += 0.02;
        if (c.current.position.z >= 0.1) {
          c.current.isAscending = false;
          c.current.isAscended = true;
        }
      } else if (c.current.isDescending) {
        c.current.position.z -= 0.02;
        if (c.current.position.z < -0.11) {
          c.current.isDescending = false;
          c.current.isDescended = true;
        }
      }
    }));

    surroundPlotRefs.forEach((r) => r.forEach((c) => {
      if (c.current.isAscending) {
        c.current.position.z += 0.02;
        if (c.current.position.z >= 0.1) {
          c.current.isAscending = false;
          c.current.isAscended = true;
        }
      } else if (c.current.isDescending) {
        c.current.position.z -= 0.02;
        if (c.current.position.z < -0.11) {
          c.current.isDescending = false;
          c.current.isDescended = true;
        }
      }
    }));
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
    }

    if (keysDown.current.s) {
      state.camera.position.y -= 0.075;
      state.camera.position.x += 0.075;
      lightRef.current.position.y -= 0.075;
      lightRef.current.position.x += 0.075;
    }

    if (keysDown.current.a) {
      state.camera.position.y -= 0.075;
      state.camera.position.x -= 0.075;
      lightRef.current.position.y -= 0.075;
      lightRef.current.position.x -= 0.075;
    }

    if (keysDown.current.d) {
      state.camera.position.y += 0.075;
      state.camera.position.x += 0.075;
      lightRef.current.position.y += 0.075;
      lightRef.current.position.x += 0.075;
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
      <pointLight
        ref={lightRef}
        intensity={0.8}
        color="#FDF3c6"
        castShadow
        distance={100}
        position={[-60, -30, 30]}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
        // shadow-bias={-0.0005}
        shadow-radius={2}
      />
      <perspectiveCamera
        ref={setRef}
        aspect={size.width / size.height}
        fov={55}
        position={[10, -8.5, 10]}
        near={0.1}
        far={100}
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

      <Cube />
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
