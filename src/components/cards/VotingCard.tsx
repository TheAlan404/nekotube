import { Button, Group } from "@mantine/core";
import { IconThumbDown, IconThumbUp } from "@tabler/icons-react";

export const VotingCard = ({
    likeCount,
    dislikeCount,
}: {
    likeCount?: number,
    dislikeCount?: number,
}) => {
    return (
        <Group wrap="nowrap">
            {!isNaN(likeCount) && (
                <Button
                    leftSection={<IconThumbUp />}
                    variant="subtle"
                    color="violet"
                    size="compact-md"
                >
                    {likeCount}
                </Button>
            )}
            {!isNaN(dislikeCount) && (
                <Button
                    leftSection={<IconThumbDown />}
                    variant="subtle"
                    color="violet"
                    size="compact-md"
                >
                    {dislikeCount}
                </Button>
            )}
        </Group>
    );
};
