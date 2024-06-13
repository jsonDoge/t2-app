// TODO: why not always use enum? and vice versa
export const CONTRACT_TYPE = {
  FARM: 'FARM',
  ERC20: 'ERC20', // Item and stable token
  PLOT: 'PLOT',
  DISH: 'DISH',
};

export const SEED_TYPE = {
  CORN: 'CORN',
  CARROT: 'CARROT',
  POTATO: 'POTATO',
} as const;

// SeedType seems to require a separate type definition to be used in return types
export type SeedType = (typeof SEED_TYPE)[keyof typeof SEED_TYPE];

export const PRODUCT_TYPE = {
  ...SEED_TYPE,
  WEED: 'WEED',
};
