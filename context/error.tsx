import React, {
  createContext, useContext, useState,
} from 'react';
import PropTypes from 'prop-types';

interface IErrorContext {
  error: string,
  setError: (message: string) => void,
}

const ErrorContext = createContext<IErrorContext>({
  error: '',
  setError: () => {},
});

const ErrorContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState('');

  return (
    <ErrorContext.Provider value={{
      error,
      setError,
    }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

ErrorContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorContextProvider;
export const useError = () => useContext(ErrorContext);
