import getConfig from 'next/config';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { toSentenceCase } from '../utils';
import { useBlockchain } from '../context/blockchain';
import { Season } from '../utils/enums';
import { calculateSeason, isPlantSeason } from './game/utils/seasons';

// constants
import { SEED_TYPE } from '../utils/constants';

const { publicRuntimeConfig } = getConfig();

const seedTypeToEmoji = (seedType: string): string => {
  switch (seedType) {
    case SEED_TYPE.CARROT:
      return '🥕';
    case SEED_TYPE.CORN:
      return '🌽';
    case SEED_TYPE.POTATO:
      return '🥔';
    default:
      return '';
  }
};

const getNextSeason = (currentSeason: Season): Season => {
  switch (currentSeason) {
    case Season.WINTER:
      return Season.SPRING;
    case Season.SPRING:
      return Season.SUMMER;
    case Season.SUMMER:
      return Season.AUTUMN;
    case Season.AUTUMN:
      return Season.WINTER;
    default:
      return Season.WINTER;
  }
};

const getSeasonPlantEmojis = (season: Season, seedTypes: string[]): string =>
  seedTypes
    .map((seedType) => isPlantSeason(seedType, season) && seedTypeToEmoji(seedType))
    .filter((e) => !!e)
    .join('');

const BlockCounter: FC = () => {
  const { currentBlock } = useBlockchain();
  const [blockNumber, setBlockNumber] = useState(0);
  const [season, setSeason] = useState<Season>(Season.WINTER);
  const [nextSeason, setNextSeason] = useState<Season>(getNextSeason(season));
  const [blocksTillNextSeason, setBlocksTillNextSeason] = useState(0);

  const calculateSeasonBlocksLeft = (blockNumber_: number, seasonBlockDuration: number): number =>
    seasonBlockDuration - (blockNumber_ % seasonBlockDuration);

  const updateBlockAndSeason = useCallback((currentBlockNumber: number) => {
    setBlockNumber(currentBlockNumber);
    setBlocksTillNextSeason(calculateSeasonBlocksLeft(currentBlockNumber, publicRuntimeConfig.SEASON_DURATION_BLOCKS));
    const currentSeason = calculateSeason(currentBlockNumber, publicRuntimeConfig.SEASON_DURATION_BLOCKS);
    setSeason(currentSeason);
    setNextSeason(getNextSeason(currentSeason));
  }, []);

  useEffect(() => {
    updateBlockAndSeason(currentBlock);
  }, [currentBlock, updateBlockAndSeason]);

  return (
    <div className="font-bold mr-5">
      <div className="inline">Current block:</div>
      <div className="inline ml-1">{blockNumber}</div>
      <div>
        <div className="inline">Season:</div>
        <div className="inline ml-1">{`${toSentenceCase(season || '')} ${getSeasonPlantEmojis(season, Object.values(SEED_TYPE))}`}</div>
        <div className="inline mx-1 animate-bounce">{' -> '}</div>
        <div className="inline ml-1">Next Season:</div>
        <div className="inline ml-1">{`${toSentenceCase(nextSeason || '')} ${getSeasonPlantEmojis(nextSeason, Object.values(SEED_TYPE))}`}</div>
      </div>
      <div className="">{`Blocks till next season: ${blocksTillNextSeason}`}</div>
    </div>
  );
};

export default BlockCounter;
