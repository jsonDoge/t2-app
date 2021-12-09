import { createRef } from 'react';

const generateMainGrid = (size: number): Array<Array<THREE.Mesh>> => {
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
const generateSurroundRows = (size: number): Array<Array<THREE.Mesh>> => {
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

const ascendDescendPlots = (plotRefs: Array<Array<THREE.Mesh>>) => {
  plotRefs.forEach((r) => r.forEach((c) => {
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
};

export {
  fillGridPositions,
  generateMainGrid,
  generateSurroundRows,
  fillSurroundRowPositions,
  ascendDescendPlots,
};
