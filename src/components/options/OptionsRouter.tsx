import { Divider, Space, Stack, Text } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../api/context/VideoPlayerContext";
import { InstanceSelect } from "./comps/InstanceSelect";
import { FormatSelect } from "./comps/FormatSelect";
import { PreferencesList } from "./comps/PreferencesList";
import { PlaybackSpeed } from "./comps/PlaybackSpeed";
import { OptionsContext } from "./OptionsContext";
import { OptionsMainView } from "./views/MainView";
import { OptionsInstanceView } from "./views/InstanceView";

export const OptionsRouter = () => {
    const { view } = useContext(OptionsContext);
    
    return (
        <Stack align="center" w="100%" p="sm">
            {view == "main" && <OptionsMainView />}
            {view == "instanceSelect" && <OptionsInstanceView />}
        </Stack>
    );
};
