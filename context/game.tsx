import React, { createContext, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { INITIAL_PLOT_CENTER_COORDS, PLOT_SIZE } from '../components/game/utils/constants';
import { PlotInfo } from '../components/game/utils/interfaces';

interface SubscriptionFns {
  submitNewPlotCenter: { (): void };
  selectPlot: { (x: number, y: number, plotInfo: PlotInfo): void };
  uiActionCompleted: { (): void };
  centerChanged: { (x: number, y: number): void };
}

interface IGameContext {
  centerRef: React.MutableRefObject<{ x: number; y: number }>;
  submitNewPlotCenter: (x: number, y: number) => void;
  subscribeToSubmitNewPlotCenter: (fn: SubscriptionFns['submitNewPlotCenter']) => void;
  selectPlot: (x: number, y: number, plotInfo: PlotInfo) => void;
  subscribeToSelectPlot: (fn: SubscriptionFns['selectPlot']) => void;
  uiActionCompleted: () => void;
  subscribeToUiActionCompleted: (fn: SubscriptionFns['uiActionCompleted']) => void;
  centerChanged: (x: number, y: number) => void;
  subscribeToCenterChanged: (fn: SubscriptionFns['centerChanged']) => void;
}

// Currently subscription only supports one subscriber per event
const GameContext = createContext<IGameContext>({
  centerRef: {
    current: {
      x: INITIAL_PLOT_CENTER_COORDS.x * PLOT_SIZE,
      y: INITIAL_PLOT_CENTER_COORDS.y * PLOT_SIZE,
    },
  },
  submitNewPlotCenter: () => {},
  subscribeToSubmitNewPlotCenter: () => {},
  selectPlot: () => {},
  subscribeToSelectPlot: () => {},
  uiActionCompleted: () => {},
  subscribeToUiActionCompleted: () => {},
  centerChanged: () => {},
  subscribeToCenterChanged: () => {},
});

const GameContextProvider = ({ children }: { children: React.ReactNode }) => {
  const centerRef = useRef({
    x: INITIAL_PLOT_CENTER_COORDS.x * PLOT_SIZE,
    y: INITIAL_PLOT_CENTER_COORDS.y * PLOT_SIZE,
  });

  const subscriptionFns = useRef<SubscriptionFns>({
    submitNewPlotCenter: () => {},
    selectPlot: () => {},
    uiActionCompleted: () => {},
    centerChanged: () => {},
  });

  // center teleport input

  const submitNewPlotCenter = (plotX: number, plotY: number) => {
    const x = plotX * PLOT_SIZE;
    const y = plotY * PLOT_SIZE;

    centerRef.current = { x, y };

    // TODO: currently not used delete if not used after refactor
    // subscriptionFns.current.submitNewPlotCenter(plotX, plotY);
  };

  // TODO: currently not used delete if not used after refactor
  const subscribeToSubmitNewPlotCenter = (fn: () => void) => {
    subscriptionFns.current.submitNewPlotCenter = fn;
  };

  // plot click event

  const selectPlot = (x: number, y: number, plotInfo: PlotInfo) => {
    subscriptionFns.current.selectPlot(x, y, plotInfo);
  };

  const subscribeToSelectPlot = (fn: SubscriptionFns['selectPlot']) => {
    subscriptionFns.current.selectPlot = fn;
  };

  // ui (modal) action completed

  const uiActionCompleted = () => {
    subscriptionFns.current.uiActionCompleted();
  };

  const subscribeToUiActionCompleted = (fn: SubscriptionFns['uiActionCompleted']) => {
    subscriptionFns.current.uiActionCompleted = fn;
  };

  // center change (movement or teleport)

  const centerChanged = (x: number, y: number) => {
    subscriptionFns.current.centerChanged(x, y);
  };

  const subscribeToCenterChanged = (fn: SubscriptionFns['centerChanged']) => {
    subscriptionFns.current.centerChanged = fn;
  };

  return (
    <GameContext.Provider
      value={{
        centerRef,
        submitNewPlotCenter,
        subscribeToSubmitNewPlotCenter,
        selectPlot,
        subscribeToSelectPlot,
        uiActionCompleted,
        subscribeToUiActionCompleted,
        centerChanged,
        subscribeToCenterChanged,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

GameContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GameContextProvider;
export const useGame = () => useContext(GameContext);
