import { Button } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

export const ExternalLink = ({
    link,
    text,
}: {
    link: string;
    text: string;
}) => (
    <Button
        variant="light"
        color="violet"
        size="compact-sm"
        leftSection={<IconExternalLink />}
        component="a"
        href={link}
        target="_blank"
    >
        {text}
    </Button>
);
