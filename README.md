It's a TokenToken token farm! Get it? cause the name is TokenToken... and it has a ERC20 token?... ehhh naming...

![image](https://user-images.githubusercontent.com/16711523/203055844-e1826f8a-7d93-4cf5-9440-1b55f005e9f6.png)


## Getting Started

Development server:

```bash
yarn install

yarn run dev
```

Open [http://localhost:5555](http://localhost:5555) with your browser to see the result.

## ENV

Expected Env variables in .env.local when running with a local blockchain.

```
CHAIN_NAME={string} - only used for display

ETH_PROVIDER=http:/{your local blockchain node IP+PORT}
ETH_CHAIN_ID={Chain ID}

SEASON_DURATION_BLOCKS={any number}
POTATO_GROWTH_SEASONS={number 0-15}
CORN_GROWTH_SEASONS={number 0-15}
CARROT_GROWTH_SEASONS={number 0-15}

PLOT_MAX_WATER={any number}
PLOT_WATER_REGEN_RATE={any number}

PLANT_WATER_ABSORB_RATE={any number}
PLANT_NEIGHBOR_WATER_ABSORB_RATE={any number}

POTATO_GROWTH_DURATION={any number}
CORN_GROWTH_DURATION={any number}
CARROT_GROWTH_DURATION={any number}

POTATO_MIN_WATER={any number}
CORN_MIN_WATER={any number}
CARROT_MIN_WATER={any number}

C_STABLE_TOKEN=0x...
C_FARM_SETTINGS=0x...
C_FARM=0x...
C_PLOT=0x...

C_POTATO_SEED=0x...
C_POTATO_PRODUCT=0x...
C_POTATO_DISH=0x...

C_CORN_SEED=0x...
C_CORN_PRODUCT=0x...
C_CORN_DISH=0x...

C_CARROT_SEED=0x...
C_CARROT_PRODUCT=0x...
C_CARROT_DISH=0x...

C_WEED_PRODUCT=0x...
C_WEED_DISH=0x...

PLOT_AREA_MAX_X={any number},
PLOT_AREA_MAX_Y={any number},
```

## Blockchain

Currently using local blockchain for development and Polygon Amoy for Testnet.

## TODO

- Verify if math with very big numbers wouldn't break JS
- Add metamask wallet option