import { Ref } from 'react';
import { ObjectSpecs } from './interfaces';
import { pseudoRand } from './pseudoRandom';
import {
  PositionCompareFn, PositionCompareFnFactory, RotationCompareFn, RotationCompareFnFactory,
} from './types';

const fillBackgroundObjects = (
  lowestX: number,
  lowestY: number,
  size: number,
  invisibleCoordinates: { x0: number, y0: number, x1: number, y1: number },
  semiTransparentCoordinates: { x0: number, y0: number, x1: number, y1: number },
  positionCompareFn: PositionCompareFn,
  rotationCompareFn: RotationCompareFn,
) => {
  const specs: Array<ObjectSpecs> = [];
  const {
    x0, x1, y0, y1,
  } = invisibleCoordinates;
  const {
    x0: sx0, x1: sx1, y0: sy0, y1: sy1,
  } = semiTransparentCoordinates;
  for (let y = lowestY; y < lowestY + size; y += 1) {
    if (y < 0) { continue; }
    for (let x = lowestX; x < lowestX + size; x += 1) {
      if (x < 0) { continue; }

      const doFillPosition = pseudoRand(x, y, 1000, positionCompareFn);

      if (doFillPosition) {
        const rotation = pseudoRand(x, y, 4, rotationCompareFn) || 0;

        const isInvisible = x >= x0 && x <= x1 && y >= y0 && y <= y1;
        const isSemiTransparent = x >= sx0 && x <= sx1 && y >= sy0 && y <= sy1;

        specs.push({
          isVisible: !isInvisible,
          isSemiTransparent,
          position: [x * 2.1, y * 2.1, 0],
          rotation: [90 * (Math.PI / 180), rotation * (Math.PI / 180), 0],
        });
      }
    }
  }
  return specs;
};

const fillBackgroundObjectsGrass = (
  lowestX: number,
  lowestY: number,
  size: number,
  invisibleCoordinates: { x0: number, y0: number, x1: number, y1: number },
  semiTransparentCoordinates: { x0: number, y0: number, x1: number, y1: number },
  positionCompareFn: PositionCompareFn,
  rotationCompareFn: RotationCompareFn,
  positionInterval = 1,
) => {
  const specs: Array<ObjectSpecs> = [];
  const {
    x0, x1, y0, y1,
  } = invisibleCoordinates;
  const {
    x0: sx0, x1: sx1, y0: sy0, y1: sy1,
  } = semiTransparentCoordinates;
  for (let y = lowestY; y < lowestY + size; y += positionInterval) {
    if (y < 0) { continue; }
    for (let x = lowestX; x < lowestX + size; x += positionInterval) {
      if (x < 0) { continue; }

      const doFillPosition = pseudoRand(Math.floor(x), Math.floor(y), 10, positionCompareFn);

      if (doFillPosition) {
        const rotation = pseudoRand(x, y, 4, rotationCompareFn) || 0;

        const isInvisible = x >= x0 * 2.1 && x <= x1 * 2.1 && y >= y0 * 2.1 && y <= y1 * 2.1;
        const isSemiTransparent =
          x >= sx0 * 2.1 && x <= sx1 * 2.1 && y >= sy0 * 2.1 && y <= sy1 * 2.1;

        specs.push({
          isVisible: !isInvisible,
          isSemiTransparent,
          position: [Math.floor(x), Math.floor(y), 0],
          rotation: [90 * (Math.PI / 180), rotation * (Math.PI / 180), 0],
        });
      }
    }
  }
  return specs;
};

// TODO: improve function naming
const createPositionCompareFn: PositionCompareFnFactory = (compareNumber: string) =>
  (resultValue: number) => {
    const r = Math.round(resultValue); return resultValue.toString()[r] === compareNumber;
  };

const createRotationCompareFn: RotationCompareFnFactory = (indexDiff: number) =>
  (resultValue: number) => {
    const r = Math.round(resultValue);
    return (parseInt(resultValue.toString()[r - indexDiff], 10) % 4) * 90;
  };

const updateBackgroundObjectsToSpecs = (
  backgroundObjectRefs: Array<any>,
  specsRef: Ref<Array<ObjectSpecs>>,
) => {
  backgroundObjectRefs.forEach((ref, i) => {
    if (!ref.current) { return; }
    if (specsRef.current[i]) {
      ([
        ref.current.position.x,
        ref.current.position.y,
        ref.current.position.z,
      ] = specsRef.current[i].position);
      ([
        ref.current.rotation.x,
        ref.current.rotation.y,
        ref.current.rotation.z,
      ] = specsRef.current[i].rotation);

      if (specsRef.current[i].isSemiTransparent) {
        ref.current.material.opacity = 0.1;
        ref.current.material.transparent = true;
      } else {
        ref.current.material.opacity = 1;
        ref.current.material.transparent = false;
      }

      ref.current.visible = specsRef.current[i].isVisible;
    } else {
      ([
        ref.current.position.x,
        ref.current.position.y,
        ref.current.position.z,
      ] = [-100, -100, 0]);
    }
  });
};

const getInvisiblePerimeter = (center: { x: number, y: number }) =>
  ({
    x0: center.x - 4,
    y0: center.y - 4,
    x1: center.x + 4,
    y1: center.y + 4,
  });

const getSemiTransparentPerimeter = (center: { x: number, y: number }) =>
  ({
    x0: center.x - 7,
    y0: center.y - 7,
    x1: center.x + 7,
    y1: center.y + 7,
  });

export {
  fillBackgroundObjects,
  fillBackgroundObjectsGrass,
  createPositionCompareFn,
  createRotationCompareFn,
  updateBackgroundObjectsToSpecs,
  getInvisiblePerimeter,
  getSemiTransparentPerimeter,
};
