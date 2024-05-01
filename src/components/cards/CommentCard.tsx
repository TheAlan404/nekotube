import { Grid, Group, Paper, Stack } from "@mantine/core";
import { Comment } from "../../api/types/comment";
import { MarkdownText } from "../ui/MarkdownText";
import { ChannelCard } from "./ChannelCard";

export const CommentCard = ({
    comment
}: {
    comment: Comment,
}) => {
    return (
        <Paper
            withBorder
            shadow="md"
            p="xs"
        >
            <Stack>
                <Group justify="space-between">
                    <ChannelCard
                        channel={comment.channel}
                    />
                </Group>
                <MarkdownText
                    text={comment.content}
                />
            </Stack>
        </Paper>
    );
};
