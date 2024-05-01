import { Group, Select, Stack } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { IconCheck } from "@tabler/icons-react";

export const FormatSelect = () => {
    const {
        availableFormats,
        activeFormat,
        setFormat,
    } = useContext(VideoPlayerContext);

    return (
        <Select
            w="100%"
            label={"Format"}
            value={activeFormat.itag}
            onChange={(v) => setFormat(v)}
            data={availableFormats.map((f, i) => f.id)}
            renderOption={({ option: { value }, checked }) => (
                <Group justify="space-between">
                    <Group>
                        <Stack>
                            {availableFormats.find(x => x.id == value).id}
                            {availableFormats.find(x => x.id == value).itag}
                            {availableFormats.find(x => x.id == value).mimeType}
                            {availableFormats.find(x => x.id == value).fps}
                        </Stack>
                    </Group>
                    <Group>
                        {checked && <IconCheck />}
                    </Group>
                </Group>
            )}
        />
    );
};
