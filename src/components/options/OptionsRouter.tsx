import { Box, Divider, Space, Stack, Text, Transition } from "@mantine/core";
import { useContext } from "react";
import { OptionsContext } from "./OptionsContext";
import { OptionsMainView } from "./views/MainView";
import { OptionsInstanceView } from "./views/InstanceView";

export const OptionsRouter = () => {
    const { view } = useContext(OptionsContext);
    
    return (
        <Stack align="center" w="100%" h="100%">
            {view == "main" && <OptionsMainView />}
            {view == "instanceSelect" && <OptionsInstanceView />}
        </Stack>
    );
};
