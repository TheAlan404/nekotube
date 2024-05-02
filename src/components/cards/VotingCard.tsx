import { Button, Group } from "@mantine/core";
import { IconThumbUp } from "@tabler/icons-react";

export const VotingCard = ({
    likeCount,
    dislikeCount,
}: {
    likeCount?: number,
    dislikeCount?: number,
}) => {
    return (
        <Group>
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
        </Group>
    );
};
