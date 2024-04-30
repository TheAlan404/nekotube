import { ActionIcon, Button, Grid, Group, Paper, SegmentedControl, Select, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import { useContext } from "react";
import { OptionsContext } from "../OptionsContext";
import { IconArrowBack, IconArrowLeft, IconReload } from "@tabler/icons-react";
import { APIContext } from "../../../api/context/APIController";
import { Instance } from "../../../api/types/instances";

export const OptionsInstanceView = () => {
    const { setView } = useContext(OptionsContext);
    const {
        availableInstances,
        currentInstance,
        setInstance: setInstanceReal,
        isRefreshing,
        refreshAvailableInstances,
        customInstance,
        setCustomInstance,
    } = useContext(APIContext);

    const setInstance = (value: "custom" | string) => {
        if(value == "custom") {
            setCustomInstance(true);
        } else {
            setCustomInstance(false);
            setInstanceReal(availableInstances.find(i => i.url == value));
        }
    };

    return (
        <Stack align="center" w="100%" px="sm">
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
            <Grid align="end" w="100%">
                <Grid.Col span="auto">
                    <Select
                        label="Instance"
                        value={customInstance ? "custom" : currentInstance.url}
                        disabled={isRefreshing}
                        data={[
                            {
                                group: "Lighttube",
                                items: [
                                    ...availableInstances
                                        .filter(i => i.type == "lighttube")
                                        .map(i => i.url),
                                ]
                            },
                            {
                                group: "Invidious",
                                items: [
                                    ...availableInstances
                                        .filter(i => i.type == "invidious")
                                        .map(i => i.url),
                                ]
                            },
                            {
                                group: "Custom",
                                items: [
                                    "custom"
                                ]
                            }
                        ]}
                        onChange={(v) => setInstance(v)}
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
            {customInstance && (
                <Paper w="100%">
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
                                onChange={(type: Instance["type"]) => setInstanceReal({
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
                            onChange={(e) => setInstanceReal({
                                ...currentInstance,
                                name: "Custom",
                                url: e.currentTarget.value,
                            })}
                        />
                    </Stack>
                </Paper>
            )}
        </Stack>
    );
};
