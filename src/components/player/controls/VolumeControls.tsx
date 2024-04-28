import { ActionIcon, Group, Slider, Stack, Tooltip, Transition } from "@mantine/core";
import { useHotkeys, useHover } from "@mantine/hooks";
import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { IconVolume, IconVolume2, IconVolumeOff } from "@tabler/icons-react";

export const VolumeControls = () => {
    const {
        muted,
        volume,
        setMuted,
        setVolume,
    } = useContext(VideoPlayerContext);
    const [isChanging, setIsChanging] = useState(false);
    const { hovered, ref } = useHover();

    useHotkeys([
        ["m", () => setMuted(!muted)],
    ]);
    
    return (
        <Group ref={ref} wrap="nowrap">
            <Tooltip label={muted ? "Unmute (m)" : "Mute (m)"}>
                <ActionIcon
                    variant="light"
                    color="violet"
                    onClick={() => setMuted(!muted)}
                >
                    {muted ? (
                        <IconVolumeOff />
                    ) : (
                        volume < 0.5 ? (
                            <IconVolume2 />
                        ) : (
                            <IconVolume />
                        )
                    )}
                </ActionIcon>
            </Tooltip>
            <Transition
                mounted={isChanging || hovered}
                transition={{
                    in: { width: "100%" },
                    out: { width: "0%" },
                    common: { overflow: "hidden" },
                    transitionProperty: "width",
                }}
            >
                {(styles) => (
                    <Group align="center" style={styles}>
                        <Slider
                            w="5em"
                            min={0}
                            max={1}
                            step={0.03}
                            value={volume}
                            onChange={(v) => {
                                setIsChanging(true);
                                setVolume(v);
                            }}
                            onChangeEnd={() => setIsChanging(false)}
                            color="violet"
                        />
                    </Group>
                )}
            </Transition>
        </Group>
    );
};
