import { ActionIcon, Box, Center, CopyButton, Flex, Group, Menu, Slider, Text, Tooltip, Transition } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { IconMaximize, IconPlayerPause, IconPlayerPlay, IconPlayerTrackNext, IconPlayerTrackPrev, IconSettings, IconVolume, IconVolume2, IconVolumeOff } from '@tabler/icons'
import { IconChevronRight } from '@tabler/icons-react'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { PlayerContext } from '../../contexts/PlayerContext'
import { SettingsContext } from '../../contexts/SettingsContext'
import { VideoContext } from '../../contexts/VideoContext'
import { toTimestamp } from '../../lib/utils'
import PopupTooltip from '../util/PopupTooltip'

const PlayerControls = (props) => {
    const ctx = useContext(PlayerContext);
    let {
        descChapters,
        chapters,
    } = useContext(VideoContext);

    let chapter = ([
        chapters,
        descChapters,
    ].find(x => x.length) || [])
        .findLast(x => x.time <= ctx.progress);

    return (
        <>
            <Tooltip.Group>
                <Group m="xs" position='apart'>
                    <Group>
                        {
                            props.playlistTodo &&
                            <Tooltip label="Previous (todo thumbbail)">
                                <ActionIcon disabled={props.playlistTodo}>
                                    <IconPlayerTrackPrev />
                                </ActionIcon>
                            </Tooltip>
                        }
                        <Tooltip label={(ctx.paused ? "Play" : "Pause") + " (k/space)"}>
                            <ActionIcon onClick={() => ctx.togglePause()}>
                                {
                                    ctx.paused ? <IconPlayerPlay /> : <IconPlayerPause />
                                }
                            </ActionIcon>
                        </Tooltip>
                        {
                            ctx.playlistTodo &&
                            <Tooltip label="Next (todo thumbbail)">
                                <ActionIcon disabled={ctx.playlistTodo}>
                                    <IconPlayerTrackNext />
                                </ActionIcon>
                            </Tooltip>
                        }
                        <VolumeController />
                        <CopyButton value={toTimestamp(ctx.progress)}>
                            {({ copied, copy }) => (<Tooltip
                                label="Copied timestamp!"
                                disabled={!copied}
                                opened={copied}
                                timeout={1500}
                                transitionProps={{ transition: "slide-up", duration: 300 }}>
                                <Text fz="sm" onClick={copy} style={{
                                    cursor: "pointer",
                                }}>
                                    {toTimestamp(ctx.progress)} / {toTimestamp(ctx.duration)}
                                </Text>
                            </Tooltip>)}
                        </CopyButton>
                        {chapter && <Center inline sx={(theme) => ({
                            color: theme.fn.dimmed(),
                            cursor: "pointer",
                            '&:hover': {
                                color: "white",
                            },
                        })}>
                            <Text fz="sm">
                                {chapter.name}
                            </Text>
                            <IconChevronRight />
                        </Center>}
                    </Group>
                    <Group>
                        <Tooltip label="Options (o)">
                            <ActionIcon onClick={() => {}}>
                                <IconSettings />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Fullscreen (f)">
                            <ActionIcon onClick={ctx.toggleFullscreen}>
                                <IconMaximize />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
            </Tooltip.Group>
        </>
    )
}

function VolumeController({ }) {
    const ctx = useContext(PlayerContext);
    const pref = useContext(SettingsContext);
    const { ref, hovered } = useHover();

    let [beforeChange, setBeforeChange] = useState(ctx.volume);

    let wheelRef = useRef();

    const wheelEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (ctx.muted && e.deltaY < 0) {
            ctx.setMuted(false);
        };
        ctx.setVolume(vol => Math.max(0, Math.min(vol + (e.deltaY / -3000), 1)));
    };

    const onChange = useCallback((v) => {
        //console.log("vol sli onchange", ctx.muted, ctx.volume, v);
        if (ctx.muted) {
            ctx.setMuted(false);
        };

        if (v == 0) {
            ctx.setMuted(true);
            ctx.setVolume(beforeChange > 0 ? beforeChange : 0.1);
            return;
        };
        ctx.setVolume(v);
    }, [ctx.muted, ctx.volume, beforeChange]);

    const onChangeEnd = useCallback((v) => {
        if (v == 0) {
            ctx.setMuted(true);
            return;
        };

        setBeforeChange(v);
    }, []);

    useEffect(() => {
        wheelRef.current?.addEventListener("wheel", wheelEventHandler, { passive: false });
    }, [wheelRef.current]);

    useEffect(() => {
        console.log({
            volume: ctx.volume,
            muted: ctx.muted,
            beforeChange,
        });
    }, [ctx.volume, ctx.muted, beforeChange]);

    return (
        <Group ref={ref}>
            <Tooltip label={ctx.muted || (ctx.volume <= 0) ? "Unmute (m)" : "Mute (m)"}>
                <ActionIcon onClick={() => {
                    ctx.setMuted(!ctx.muted);
                    if (ctx.volume <= 0) ctx.setVolume(0.1);
                }}>
                    {
                        (ctx.muted || ctx.volume <= 0)
                            ? <IconVolumeOff />
                            : (
                                <>
                                    {ctx.volume > 0 && 0.5 > ctx.volume && <IconVolume2 />}
                                    {ctx.volume >= 0.5 && <IconVolume />}
                                </>
                            )
                    }
                </ActionIcon>
            </Tooltip>

            <Transition mounted={hovered || pref.keepVolumeControls} transition="scale-x">
                {(styles) => <Box style={styles} h="100%" ref={wheelRef}>
                    <PopupTooltip label={
                        ctx.muted
                            ? "Muted"
                            : "Volume " + (ctx.volume * 100).toString().split(".")[0] + "%"
                    } keepLabel={ctx.muted}>
                        <Slider
                            w="6em"
                            styles={{
                                thumb: {
                                    transition: 'opacity 150ms ease',
                                    opacity: 0,
                                    border: "none",
                                },

                                dragging: {
                                    opacity: 1,
                                },
                            }}
                            label={null}

                            min={0}
                            max={1}
                            step={0.01}
                            value={ctx.muted ? 0 : ctx.volume}

                            onChange={onChange}
                            onChangeEnd={onChangeEnd}
                        />
                    </PopupTooltip>
                </Box>}
            </Transition>
        </Group>);
}

function OptionsMenu() {
    return (<Menu>
        
    </Menu>);
}

export default PlayerControls
