import { Button, Group, Stack } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useContext } from "react";
import { OptionsContext } from "../OptionsContext";

export const OptionsOpenWithView = () => {
    const { setView } = useContext(OptionsContext);

    return (
        <Stack align="center" w="100%">
            <Group w="100%" justify="start">
                <Button
                    variant="light"
                    color="violet"
                    leftSection={<IconArrowLeft />}
                    onClick={() => setView("main")}
                    fullWidth
                    size="compact-md"
                >
                    Back
                </Button>
            </Group>
            <Stack w="100%">
                meow
            </Stack>
        </Stack>
    );
};
