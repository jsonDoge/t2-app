import React, {
  createContext, useState, useContext,
} from 'react';
import PropTypes from 'prop-types';

export interface IGridContext {
  isLoading: boolean,
  error: string,
  center: { x: number, y: number },
  updateError: (errorMessage: string) => void,
  updateCenter: (x: number, y: number) => void,
}

const GridContext = createContext<IGridContext>({
  isLoading: false,
  error: '',
  center: { x: 3, y: 3 },
  updateError: (errorMessage: string) => {},
  updateCenter: (x: number, y: number) => {},
});

const GridContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [center, setCenter] = useState({ x: 3, y: 3 });

  const updateError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const updateCenter = (x: number, y: number) => {
    setCenter({ x, y });
  };

  return (
    <GridContext.Provider value={{
      isLoading,
      error,
      center,
      updateError,
      updateCenter,
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
