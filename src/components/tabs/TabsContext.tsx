import { createContext, useMemo, useState } from "react";
import { TabType, UIFlavor } from "./TabTypes";

export interface TabsAPI {
    currentTab: TabType;
    availableTabs: TabType[];
    setCurrentTab: (tab: TabType) => void,
    isTabsVisible: boolean,
    setTabsVisible: (v: boolean) => void,
    flavor: UIFlavor;
    setFlavor: (f: UIFlavor) => void;
};

export const TabsContext = createContext<TabsAPI>({
    currentTab: "recommended",
    availableTabs: ["videoInfo", "recommended", "comments", "chapters"],
    setCurrentTab: () => {},
    isTabsVisible: false,
    setTabsVisible: () => {},
    flavor: "video",
    setFlavor: () => {},
});

export const TabsProvider = ({ children }: React.PropsWithChildren) => {
    const [currentTab, setCurrentTab] = useState<TabType>("recommended");
    const [flavor, setFlavor] = useState<UIFlavor>("video");
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
                flavor,
                setFlavor,
            }}
        >
            {children}
        </TabsContext.Provider>
    );
};
