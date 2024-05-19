import { ActionIcon, Box, CopyButton, Grid, Group, Paper, Stack, Tooltip } from "@mantine/core";
import { Comment } from "../../api/types/comment";
import { MarkdownText } from "../ui/MarkdownText";
import { ChannelCard } from "./ChannelCard";
import { VotingCard } from "./VotingCard";
import { IconCopy, IconPencil, IconPinned, IconTableImport, IconTableOff } from "@tabler/icons-react";
import { parseChapters } from "../../utils/parseChapters";
import { useContext } from "react";
import { VideoPlayerContext } from "../../api/player/VideoPlayerContext";
import { parseFormattedText, textPartsToString } from "../../utils/parseFormattedText";
import { DateCard } from "./DateCard";
import { TimestampRegex } from "../../utils/timestamp";

export const CommentCard = ({
    comment
}: {
    comment: Comment,
}) => {
    const { activeChapters, setActiveChapters } = useContext(VideoPlayerContext);

    const hasChapters = comment.content.match(TimestampRegex)?.length > 1;
    const isChaptersSource = activeChapters.type == "comment" && activeChapters.id == comment.id;

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
                    <Group>
                        <DateCard
                            date={comment.published}
                        />
                        {comment.edited && (
                            <Tooltip label="Edited">
                                <IconPencil />
                            </Tooltip>
                        )}
                        {comment.pinned && (
                            <Tooltip label="Pinned">
                                <IconPinned />
                            </Tooltip>
                        )}
                    </Group>
                </Group>
                <Box fz="sm">
                    <MarkdownText
                        text={comment.content}
                    />
                </Box>
                <Group justify="space-between">
                    <Group>
                        <VotingCard
                            {...comment}
                        />
                    </Group>
                    <Group>
                        {hasChapters && (
                            <Tooltip label={isChaptersSource ? "Stop using as chapters list" : "Use as chapters list"}>
                                <ActionIcon
                                    variant="light"
                                    color={isChaptersSource ? "green" : "violet"}
                                    onClick={() => (isChaptersSource ? (
                                        setActiveChapters("video")
                                    ) : (
                                        setActiveChapters("comment", parseChapters(comment.content), comment.id)
                                    ))}
                                >
                                    {isChaptersSource ? (
                                        <IconTableOff />
                                    ) : (
                                        <IconTableImport />
                                    )}
                                </ActionIcon>
                            </Tooltip>
                        )}
                        <CopyButton value={textPartsToString(parseFormattedText(comment.content))}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? "Copied!" : "Copy contents"}>
                                    <ActionIcon
                                        variant="subtle"
                                        color={copied ? "green" : "violet"}
                                        onClick={copy}
                                    >
                                        <IconCopy />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </Group>
                </Group>
            </Stack>
        </Paper>
    );
};
