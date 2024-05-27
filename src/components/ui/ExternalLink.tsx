import { Button, Tooltip } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

export const ExternalLink = ({
    link,
}: {
    link: string;
}) => (
    <Tooltip label={link} withArrow>
        <Button
            variant="light"
            
            size="compact-sm"
            leftSection={<IconExternalLink />}
            component="a"
            href={link}
            target="_blank"
        >
            {new URL(link).host}
        </Button>
    </Tooltip>
);
