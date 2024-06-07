import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { Button, Divider, Grid, Space, Stack, Text } from "@mantine/core";
import { InstanceSelect } from "../comps/InstanceSelect";
import { FormatSelect } from "../comps/FormatSelect";
import { PlaybackSpeed } from "../comps/PlaybackSpeed";
import { PreferencesList } from "../comps/PreferencesList";
import { DebuggingSection } from "../comps/DebuggingSection";
import { OpenWithButton } from "../links/OpenWithButton";
import { LoopVideo } from "../comps/LoopVideo";
import { ThemeSection } from "../comps/ThemeSection";
import { FlavorOption } from "../comps/Flavor";
import { OptionsContext } from "../OptionsContext";
import { IconClock } from "@tabler/icons-react";

export const OptionsMainView = () => {
    const { videoInfo } = useContext(VideoPlayerContext);
    const { setView } = useContext(OptionsContext);

    const loaded = !!videoInfo;

    return (
        <Grid w="100%">
            <Grid.Col span="auto">
                <Stack align="center" w="100%">
                    <Divider w="100%" label="Video" labelPosition="left" />
                    <OpenWithButton fullWidth />
                    {!loaded && (
                        <Text>Video not loaded</Text>
                    )}
                    {loaded && <FormatSelect />}
                    {loaded && <PlaybackSpeed />}
                    {loaded && <LoopVideo />}
                    <Divider w="100%" label="Preferences" labelPosition="left" />
                    <PreferencesList />
                    <Divider w="100%" label="UI Flavor" labelPosition="left" />
                    <FlavorOption />
                    <Divider w="100%" label="Theme" labelPosition="left" />
                    <ThemeSection />
                    <Divider w="100%" label="History" labelPosition="left" />
                    <Button
                        fullWidth
                        variant="light"
                        leftSection={<IconClock />}
                        onClick={() => setView("history")}
                    >
                        History
                    </Button>
                    <Divider w="100%" label="Instance" labelPosition="left" />
                    <InstanceSelect />
                    <Divider w="100%" label="Debugging" labelPosition="left" />
                    <DebuggingSection />
                    <Space h="20vh" />
                </Stack>
            </Grid.Col>
        </Grid>
    );
};
