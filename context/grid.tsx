import React, {
  createContext, useState, useEffect, useContext, useRef,
} from 'react';
import PropTypes from 'prop-types';

export interface IGridContext {
  isLoading: boolean,
  error: string,
  center: { x: number, y: number },
  updateError: (errorMessage: string) => void,
  updateCenter: (x: number, y: number) => void,
  subscribeOnCenterChange: (fn: () => {}) => void,
}

const GridContext = createContext<IGridContext>({
  isLoading: false,
  error: '',
  center: { x: 3, y: 3 },
  updateError: (errorMessage: string) => {},
  updateCenter: (x: number, y: number) => {},
  subscribeOnCenterChange: (fn: () => {}) => {},
});

const GridContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [center, setCenter] = useState({ x: 3, y: 3 });
  const onCenterChange = useRef((center: { x: number, y: number }) => {});

  const updateError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const updateCenter = (x: number, y: number) => {
    setCenter({ x, y });
    console.log('Nested grid update');
    console.log('updateCenter ~ onCenterChange.current', onCenterChange.current)
    onCenterChange.current({ x, y });
  };

  const subscribeOnCenterChange = (fn) => {
    console.log('subscribeOnCenterChange ~ fn', fn)
    onCenterChange.current = fn;
  };

  return (
    <GridContext.Provider value={{
      isLoading,
      error,
      center,
      updateError,
      updateCenter,
      subscribeOnCenterChange,
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
