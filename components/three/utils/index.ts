/* eslint-disable no-param-reassign */
import { createRef } from 'react';

const generateMeshRefGrid = (size: number): Array<Array<THREE.Mesh>> => {
  const refs: Array<Array<THREE.Mesh>> = [];
  for (let y = 0; y < size; y += 1) {
    if (!refs[y]) { refs[y] = []; }
    for (let x = 0; x < size; x += 1) {
      const plotRef = createRef<THREE.Mesh>();
      refs[y][x] = plotRef;
    }
  }
  return refs;
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

const fillGridPositions = (
  grid: Array<Array<THREE.Mesh>>,
  size: number,
  centerX: number,
  centerY: number,
) => {
  const sizeDeviation = (size - 1) / 2; // because odd (5)
  const minValueX = (centerX - sizeDeviation) * 2.1;
  const minValueY = (centerY - sizeDeviation) * 2.1;

  grid.forEach((row: Array<THREE.Mesh>, rowIndex: number) => {
    row.forEach((ref: THREE.Mesh, columnIndex: number) => {
      ref.current.position.x = minValueX + columnIndex * 2.1;
      ref.current.position.y = minValueY + rowIndex * 2.1;
      ref.current.position.z = -0.12;
      ref.current.isAscending = true;
    });
  });
};

const fillSurroundRowPositions = (
  grid: Array<Array<THREE.Mesh>>,
  size: number,
  centerX: number,
  centerY: number,
) => {
  const sizeDeviation = (size - 1) / 2; // because odd (5)
  const minValueX = (centerX - sizeDeviation) * 2.1;
  const minValueY = (centerY - sizeDeviation) * 2.1;

  // along Y axis
  grid[0].forEach((ref, columnIndex) => {
    ref.current.position.x = minValueX + (columnIndex + 1) * 2.1;
    ref.current.position.y = minValueY;
    ref.current.position.z = -0.12;
    ref.current.castShadow = false;
  });

  grid[1].forEach((ref, columnIndex) => {
    ref.current.position.x = minValueX + (columnIndex + 1) * 2.1;
    ref.current.position.y = minValueY + (size - 1) * 2.1;
    ref.current.position.z = -0.12;
    ref.current.castShadow = false;
  });

  // along X axis
  grid[2].forEach((ref, columnIndex) => {
    ref.current.position.x = minValueX;
    ref.current.position.y = minValueY + (columnIndex + 1) * 2.1;
    ref.current.position.z = -0.12;
    ref.current.castShadow = false;
  });

  grid[3].forEach((ref, columnIndex) => {
    ref.current.position.x = minValueX + (size - 1) * 2.1;
    ref.current.position.y = minValueY + (columnIndex + 1) * 2.1;
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

const resetSurroundPlotsAfterDescention = (surroundPlotRefs: Array<Array<THREE.Mesh>>) => {
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
};

const updatePlotPositionAfterAscention = (
  mainPlotRefs: Array<Array<THREE.Mesh>>,
  surroundPlotRefs: Array<Array<THREE.Mesh>>,
) => {
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
};

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

const updatePositionOnKeyDown = (position: { x: number, y: number }, keysDown) => {
  if (keysDown.current.w) {
    position.y += 0.075;
    position.x -= 0.075;
  }

  if (keysDown.current.s) {
    position.y -= 0.075;
    position.x += 0.075;
  }

  if (keysDown.current.a) {
    position.y -= 0.075;
    position.x -= 0.075;
  }

  if (keysDown.current.d) {
    position.y += 0.075;
    position.x += 0.075;
  }
};

export {
  fillGridPositions,
  generateMeshRefGrid,
  generateSurroundRows,
  fillSurroundRowPositions,
  ascendDescendPlots,
  resetSurroundPlotsAfterDescention,
  updatePlotPositionAfterAscention,
  updatePositionOnKeyDown,
  updateGrid,
};
