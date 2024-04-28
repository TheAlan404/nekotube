import { ActionIcon, Divider, Group, Select, Space, Stack } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { IconCheck, IconReload } from "@tabler/icons-react";
import { APIContext } from "../../../api/context/APIController";
import { InstanceSelect } from "./InstanceSelect";
import { FormatSelect } from "./FormatSelect";
import { VideoID } from "./VideoID";
import { PreferencesList } from "./PreferencesList";

export const OptionsMenu = () => {
    const { availableFormats } = useContext(VideoPlayerContext);

    return (
        <Stack align="center" w="100%" p="sm">
            <Divider w="90%" label="Debugging" />
            <VideoID />
            <Divider w="90%" label="Instance" />
            <InstanceSelect />
            <Divider w="90%" label="Video" />
            {!!availableFormats.length && <FormatSelect />}
            <Divider w="90%" label="Preferences" />
            <PreferencesList />
            <Space h="20vh" />
        </Stack>
    );
};
