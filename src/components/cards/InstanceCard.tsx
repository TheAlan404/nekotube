import { ActionIcon, Checkbox, CheckIcon, Code, Grid, Group, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { Instance } from "../../api/types/instances";
import { IconCheck, IconStar, IconStarFilled, IconWorldCheck, IconWorldX } from "@tabler/icons-react";
import { useContext } from "react";
import { APIContext } from "../../api/provider/APIController";
import { getFlagEmoji } from "../../utils/flagEmoji";

export const InstanceCard = ({
    instance,
    withControls,
    isSelected,
    isCustom,
    onClick,
}: {
    instance: Instance,
    isCustom?: boolean,
    withControls?: boolean,
    isSelected?: boolean,
    onClick?: () => void,
}) => {
    const { favourited, addFavourite, removeFavourite } = useContext(APIContext);

    const fav = favourited.some(x => x.url == instance.url);

    return (
        <Paper w="100%" withBorder p="xs" bg={isSelected ? "dark.6" : undefined} style={{
            cursor: "pointer",
        }} onClick={onClick}>
            <Grid>
                <Grid.Col span="content">
                    <Stack h="100%" gap={0} justify="center" align="center">
                        {isSelected && (
                            <IconCheck color="var(--mantine-color-green-filled)" />
                        )}
                    </Stack>
                </Grid.Col>
                <Grid.Col span="auto">
                    <Stack align="start" gap={0}>
                        <Group w="100%" justify="space-between">
                            <Text fw="bold">
                                {instance.name}
                            </Text>
                            <Code>
                                {instance.type}
                                {isCustom && " / custom"}
                            </Code>
                        </Group>
                        <Group w="100%" justify="space-between">
                            <Text c="dimmed" fz="sm">
                                {instance.url}
                            </Text>
                            <Group>
                                <Text fs="xs">
                                    {instance.region && getFlagEmoji(instance.region)}
                                </Text>
                                {!instance.supportsProxy && (
                                    <Tooltip label="Instance doesn't support proxying" withArrow>
                                        <IconWorldX color="var(--mantine-color-yellow-filled)" />
                                    </Tooltip>
                                )}
                                {withControls && (
                                    <Tooltip
                                        label={fav ? "Remove from favourites" : "Add to favourites"}
                                        withArrow
                                    >
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (fav)
                                                    removeFavourite(instance);
                                                else
                                                    addFavourite(instance);
                                            }}
                                        >
                                            {fav ? (
                                                <IconStarFilled color="var(--mantine-color-yellow-filled)" />
                                            ) : (
                                                <IconStar />
                                            )}
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </Group>
                        </Group>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};
