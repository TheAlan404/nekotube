import { createContext, useState } from "react";
import { TabType } from "./TabTypes";

export interface TabsAPI {
    currentTab: TabType;
    setCurrentTab: (tab: TabType) => void,
    isTabsVisible: boolean,
    setTabsVisible: (v: boolean) => void,
};

export const TabsContext = createContext<TabsAPI>({
    currentTab: "recommended",
    setCurrentTab: () => {},
    isTabsVisible: false,
    setTabsVisible: () => {},
});

export const TabsProvider = ({ children }: React.PropsWithChildren) => {
    const [currentTab, setCurrentTab] = useState<TabType>("recommended");
    const [isTabsVisible, setTabsVisible] = useState<boolean>(true);
    
    return (
        <TabsContext.Provider
            value={{
                currentTab,
                setCurrentTab,
                isTabsVisible,
                setTabsVisible,
            }}
        >
            {children}
        </TabsContext.Provider>
    );
};
