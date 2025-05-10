import { useState, useEffect } from "react";

const UseLocalStorageState = (stateName, initialState) => {
  // Get the initial state from local storage or use the provided initial state
  const getInitialState = () => {
    const storedState = localStorage.getItem(stateName);
    return storedState && storedState !== "undefined"
      ? JSON.parse(storedState)
      : initialState;
  };

  // Initialize state with the initial state
  const [state, setState] = useState(() => getInitialState());

  // Update local storage whenever the state changes
  useEffect(() => {
    localStorage.setItem(stateName, JSON.stringify(state));
  }, [state, stateName]);

  return [state, setState];
};

export default UseLocalStorageState;
