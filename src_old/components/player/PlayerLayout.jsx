import { Box, Button, Center, Flex, Group, Overlay, Progress, Stack, Text, Transition } from '@mantine/core';
import { useHover, useTimeout } from '@mantine/hooks';
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { PlayerContext } from '../../contexts/PlayerContext';
import { SettingsContext } from '../../contexts/SettingsContext';
import { UIContext } from '../../contexts/UIContext';
import { VideoContext } from '../../contexts/VideoContext';
import useCountdown from '../../hooks/useCountdown';
import useFadingState from '../../hooks/useFadingState';
import useIsMobile from '../../hooks/useIsMobile';
import { createQuery } from '../../lib/utils';
import ListRenderer from '../ListRenderer';
import PlayerControls from './PlayerControls';
import PlayerPopup from './PlayerPopup';
import PlayerProgressBar from './PlayerProgressBar';

const PlayerLayout = () => {
    const location = useLocation();
    const ctx = useContext(PlayerContext);
    const [pref] = useContext(SettingsContext);
    const [{ hoveredTime }] = useContext(UIContext);
    const { recommended, autoplayNext } = useContext(VideoContext);
    const { ref, hovered } = useHover();
    const [mobileShouldOverlay, { start: onClickOverlay }] = useFadingState(3000);
    const isMobile = useIsMobile();

    const [autoplayCancelled, setAutoplayCancelled] = useState(false);
    const [remTime, stopCountdown, startCountdown] = useCountdown(10, () => {
        autoplayNext();
        setAutoplayCancelled(true);
    });

    let showOverlay = (
        ctx.paused
        || hovered
        || pref.keepControls
        || (hoveredTime > 0)
        || mobileShouldOverlay
        || ctx.ended);

    useEffect(() => {
        if (ctx.ended) {
            startCountdown();
        } else {
            setAutoplayCancelled(false);
        };
    }, [ctx.ended]);

    let showAutoplayPopup = ctx.ended && !autoplayCancelled;

    let popup = <PlayerPopup />;

    return (
        <Box
            ref={ref}
            onClick={isMobile && !showOverlay ? onClickOverlay : undefined}
            style={{
                ...(isMobile && !showOverlay ? { cursor: "pointer" } : {}),
                WebkitTapHighlightColor: "transparent",
            }}
        >
            {!showOverlay && <Flex justify="start" align="end" w="100%" h="100%" p="md">
                {popup}
            </Flex>}
            <Transition
                mounted={showOverlay}
                transition="fade"
                duration={200}>
                {(styles) => <Overlay
                    gradient={!showAutoplayPopup && "linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 20%)"}
                    opacity={showAutoplayPopup && 0.7}
                    w="100%"
                    h="100%">
                    <Flex w="100%" h="100%" align="end" justify="center" onClick={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if ((e.mozInputSource === 5)
                            || (e.type == "PointerEvent" && e.pointerType === "touch")) return;
                        ctx.togglePause();
                    }}>
                        {showAutoplayPopup && (
                            isMobile ? <Flex w="100%" h="100%">
                                <Center w="100%" h="100%">
                                    <Stack align="center" justify="center">
                                        <Text>Autoplay?</Text>
                                        {/* i got lazy */}
                                        <ListRenderer list={[recommended[0]]} />
                                        <Text>Will autoplay in</Text>
                                        <Text span fw="bold" size="lg">{remTime}</Text>
                                        <Button onClick={() => {
                                            setAutoplayCancelled(true);
                                            stopCountdown();
                                        }}>
                                            Cancel
                                        </Button>
                                    </Stack>
                                </Center>
                            </Flex> : <>
                                <Stack spacing={0}>
                                    <Text>Autoplay?</Text>
                                    {/* i got lazy */}
                                    <ListRenderer useGrid={false} list={[recommended[0]]} />
                                    <Group position="apart">
                                        <Text>
                                            <Text span>Will autoplay in</Text>
                                            <Text span fw="bold" size="lg">{remTime}</Text>
                                        </Text>
                                        <Button onClick={() => {
                                            setAutoplayCancelled(true);
                                            stopCountdown();
                                        }}>
                                            Cancel
                                        </Button>
                                    </Group>
                                </Stack>
                            </>
                        )}
                        {!showAutoplayPopup && <Stack justify="end" w={"100%"} spacing={0}>
                            {popup}
                            <PlayerProgressBar />
                            <PlayerControls />
                        </Stack>}
                    </Flex>
                </Overlay>}
            </Transition>
        </Box>
    );
}

export default PlayerLayout
