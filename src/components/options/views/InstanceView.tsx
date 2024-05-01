import { ActionIcon, Box, Button, Checkbox, Combobox, Divider, Flex, Grid, Group, Loader, LoadingOverlay, Paper, ScrollArea, SegmentedControl, Select, Stack, Tabs, Text, TextInput, Tooltip, useCombobox } from "@mantine/core";
import { useContext, useState } from "react";
import { OptionsContext } from "../OptionsContext";
import { IconArrowBack, IconArrowLeft, IconReload, IconStar } from "@tabler/icons-react";
import { APIContext } from "../../../api/context/APIController";
import { Instance } from "../../../api/types/instances";
import { InstanceCard } from "../../cards/InstanceCard";

export const OptionsInstanceView = () => {
    const { setView } = useContext(OptionsContext);
    const {
        availableInstances,
        currentInstance,
        setInstance,
        isRefreshing,
        refreshAvailableInstances,
        customInstance,
        setCustomInstance,
        favourited,
    } = useContext(APIContext);
    const [tab, setTab] = useState<Instance["type"] | "custom" | "favs">(favourited.length ? "favs" : (
        customInstance ? "custom" : currentInstance.type
    ));
    const [search, setSearch] = useState("");

    const allOptions = tab == "custom" ? [] : (
        tab == "favs" ? (
            favourited
        ) : (
            availableInstances.filter(x => x.type == tab)
        )
    );

    const options = allOptions.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

    const instanceList = isRefreshing ? [
        <Stack w="100%" align="center" py="md">
            <Loader />
            <Text>
                Fetching public instances...
            </Text>
        </Stack>
    ] : options.map((instance, i) => (
        <Box
            key={i}
            w="100%"
            p="xs"
            className="hoverable"
        >
            <InstanceCard
                instance={instance}
                isSelected={instance.url == currentInstance.url}
                withControls
                onClick={() => setInstance(instance)}
            />
        </Box>
    ));

    return (
        <Stack align="center" w="100%">
            <Group w="100%" justify="start">
                <Button
                    variant="light"
                    color="violet"
                    leftSection={<IconArrowLeft />}
                    onClick={() => setView("main")}
                    fullWidth
                    size="compact-md"
                >
                    Back
                </Button>
            </Group>
            <Stack w="100%">
                <Tabs value={tab} onChange={(v) => {
                    setTab(v as Instance["type"] | "custom" | "favs");
                    setCustomInstance(v == "custom");
                }}>
                    <Tabs.List grow>
                        <Tabs.Tab value="favs">
                            <IconStar size="1em" />
                        </Tabs.Tab>
                        <Tabs.Tab value="lighttube">
                            LightTube
                        </Tabs.Tab>
                        <Tabs.Tab value="invidious">
                            Invidious
                        </Tabs.Tab>
                        <Tabs.Tab value="custom">
                            Custom
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="favs">
                        <Stack gap={0} w="100%" align="center">
                            {instanceList}
                            {!options.length && (
                                <Text c="dimmed" p="md">
                                    No favourited instances
                                </Text>
                            )}
                        </Stack>
                    </Tabs.Panel>

                    {["lighttube", "invidious"].map((type, i) => (
                        <Tabs.Panel
                            value={type}
                            key={i}
                        >
                            <InstanceSearch
                                search={search}
                                setSearch={setSearch}
                            />
                            {instanceList}
                        </Tabs.Panel>
                    ))}

                    <Tabs.Panel value="custom">
                        <Stack w="100%" py="sm">
                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Text>
                                        Instance Type
                                    </Text>
                                    <SegmentedControl
                                        data={[
                                            { value: "lighttube", label: "LightTube" },
                                            { value: "invidious", label: "Invidious" },
                                        ]}
                                        value={currentInstance.type}
                                        onChange={(type: Instance["type"]) => setInstance({
                                            ...currentInstance,
                                            name: "Custom",
                                            type,
                                        })}
                                    />
                                </Group>
                                <TextInput
                                    label="URL"
                                    description="URL of the instance without trailing /"
                                    value={currentInstance.url}
                                    onChange={(e) => setInstance({
                                        ...currentInstance,
                                        name: "Custom",
                                        url: e.currentTarget.value,
                                    })}
                                />
                            </Stack>
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </Stack>
    );
};

const InstanceSearch = ({
    search,
    setSearch,
}: {
    search: string;
    setSearch: (s: string) => void;
}) => {
    const {
        isRefreshing,
        refreshAvailableInstances,
    } = useContext(APIContext);

    return (
        <Grid align="end" w="100%" p="sm" style={{ position: "sticky" }}>
            <Grid.Col span="auto">
                <TextInput
                    label="Search public instances"
                    value={search}
                    disabled={isRefreshing}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                />
            </Grid.Col>
            <Grid.Col span="content">
                <Tooltip label="Refresh public instances">
                    <ActionIcon
                        variant="light"
                        color="violet"
                        onClick={() => refreshAvailableInstances()}
                    >
                        <IconReload />
                    </ActionIcon>
                </Tooltip>
            </Grid.Col>
        </Grid>
    )
}
