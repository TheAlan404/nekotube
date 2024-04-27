import { Box, Progress, Stack, Text, Tooltip } from '@mantine/core';
import { useElementSize, useHover, useMergedRef, useMouse, useMove } from '@mantine/hooks';
import React, { memo, useContext, useEffect, useState } from 'react'
import { VideoContext } from '../../contexts/VideoContext';
import { PlayerContext } from '../../contexts/PlayerContext'
import { calcChapterSegments, toTimestamp } from '../../lib/utils';
import { CProgress } from '../modded/CProgress';
import { UIContext } from '../../contexts/UIContext';

const PlayerProgressBar = () => {
    let ctx = useContext(PlayerContext);
    let [{ hoveredTime }] = useContext(UIContext);
    let {
        descChapters = [],
        chapters = [],
    } = useContext(VideoContext);
    const { hovered, ref: containerRef } = useHover();

    let [seekTarget, setSeekTarget] = useState();
    // -- bad hack --
    let [seekOverride, setSeekOverride] = useState(false);
    useEffect(() => {
        setSeekOverride(false);
    }, [ctx.progress]);

    //let [playOnScrubEnd, setPlayOnScrubEnd] = useState(true);
    let playOnScrubEnd = false;
    let [isSucrubbing, setScrubbing] = useState(false);

    let { ref: useMoveRef, active: isMoving } = useMove(({ x = 0 }) => {
        setSeekOverride(true);
        setSeekTarget(x * ctx.duration);
        ctx.seekTo(x * ctx.duration);
    }, {
        onScrubStart: () => {
            setScrubbing(true);
            //setPlayOnScrubEnd(!ctx.paused);
            playOnScrubEnd = !ctx.paused;
            ctx.pause();
        },
        onScrubEnd: () => {
            if(playOnScrubEnd) ctx.play();
            setScrubbing(false);
        },
    });

    let { ref: useElSizeRef, width: barWidth } = useElementSize();
    let { ref: useMouseRef, x: mouseX } = useMouse();

    //let percentage = ((isMoving ? seekTarget : ctx.progress) / ctx.duration);
    let prog = ((isMoving || seekOverride) ? seekTarget : ctx.progress);
    let percentage = prog / ctx.duration * 100;

    let hoverPos = isMoving ? percentage : ((hoveredTime > 0) ? ((hoveredTime / ctx.duration) * 100) : ((mouseX / barWidth) * 100));
    let hoverTime = isMoving ? seekTarget : ((hoveredTime > 0) ? hoveredTime : ((mouseX / barWidth) * ctx.duration));

    return (
        <>
            <Box style={{ position: "relative" }}>
                <BarHover
                        active={hovered || isMoving || (hoveredTime > 0)}
                        pos={hoverPos}
                        ts={toTimestamp(hoverTime)}
                        altVariant={hoveredTime > 0}
                        name={([
                            chapters || [],
                            descChapters || [],
                        ].find(x => x.length) || [{ time: 0, name: "" }])
                            .findLast(x => x.time <= hoverTime)?.name || ""}
                    />
                <Box
                    pt="sm"
                    ref={useMergedRef(
                        containerRef,
                        useMoveRef,
                        useElSizeRef,
                        useMouseRef)}
                    style={{
                        position: "relative",
                        cursor: 'pointer',
                    }}>
                    <CProgress
                        // TODO optimize, too heavy ops
                        segments={calcChapterSegments({
                            chapters: [
                                chapters || [],
                                descChapters || [],
                            ].find(x => x.length),
                            progress: prog,
                            duration: ctx.duration,
                        })}
                        size={(hovered || isMoving) ? "md" : "sm"}
                    />
                    <Thumb disabled={!(hovered || isMoving)} progress={percentage} />
                </Box>
            </Box>
        </>
    )
}

const Thumb = memo(({ progress, disabled, color }) => {
    return (<Box bottom="md" sx={(theme) => ({
        position: "absolute",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    })}>
        <Box style={{
            left: (progress) + "%",
        }} sx={(theme) => ({
            width: "1rem",
            height: "1rem",
            position: 'absolute',

            //display: disabled ? 'none' : 'flex',
            transition: 'opacity 150ms ease',
            //transform: disabled ? "scale(0.01)" : "scale(1)",
            opacity: disabled ? 0 : 1,

            justifyContent: 'center',
            alignItems: 'center',

            backgroundColor: theme.fn.variant({
                variant: 'filled',
                primaryFallback: false,
                color: color || theme.primaryColor,
            }).background,
            transform: 'translate(-50%, -75%)',
            borderRadius: 1000,
        })}>

        </Box>
    </Box>);
});

const BarHover = ({
    active,
    pos,
    name,
    ts,
    altVariant,
}) => {
    return (
        <Box style={{
            left: `${pos}%`,
        }} sx={(theme) => ({
            position: "absolute",
            bottom: "100%",
            boxSizing: "border-box",
        })}>
            <Tooltip opened={active} label={(
                <Text align='center'>
                    {name && <Text inherit>{name}</Text>}
                    <Text inherit>{ts}</Text>
                </Text>
            )} withArrow arrowSize={10} offset={-10} styles={{
                tooltip: {
                    opacity: 0.7,
                },
            }} positionDependencies={[ pos ]}>
                <Box sx={(theme) => ({
                    position: "relative",
                })}></Box>
            </Tooltip>
        </Box>
    );
    /* return (
        <Box style={{
            left: `${pos}%`,
        }} sx={(theme) => ({
            position: "absolute",
            bottom: "100%",
            boxSizing: "border-box",
        })}>
            {active &&
                <Box sx={(theme) => ({
                    position: "relative",
                    boxSizing: "border-box",
                    right: "50%",
                    backgroundColor: altVariant && (theme.fn.variant({ variant: 'filled', color: "gray" }).background),
                    opacity: altVariant && 0.7,
                    color: altVariant && (theme.colorScheme === 'dark' ? theme.white : theme.black),
                    borderRadius: theme.fn.radius(),
                    borderBottom: altVariant && "0.5em",
                })} px="md">
                    <Text align='center'>
                        {name && <Text inherit>{name}</Text>}
                        <Text inherit>{ts}</Text>
                    </Text>
                </Box>
            }
        </Box>
    ); */
};

export default PlayerProgressBar
