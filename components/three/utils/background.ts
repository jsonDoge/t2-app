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
  positionCompareFn: PositionCompareFn,
  rotationCompareFn: RotationCompareFn,
) => {
  const specs: Array<ObjectSpecs> = [];
  for (let y = lowestY; y < lowestY + size; y += 1) {
    for (let x = lowestX; x < lowestX + size; x += 1) {
      const doFillPosition = pseudoRand(x, y, 10, positionCompareFn);

      if (doFillPosition) {
        const rotation = pseudoRand(x, y, 4, rotationCompareFn);

        specs.push({
          position: [x * 2.1, y * 2.1, 0],
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
    } else {
      ([
        ref.current.position.x,
        ref.current.position.y,
        ref.current.position.z,
      ] = [-100, -100, 0]);
    }
  });
};

export {
  fillBackgroundObjects,
  createPositionCompareFn,
  createRotationCompareFn,
  updateBackgroundObjectsToSpecs,
};
