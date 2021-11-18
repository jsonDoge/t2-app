import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export interface Plant {
  type: string,
  owner: string,
}

export interface Plot {
  plant?: Plant,
  x: number,
  y: number,
  owner?: string,
}

export interface PlotInfo {
  plant: Plant,
  owner: string,
}

export const getDishAddress = (type: string): string => {
  const dishAddress: string = publicRuntimeConfig[`C_${type}_DISH`] || '';
  if (dishAddress.length === 0) { throw new Error('invalid plant type'); }
  return dishAddress;
};

export const getProductAddress = (type: string): string => {
  const productAddress: string = publicRuntimeConfig[`C_${type}_PRODUCT`] || '';
  if (productAddress.length === 0) { throw new Error('invalid plant type'); }
  return productAddress;
};

export const getSeedAddress = (type: string): string => {
  const seedAddress: string = publicRuntimeConfig[`C_${type}_SEED`] || '';
  if (seedAddress.length === 0) { throw new Error('invalid plant type'); }
  return seedAddress;
};

export const getPlotIdFromCoordinates = (x: number, y: number) => x + y * 1000;
export const getCoordinatesFromPlotId = (plotId: number): { x: number, y: number } =>
  ({ x: plotId % 1000, y: Math.floor(plotId / 1000) });

export const toSentenceCase = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
