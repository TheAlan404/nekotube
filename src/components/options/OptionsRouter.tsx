import { Box, Divider, Space, Stack, Text, Transition } from "@mantine/core";
import { useContext } from "react";
import { OptionsContext } from "./OptionsContext";
import { OptionsMainView } from "./views/MainView";
import { OptionsInstanceView } from "./views/InstanceView";
import { OptionsOpenWithView } from "./views/OpenWith";
import { OptionsFormatView } from "./views/FormatView";
import { OptionsHistoryView } from "./views/HistoryView";

export const OptionsRouter = () => {
    const { view } = useContext(OptionsContext);
    
    return (
        <Stack align="center" w="100%" h="100%">
            {view == "main" && <OptionsMainView />}
            {view == "instanceSelect" && <OptionsInstanceView />}
            {view == "openWith" && <OptionsOpenWithView />}
            {view == "formatSelect" && <OptionsFormatView />}
            {view == "history" && <OptionsHistoryView />}
        </Stack>
    );
};
