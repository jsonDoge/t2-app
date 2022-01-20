import React, {
  createContext, useState, useContext, useRef,
} from 'react';
import PropTypes from 'prop-types';

export interface IGridContext {
  isLoading: boolean,
  error: string,
  centerRef: React.MutableRefObject<{ x: number, y: number }>,
  updateError: (errorMessage: string) => void,
  updateCenter: (x: number, y: number) => void,
  subscribeToCenter: (fn) => void
}

const GridContext = createContext<IGridContext>({
  isLoading: false,
  error: '',
  centerRef: { current: { x: 3, y: 3 } },
  updateError: (errorMessage: string) => {},
  updateCenter: (x: number, y: number) => {},
  subscribeToCenter: (fn) => {},
});

const GridContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const centerRef = useRef({ x: 3, y: 3 });
  const subscribedFn = useRef(() => {});

  const updateError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const updateCenter = (x: number, y: number) => {
    console.log(centerRef.current);
    centerRef.current = { x, y };
    subscribedFn.current();
  };

  const subscribeToCenter = (fn) => {
    subscribedFn.current = fn;
  };

  return (
    <GridContext.Provider value={{
      isLoading,
      error,
      centerRef,
      updateError,
      updateCenter,
      subscribeToCenter,
    }}
    >
      {children}
    </GridContext.Provider>
  );
};

GridContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GridContextProvider;
export const useGrid = () => useContext(GridContext);
