import { Box, Flex, Group, Text, Transition } from '@mantine/core';
import { useTimeout } from '@mantine/hooks';
import React, { useContext, useEffect, useState } from 'react'
import { SettingsContext } from '../../contexts/SettingsContext';
import { UIContext } from '../../contexts/UIContext';

const PlayerPopup = () => {
    const [{ disablePlayerPopups }] = useContext(SettingsContext);
    const [{ infoPopup }, set] = useContext(UIContext);
    let [shouldMount, setShouldMount] = useState();

    const { start, clear } = useTimeout(() => {
        setShouldMount(false);
    }, 2000);

    useEffect(() => {
        if(!infoPopup) return;
        setShouldMount(true);
        clear();
        start();
    }, [infoPopup]);

    if(disablePlayerPopups) return <></>;

    return (
        <Flex align="start" w="auto">
            <Transition
                keepMounted
                mounted={shouldMount}
                transition="slide-right"
                onExited={() => !shouldMount && set({ infoPopup: null })}>
                {(styles) => <Box style={styles}>
                    <Group spacing="xs" pos="relative">
                        <Box h="auto" w="xs" bg="#ffffff" c="#ffffff" />
                        {typeof infoPopup == "string" ? <Text>
                            {infoPopup}
                        </Text> : infoPopup}
                    </Group>
                </Box>}
            </Transition>
        </Flex>
    );
}

export default PlayerPopup
