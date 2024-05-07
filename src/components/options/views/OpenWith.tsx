import { Box, Grid, Paper, Stack, Tabs, Text } from "@mantine/core";
import React, { useContext } from "react";
import { APIContext } from "../../../api/provider/APIController";
import { IconBrandYoutube } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { InstanceCard } from "../../cards/InstanceCard";

export const OptionsOpenWithView = () => {
    const location = useLocation();
    const { availableInstances } = useContext(APIContext);

    let u = (host: string) => host + location.pathname + location.search;

    return (
        <Stack w="100%">
            <Tabs defaultValue="yt">
                <Tabs.List grow>
                    <Tabs.Tab value="yt">YouTube</Tabs.Tab>
                    <Tabs.Tab value="invidious">Invidious</Tabs.Tab>
                    <Tabs.Tab value="lighttube">LightTube</Tabs.Tab>
                    <Tabs.Tab value="poketube">PokeTube</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="yt">
                    <Stack p="xs">
                        <YTButton
                            name="YouTube"
                            url="https://www.youtube.com"
                            href={u("https://www.youtube.com")}
                            icon={<IconBrandYoutube />}
                        />
                        <YTButton
                            name="YouTube Music"
                            url="https://music.youtube.com"
                            href={u("https://music.youtube.com")}
                            icon={<IconBrandYoutube />}
                        />
                    </Stack>
                </Tabs.Panel>

                {["invidious", "lighttube", "poketube"].map((type, i) => (
                    <Tabs.Panel value={type} key={i}>
                        <Stack p="xs">
                            {availableInstances.filter(x => x.type == type).map((instance, i) => (
                                <Paper
                                    component="a"
                                    href={u(instance.url)}
                                    c="var(--mantine-color-text)"
                                    key={i}
                                >
                                    <InstanceCard
                                        instance={instance}
                                    />
                                </Paper>
                            ))}
                        </Stack>
                    </Tabs.Panel>
                ))}
            </Tabs>
        </Stack>
    );
};

const YTButton = ({
    name,
    url,
    href,
    icon
}: {
    name: string;
    url: string;
    href: string;
    icon: React.ReactNode;
}) => {
    return (
        <Paper
            w="100%"
            withBorder
            p="xs"
            c="var(--mantine-color-text)"
            style={{
                cursor: "pointer",
            }}
            className="hoverable"
            component="a"
            href={href}
        >
            <Grid>
                <Grid.Col span="content">
                    <Stack h="100%" gap={0} justify="center" align="center">
                        {icon}
                    </Stack>
                </Grid.Col>
                <Grid.Col span="auto">
                    <Stack align="start" gap={0}>
                        <Text fw="bold">
                            {name}
                        </Text>
                        <Text c="dimmed" fz="sm">
                            {url}
                        </Text>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Paper>
    )
};
