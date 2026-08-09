import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem('eliterank_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);
  const [subpropertyModalData, setSubpropertyModalData] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('eliterank_compare', JSON.stringify(compareItems));
    } catch (e) {
      console.error('Failed to save comparison to localStorage:', e);
    }
  }, [compareItems]);

  const addToCompare = (item) => {
    if (compareItems.some(i => i.id === item.id)) {
      return;
    }
    if (compareItems.length >= 4) {
      alert('You can compare up to 4 items simultaneously. Please remove an item first.');
      return;
    }
    setCompareItems(prev => [...prev, item]);
    setIsCompareDrawerOpen(true);
  };

  const removeFromCompare = (itemId) => {
    setCompareItems(prev => prev.filter(i => i.id !== itemId));
  };

  const isInCompare = (itemId) => {
    return compareItems.some(i => i.id === itemId);
  };

  const toggleCompare = (item) => {
    if (isInCompare(item.id)) {
      removeFromCompare(item.id);
    } else {
      addToCompare(item);
    }
  };

  const clearCompare = () => {
    setCompareItems([]);
    setIsCompareDrawerOpen(false);
  };

  // Open Subproperty Link / Specification Inspector Modal
  const openSubpropertyModal = (item, propKey, propValue) => {
    setSubpropertyModalData({
      item,
      propKey,
      propValue,
      website: item.custom_values?.website || item.website || 'https://www.google.com'
    });
  };

  const closeSubpropertyModal = () => {
    setSubpropertyModalData(null);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        isInCompare,
        toggleCompare,
        clearCompare,
        isCompareDrawerOpen,
        setIsCompareDrawerOpen,
        subpropertyModalData,
        openSubpropertyModal,
        closeSubpropertyModal
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
