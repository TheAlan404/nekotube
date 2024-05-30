import { ActionIcon, Box, Button, Collapse, CopyButton, Grid, Group, Loader, Paper, Stack, Tooltip } from "@mantine/core";
import { Comment } from "../../api/types/comment";
import { MarkdownText } from "../ui/MarkdownText";
import { ChannelCard } from "./ChannelCard";
import { VotingCard } from "./VotingCard";
import { IconArrowDown, IconArrowUp, IconCopy, IconPencil, IconPinned, IconTableImport, IconTableOff } from "@tabler/icons-react";
import { parseChapters } from "../../utils/parseChapters";
import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../api/player/VideoPlayerContext";
import { parseFormattedText, textPartsToString } from "../../utils/parseFormattedText";
import { DateCard } from "./DateCard";
import { TimestampRegex } from "../../utils/timestamp";
import { useDisclosure } from "@mantine/hooks";
import { APIContext } from "../../api/provider/APIController";
import { ErrorMessage } from "../ui/ErrorMessage";

export const CommentCard = ({
    comment
}: {
    comment: Comment,
}) => {
    const { api } = useContext(APIContext);
    const { activeChapters, setActiveChapters, videoID } = useContext(VideoPlayerContext);
    const [opened, { toggle }] = useDisclosure(false);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [replies, setReplies] = useState<Comment[]>([]);
    const [repliesContinuation, setRepliesContinuation] = useState<string | null>(null);

    const fetchReplies = async () => {
        let replies = await api.getComments(videoID, comment.replyKey);
        console.log(replies);
        setReplies(replies.results);
        setRepliesContinuation(replies.key);
    }

    const onExpand = async () => {
        toggle();

        // dont fetch when closing
        if(opened) return;

        // dont fetch if fetched
        if(replies.length) return;

        setLoading(true);
        setError(null);

        try {
            await fetchReplies();
        } catch(e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchMore = async () => {
        setLoading(true);
        setError(null);

        try {
            let replies = await api.getComments(videoID, repliesContinuation);
            console.log(replies);
            setReplies(r => [...r, ...replies.results]);
            setRepliesContinuation(replies.key);
        } catch(e) {
            setError(e);
        } finally  {
            setLoading(false);
        }
    }

    const hasChapters = comment.content.match(TimestampRegex)?.length > 1;
    const isChaptersSource = activeChapters.type == "comment" && activeChapters.id == comment.id;

    return (
        <Paper
            withBorder
            shadow="md"
            p="xs"
        >
            <Stack gap="xs">
                <Group justify="space-between">
                    <ChannelCard
                        channel={comment.channel}
                    />
                    <Group wrap="nowrap">
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
                    <Group gap="xs">
                        <VotingCard
                            {...comment}
                        />
                        {comment.replyKey && (
                            <Button
                                variant="subtle"
                                size="compact-md"
                                leftSection={opened ? <IconArrowUp /> : <IconArrowDown />}
                                onClick={onExpand}
                            >
                                {comment.replyCount}
                            </Button>
                        )}
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
                <Collapse in={opened}>
                    {isLoading && !replies.length && (
                        <Stack w="100%" align="center">
                            <Loader />
                        </Stack>
                    )}
                    {error && <ErrorMessage error={error} />}
                    {!!replies.length && (
                        <Stack gap="xs">
                            {replies.map((reply, i) => (
                                <CommentCard
                                    comment={reply}
                                />
                            ))}
                            {repliesContinuation && (
                                <Button
                                    variant="subtle"
                                    size="compact-md"
                                    onClick={fetchMore}
                                    loading={isLoading}
                                >
                                    Show More
                                </Button>
                            )}
                        </Stack>
                    )}
                </Collapse>
            </Stack>
        </Paper>
    );
};
