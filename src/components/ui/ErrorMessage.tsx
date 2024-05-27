import { Box, Button, Stack, Text } from "@mantine/core";
import { IconAlertTriangle, IconReload } from "@tabler/icons-react";
import { useSoundEffect } from "../../hooks/useSoundEffect";
import { useEffect } from "react";
import { ChangeInstanceButton } from "../options/links/ChangeInstanceButton";

const CORS_ERROR_MESSAGE = "NetworkError when attempting to fetch resource.";

export const ErrorMessage = ({
    error,
    retry,
}: {
    error?: any,
    retry?: () => void,
}) => {
    const errorSfx = useSoundEffect(["error"]);
    useEffect(() => {
        if(error) errorSfx();
    }, [error]);

    const isCors = (error instanceof TypeError && error.message == CORS_ERROR_MESSAGE);

    return (
        <Box>
            {error && (
                <Stack align="center">
                    <IconAlertTriangle />
                    <Stack gap={0} align="center">
                        <Text fw="bolder" c="yellow">Error</Text>
                        <Text>{error.toString()}</Text>
                        {isCors && (
                            <Stack gap={0}>
                                <Text c="dimmed">This is most likely a CORS issue</Text>
                                <ChangeInstanceButton />
                            </Stack>
                        )}
                    </Stack>
                    {retry && (
                        <Button
                            variant="light"
                            
                            size="compact-sm"
                            leftSection={<IconReload />}
                            onClick={() => retry()}
                        >
                            Retry
                        </Button>
                    )}
                </Stack>
            )}
        </Box>
    );
};
