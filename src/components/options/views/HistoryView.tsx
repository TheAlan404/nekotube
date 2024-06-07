import React, { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { ActionIcon, Button, Divider, Grid, Group, Paper, SegmentedControl, Space, Stack, Text, Tooltip } from "@mantine/core";
import { InstanceSelect } from "../comps/InstanceSelect";
import { FormatSelect } from "../comps/FormatSelect";
import { PlaybackSpeed } from "../comps/PlaybackSpeed";
import { PreferencesList } from "../comps/PreferencesList";
import { DebuggingSection } from "../comps/DebuggingSection";
import { OpenWithButton } from "../links/OpenWithButton";
import { LoopVideo } from "../comps/LoopVideo";
import { ThemeSection } from "../comps/ThemeSection";
import { FlavorOption } from "../comps/Flavor";
import { HistoryItem, useNekoTubeHistory } from "../../../api/pref/History";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { FetchVideoWrapper, HorizontalVideoCard } from "../../cards/VideoCard";
import { DateCard } from "../../cards/DateCard";

export const OptionsHistoryView = () => {
    const history = useNekoTubeHistory();
    const [showTypes, setShowTypes] = useState<"*" | "s" | "v">("*");

    return (
        <Stack w="100%">
            <Divider w="100%" label="Manage" labelPosition="left" />
            <Group grow>
                <Button
                    variant="light"
                    color="red"
                    leftSection={<IconTrash />}
                    onDoubleClick={() => history.clear()}
                >
                    Clear All (double click)
                </Button>
            </Group>

            <Divider w="100%" label="History" labelPosition="left" />

            <Group justify="space-between">
                <Text>
                    Filter by:
                </Text>
                <SegmentedControl
                    data={[
                        { label: "All", value: "*" },
                        { label: "Videos", value: "v" },
                        { label: "Search", value: "s" },
                    ]}
                    value={showTypes}
                    onChange={(v: "*" | "v" | "s") => setShowTypes(v)}
                />
            </Group>
            
            {history.history
                .sort(([_, __, a], [___, ____, b]) => b-a)
                .filter(([t]) => showTypes == "*" || t == showTypes)
                .map(([type, data, ts], idx) => (
                <Stack gap={0}>
                    {({
                        s: () => (
                            <Paper p="sm" withBorder key={idx}>
                                <Group align="center">
                                    <IconSearch />
                                    <Text>
                                        {data}
                                    </Text>
                                </Group>
                            </Paper>
                        ),
                        v: () => (
                            <FetchVideoWrapper
                                id={data}
                                component={HorizontalVideoCard}
                            />
                        ),
                    } as Record<HistoryItem[0], () => React.ReactNode>)[type]()}
                    <Group justify="space-between">
                        <DateCard date={new Date(ts)} />
                        <Group>
                            <Tooltip label="Delete">
                                <ActionIcon
                                    variant="light"
                                    color="red"
                                    onClick={() => {
                                        history.setHistory(v => v
                                            .filter(([a, b, c]) => !((a == type && b == data) && (ts == c))))
                                    }}
                                >
                                    <IconTrash />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>
                </Stack>
            ))}

            <Space h="20vh" />
        </Stack>
    );
};
