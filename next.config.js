/** @type {import('next').NextConfig} */
module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  publicRuntimeConfig: {
    CHAIN_NAME: process.env.CHAIN_NAME,
    ETH_PROVIDER: process.env.ETH_PROVIDER,
    ETH_CHAIN_ID: process.env.ETH_CHAIN_ID,
    C_STABLE_TOKEN: process.env.C_STABLE_TOKEN,
    C_FARM_SETTINGS: process.env.C_FARM_SETTINGS,
    C_FARM: process.env.C_FARM,
    C_PLOT: process.env.C_PLOT,

    // potato contracts
    C_POTATO_SEED: process.env.C_POTATO_SEED,
    C_POTATO_PRODUCT: process.env.C_POTATO_PRODUCT,
    C_POTATO_DISH: process.env.C_POTATO_DISH,

    // corn contracts
    C_CORN_SEED: process.env.C_CORN_SEED,
    C_CORN_PRODUCT: process.env.C_CORN_PRODUCT,
    C_CORN_DISH: process.env.C_CORN_DISH,

    // carrot contracts
    C_CARROT_SEED: process.env.C_CARROT_SEED,
    C_CARROT_PRODUCT: process.env.C_CARROT_PRODUCT,
    C_CARROT_DISH: process.env.C_CARROT_DISH,

    // weed contracts
    C_WEED_PRODUCT: process.env.C_WEED_PRODUCT,
    C_WEED_DISH: process.env.C_WEED_DISH,

    // growth duration
    POTATO_GROWTH_DURATION: process.env.POTATO_GROWTH_DURATION,
    CORN_GROWTH_DURATION: process.env.CORN_GROWTH_DURATION,
    CARROT_GROWTH_DURATION: process.env.CARROT_GROWTH_DURATION,

    // min water
    POTATO_MIN_WATER: process.env.POTATO_MIN_WATER,
    CORN_MIN_WATER: process.env.CORN_MIN_WATER,
    CARROT_MIN_WATER: process.env.CARROT_MIN_WATER,

    // season
    SEASON_DURATION_BLOCKS: process.env.SEASON_DURATION_BLOCKS,
    POTATO_GROWTH_SEASONS: process.env.POTATO_GROWTH_SEASONS,
    CORN_GROWTH_SEASONS: process.env.CORN_GROWTH_SEASONS,
    CARROT_GROWTH_SEASONS: process.env.CARROT_GROWTH_SEASONS,

    // plot water
    PLOT_MAX_WATER: process.env.PLOT_MAX_WATER,
    PLOT_WATER_REGEN_RATE: process.env.PLOT_WATER_REGEN_RATE,

    // plant water
    PLANT_WATER_ABSORB_RATE: process.env.PLANT_WATER_ABSORB_RATE,
    PLANT_NEIGHBOR_WATER_ABSORB_RATE: process.env.PLANT_NEIGHBOR_WATER_ABSORB_RATE,

    // plot area
    PLOT_AREA_MAX_X: process.env.PLOT_AREA_MAX_X, // in code max value 1000 is not reached due to starting at 0
    PLOT_AREA_MAX_Y: process.env.PLOT_AREA_MAX_Y,
  },
};
