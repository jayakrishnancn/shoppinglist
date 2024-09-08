import React, { createContext, useState, useContext } from "react";

// Create a Metadata Context
const MetadataContext = createContext({
  isLoading: false,
  setIsLoading: (_:boolean) => {},
});

// Custom hook to use the Metadata Context
export const useMetadata = () => useContext(MetadataContext);

// Create the Metadata Provider component
export const MetadataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <MetadataContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </MetadataContext.Provider>
  );
};
