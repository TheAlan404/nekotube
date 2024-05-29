import { useContext } from "react";
import { TabsContext } from "../../tabs/TabsContext";
import { SegmentedControl } from "@mantine/core";
import { UIFlavor } from "../../tabs/TabTypes";

export const FlavorOption = () => {
    const { flavor, setFlavor } = useContext(TabsContext);

    return (
        <SegmentedControl
            value={flavor}
            data={["video", "music"] as UIFlavor[]}
            onChange={(v) => setFlavor(v as UIFlavor)}
        />
    )
};
