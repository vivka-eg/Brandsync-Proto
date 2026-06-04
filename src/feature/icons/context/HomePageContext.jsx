import useHomePage from "../hooks/useHomePage";
import { createContext, useContext } from "react";

export const HomePageContext = createContext({});

export const HomePageContextProvider = ({ children }) => {
  const context = useHomePage();

  return (
    <HomePageContext.Provider value={context}>
      {children}
    </HomePageContext.Provider>
  );
};

export const useHomePageContext = () => {
  const context = useContext(HomePageContext);
  if (!context) {
    throw new Error(
      "useHomePageContext must be used within a HomePageContextProvider"
    );
  }
  return context;
};
