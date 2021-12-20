/* eslint-disable import/prefer-default-export */
import * as THREE from 'three';
import { PositionCompareFn, RotationCompareFn } from './types';

export const pseudoRand = (
  x: number,
  y: number,
  mod: number,
  compareFn: PositionCompareFn | RotationCompareFn,
) =>
  compareFn((THREE.MathUtils.seededRandom((x << 10 | y) * 39916801) * 100) % mod);
