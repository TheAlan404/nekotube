import { useContext } from "react";
import { TabsContext } from "../TabsContext";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconLayoutSidebarRightCollapse, IconLayoutSidebarRightExpand } from "@tabler/icons-react";

export const ToggleSidebarButton = () => {
    const { isTabsVisible, setTabsVisible } = useContext(TabsContext);

    return (
        <Tooltip label={isTabsVisible ? "Hide sidebar" : "Show sidebar"} positionDependencies={[isTabsVisible]}>
            <ActionIcon
                variant="light"
                color="violet"
                onClick={() => setTabsVisible(!isTabsVisible)}
            >
                {isTabsVisible ? (
                    <IconLayoutSidebarRightCollapse />
                ) : (
                    <IconLayoutSidebarRightExpand />
                )}
            </ActionIcon>
        </Tooltip>
    );
};
