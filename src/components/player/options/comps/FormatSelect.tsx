import { Group, Select, Stack } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../../api/context/VideoPlayerContext";
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
            onChange={(v) => setFormat(availableFormats[Number(v)]!)}
            data={availableFormats.map((f, i) => i.toString())}
            renderOption={({ option: { value: i }, checked }) => (
                <Group justify="space-between">
                    <Group>
                        <Stack>
                            {availableFormats[Number(i)].itag}
                            {availableFormats[Number(i)].mimeType}
                            {availableFormats[Number(i)].fps}
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
