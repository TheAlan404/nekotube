import { createContext, useMemo, useState } from "react";
import { TabType } from "./TabTypes";

export interface TabsAPI {
    currentTab: TabType;
    availableTabs: TabType[];
    setCurrentTab: (tab: TabType) => void,
    isTabsVisible: boolean,
    setTabsVisible: (v: boolean) => void,
};

export const TabsContext = createContext<TabsAPI>({
    currentTab: "recommended",
    availableTabs: ["videoInfo", "recommended", "comments", "chapters"],
    setCurrentTab: () => {},
    isTabsVisible: false,
    setTabsVisible: () => {},
});

export const TabsProvider = ({ children }: React.PropsWithChildren) => {
    const [currentTab, setCurrentTab] = useState<TabType>("recommended");
    const [isTabsVisible, setTabsVisible] = useState<boolean>(true);

    const availableTabs = useMemo(() => {
        return [
            "videoInfo",
            "recommended",
            "comments",
            "chapters",
        ] as TabType[];
    }, []);
    
    return (
        <TabsContext.Provider
            value={{
                currentTab,
                setCurrentTab,
                isTabsVisible,
                setTabsVisible,
                availableTabs,
            }}
        >
            {children}
        </TabsContext.Provider>
    );
};
