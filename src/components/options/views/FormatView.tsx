import { useContext, useState } from "react";
import { OptionsContext } from "../OptionsContext";
import { Button, Checkbox, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { FormatCard } from "../../cards/FormatCard";
import { VideoFormatType } from "../../../api/types/format";

export const OptionsFormatView = () => {
    const { setView } = useContext(OptionsContext);
    const {
        availableFormats,
        activeFormat,
        setFormat,
    } = useContext(VideoPlayerContext);

    const [filterFormatType, setFilterFormatType] = useState<VideoFormatType | "all">("basic");
    const [filterProxy, setFilterProxy] = useState<boolean | null>(null);

    const options = availableFormats
        .filter(f => filterFormatType == "all" || f.type == filterFormatType)
        .filter(f => filterProxy === null || f.isProxied == filterProxy);

    return (
        <Stack w="100%">
            <Stack w="100%">
                <Group w="100%" justify="space-between">
                    <Text>
                        Format Types
                    </Text>
                    <SegmentedControl
                        data={[
                            "all",
                            "basic",
                            "adaptive",
                            "dash",
                            "hls",
                        ]}
                        value={filterFormatType}
                        onChange={(v) => setFilterFormatType(v as VideoFormatType | "all")}
                    />
                </Group>
                <Group w="100%" justify="space-between">
                    <Text>
                        Proxied
                    </Text>
                    <SegmentedControl
                        data={[
                            "all",
                            "true",
                            "false",
                        ]}
                        value={filterProxy === null ? "all" : String(filterProxy)}
                        onChange={(v) => setFilterProxy(v == "all" ? null : (v == "true" ? true : false))}
                    />
                </Group>
            </Stack>
            <Stack w="100%">
                {options.map((format, i) => (
                    <FormatCard
                        format={format}
                        isSelected={activeFormat.id == format.id}
                        onClick={() => setFormat(format.id)}
                        key={i}
                    />
                ))}
            </Stack>
        </Stack>
    );
};
