import { ActionIcon, Group, Select, Stack } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { IconCheck, IconReload } from "@tabler/icons-react";
import { APIContext } from "../../../api/context/APIController";
import { InstanceSelect } from "./InstanceSelect";
import { FormatSelect } from "./FormatSelect";

export const OptionsMenu = () => {
    const { availableFormats } = useContext(VideoPlayerContext);

    return (
        <Stack>
            <InstanceSelect />
            {!!availableFormats.length && <FormatSelect />}
        </Stack>
    );
};
