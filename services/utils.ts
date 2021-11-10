import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig();

export interface Plant {
  type: string,
}

export interface Plot {
  plant?: Plant,
  x: number,
  y: number,
  owner?: string,
}

export const getProductAddress = (type: string): string => {
  const productAddress: string = publicRuntimeConfig[`C_${type}_PRODUCT`] || '';
  if (productAddress.length === 0) { throw new Error('invalid plant type'); }
  return productAddress;
}

export const getSeedAddress = (type: string): string => {
  const seedAddress: string = publicRuntimeConfig[`C_${type}_SEED`] || '';
  if (seedAddress.length === 0) { throw new Error('invalid plant type'); }
  return seedAddress;
}

export const getPlotIdFromCoordinates = (x: number, y: number) => x + y * 1000;
