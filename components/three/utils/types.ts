export type PositionCompareFnFactory = (compareValue: string) => PositionCompareFn;
export type RotationCompareFnFactory = (indexDiff: number) => RotationCompareFn;
export type PositionCompareFn = (randResult: number) => boolean;
export type RotationCompareFn = (randResult: number) => number;
