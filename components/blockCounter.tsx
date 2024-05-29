import getConfig from 'next/config';
import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import { getBlockNumber } from '../services/web3Utils';
import { toSentenceCase } from '../utils';

const { publicRuntimeConfig } = getConfig();

enum Season { AUTUMN = 'AUTUMN', WINTER = 'WINTER', SPRING = 'SPRING', SUMMER = 'SUMMER' }

const BlockCounter: FC = () => {
  const [blockNumber, setBlockNumber] = useState(0);
  const [season, setSeason] = useState<Season>();
  const [blocksTillNextSeason, setBlocksTillNextSeason] = useState(0);

  const calculateSeason = (blockNumber_: number, seasonBlockDuration: number): Season => {
    const moduleBlockNumber = blockNumber_ % (4 * seasonBlockDuration);

    if (moduleBlockNumber / seasonBlockDuration < 1) {
      return Season.WINTER;
    }
    if (moduleBlockNumber / (seasonBlockDuration * 2) < 2) {
      return Season.SPRING;
    }
    if (moduleBlockNumber / (seasonBlockDuration * 3) < 3) {
      return Season.SUMMER;
    }

    return Season.AUTUMN;
  };

  const calculateSeasonBlocksLeft = (blockNumber_: number, seasonBlockDuration: number): number =>
    seasonBlockDuration - (blockNumber_ % seasonBlockDuration);

  const updateBlockAndSeason = useCallback((currentBlockNumber: number) => {
    setBlockNumber(currentBlockNumber);
    setBlocksTillNextSeason(
      calculateSeasonBlocksLeft(currentBlockNumber, publicRuntimeConfig.SEASON_DURATION_BLOCKS),
    );
    setSeason(calculateSeason(currentBlockNumber, publicRuntimeConfig.SEASON_DURATION_BLOCKS));
  }, []);

  useEffect(() => {
    getBlockNumber().then(updateBlockAndSeason);

    setInterval(() => { // Clear interval
      getBlockNumber().then(updateBlockAndSeason);
    }, 60000);
  }, [updateBlockAndSeason]);

  return (
    <div className="font-bold mr-5">
      <div className="inline">
        Block:
      </div>
      <div className="inline ml-1">
        {blockNumber}
      </div>
      <div className="inline ml-2">
        Season:
      </div>
      <div className="inline ml-1">
        {toSentenceCase(season || '')}
      </div>
      <div className="">
        {`Blocks till next season: ${blocksTillNextSeason}`}
      </div>
    </div>
  );
};

export default BlockCounter;
