import { Code, Grid, Group, Paper, Stack, Text } from "@mantine/core";
import { VideoFormat } from "../../api/types/format";
import { IconCheck } from "@tabler/icons-react";

export const FormatCard = ({
    format,
    isSelected,
    onClick,
}: {
    format: VideoFormat,
    isSelected?: boolean,
    onClick?: () => void,
}) => {
    return (
        <Paper w="100%" withBorder p="xs" bg={isSelected ? "dark.6" : undefined} style={{
            cursor: "pointer",
        }} onClick={onClick}>
            <Grid>
                <Grid.Col span="content">
                    <Stack h="100%" justify="center" align="center">
                        {isSelected && (
                            <IconCheck color="var(--mantine-color-green-filled)" />
                        )}
                    </Stack>
                </Grid.Col>
                <Grid.Col span="auto">
                    <Stack align="start" gap={0}>
                        <Group w="100%" justify="space-between">
                            <Code>
                                {format.id}
                            </Code>
                            <Code>
                                {format.itag}
                            </Code>
                        </Group>
                        <Text>
                            {format.mimeType}
                        </Text>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};

