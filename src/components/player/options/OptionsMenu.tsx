import { ActionIcon, Divider, Group, Select, Space, Stack, Text } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { IconCheck, IconReload } from "@tabler/icons-react";
import { APIContext } from "../../../api/context/APIController";
import { InstanceSelect } from "./comps/InstanceSelect";
import { FormatSelect } from "./comps/FormatSelect";
import { VideoID } from "./comps/VideoID";
import { PreferencesList } from "./comps/PreferencesList";
import { PlaybackSpeed } from "./comps/PlaybackSpeed";

export const OptionsMenu = () => {
    const { availableFormats, playState } = useContext(VideoPlayerContext);

    const loaded = playState !== "error" && playState !== "loading";

    return (
        <Stack align="center" w="100%" p="sm">
            <Divider w="90%" label="Debugging" />
            <VideoID />
            <Divider w="90%" label="Instance" />
            <InstanceSelect />
            <Divider w="90%" label="Video" />
            {!loaded && (
                <Text>Video not loaded</Text>
            )}
            {loaded && <FormatSelect />}
            {loaded && <PlaybackSpeed />}
            <Divider w="90%" label="Preferences" />
            <PreferencesList />
            <Space h="20vh" />
        </Stack>
    );
};
