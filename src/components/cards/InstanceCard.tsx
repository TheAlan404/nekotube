import { ActionIcon, Code, Grid, Group, Paper, Stack, Text } from "@mantine/core";
import { Instance } from "../../api/types/instances";
import { IconStar } from "@tabler/icons-react";

export const InstanceCard = ({
    instance,
    withControls,
}: {
    instance: Instance,
    isCustom?: boolean,
    withControls?: boolean,
}) => {
    return (
        <Paper w="100%" withBorder p="xs">
            <Grid>
                {withControls && (
                    <Grid.Col span="content">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                        >
                            <IconStar />
                        </ActionIcon>
                    </Grid.Col>
                )}
                <Grid.Col span="auto">
                    <Stack align="start" gap={0}>
                        <Group w="100%" justify="space-between">
                            <Text fw="bold">
                                {instance.name}
                            </Text>
                            <Code>
                                {instance.type}
                            </Code>
                        </Group>
                        <Text c="dimmed" fz="sm">
                            {instance.url}
                        </Text>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};
