import React, { createContext, useState, useContext } from 'react';

const ActiveArrowContext = createContext();

export const useActiveArrow = () => useContext(ActiveArrowContext);

export const ActiveArrowProvider = ({ children }) => {
  const [activeQuiver, setActiveQuiver] = useState(null); // { id, name }
  const [activeArrow, setActiveArrow] = useState(null); // { id, name, quiverId }

  const selectQuiver = (quiver) => {
    setActiveQuiver(quiver);
    setActiveArrow(null); // Clear arrow when quiver changes
  };

  const selectArrow = (arrow, quiver) => {
    setActiveQuiver(quiver); // Ensure quiver is also set/updated
    setActiveArrow(arrow);
  };

  const clearSelection = () => {
    setActiveQuiver(null);
    setActiveArrow(null);
  };

  return (
    <ActiveArrowContext.Provider
      value={{
        activeQuiver,
        activeArrow,
        selectQuiver,
        selectArrow,
        clearSelection,
      }}
    >
      {children}
    </ActiveArrowContext.Provider>
  );
};
