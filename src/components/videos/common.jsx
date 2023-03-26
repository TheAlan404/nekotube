import { Avatar, Group, Text, Tooltip } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

export function Channel(props) {
    return (
        <Group align="center" spacing="xs">
            {props.channel?.avatar && <Avatar size="sm" radius="xl" src={props.channel?.avatar} />}
            <Text>
                {props.channel?.title}
            </Text>
            {props.channel?.badges?.map((b, i) => <>
                {b.style == "BADGE_STYLE_TYPE_VERIFIED" && <Tooltip key={i} label={b.tooltip}>
                    <IconCheck size="1em" />
                </Tooltip>}
            </>)}
        </Group>
    );
}

export function MiniInfo(props) {
    return (
        <Text inherit c="dimmed" fz="sm">
            <Text inherit>
                {props.viewCount} - {props.published || props.dateText}
            </Text>
        </Text>
    );
}
