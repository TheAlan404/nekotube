import { Box, Flex, Overlay, Progress, Stack, Transition } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import React, { useContext, useState } from 'react'
import { PlayerContext } from '../../contexts/PlayerContext';
import { SettingsContext } from '../../contexts/SettingsContext';
import { UIContext } from '../../contexts/UIContext';
import useFadingState from '../../hooks/useFadingState';
import useIsMobile from '../../hooks/useIsMobile';
import PlayerControls from './PlayerControls';
import PlayerPopup from './PlayerPopup';
import PlayerProgressBar from './PlayerProgressBar';

const PlayerLayout = () => {
    const ctx = useContext(PlayerContext);
    const [pref] = useContext(SettingsContext);
    const [{ hoveredTime }] = useContext(UIContext);
    const { ref, hovered } = useHover();
    const [isTouching, setIsTouching] = useState();
    const [mobileShouldOverlay, { start: onClickOverlay }] = useFadingState(3000);
    const isMobile = useIsMobile();

    let showOverlay = (ctx.paused || hovered || pref.keepControls || (hoveredTime > 0) || mobileShouldOverlay);

    let popup = <PlayerPopup />;

    return (
        <Box
            ref={ref}
            onClick={isMobile && !showOverlay ? onClickOverlay : undefined}
            onTouchStart={() => setIsTouching(true)}
            onTouchEnd={() => setIsTouching(false)}
            style={isMobile && !showOverlay ? { cursor: "pointer" } : {}}
            >
            {!showOverlay && <Flex justify="start" align="end" w="100%" h="100%" p="md">
                {popup}
            </Flex>}
            <Transition
                mounted={showOverlay}
                transition="fade"
                duration={200}>
                {(styles) => <Overlay
                    gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 20%)"
                    w="100%"
                    h="100%">
                    <Flex w="100%" h="100%" align="end" justify="center" onClick={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if ((
                            e.mozInputSource === 5
                        ) || (
                                e.type == "PointerEvent" && e.pointerType === "touch"
                            )) {

                            return;
                        };
                        ctx.togglePause();
                    }}>
                        <Stack justify="end" w={"100%"} spacing={0}>
                            {popup}
                            <PlayerProgressBar />
                            <PlayerControls />
                        </Stack>
                    </Flex>
                </Overlay>}
            </Transition>
        </Box>
    );
}

export default PlayerLayout
