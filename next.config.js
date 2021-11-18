/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    ETH_PROVIDER: process.env.ETH_PROVIDER,
    C_STABLE_TOKEN: process.env.C_STABLE_TOKEN,
    C_FARM_SETTINGS: process.env.C_FARM_SETTINGS,
    C_FARM: process.env.C_FARM,
    C_PLOT: process.env.C_PLOT,
    C_POTATO_SEED: process.env.C_POTATO_SEED,
    C_POTATO_PRODUCT: process.env.C_POTATO_PRODUCT,
    C_POTATO_DISH: process.env.C_POTATO_DISH,
    C_CORN_SEED: process.env.C_CORN_SEED,
    C_CORN_PRODUCT: process.env.C_CORN_PRODUCT,
    C_CORN_DISH: process.env.C_CORN_DISH,
    C_CARROT_SEED: process.env.C_CARROT_SEED,
    C_CARROT_PRODUCT: process.env.C_CARROT_PRODUCT,
    C_CARROT_DISH: process.env.C_CARROT_DISH,
  },
};
