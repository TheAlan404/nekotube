import { ActionIcon, Group, Slider, Stack, Tooltip, Transition } from "@mantine/core";
import { clamp, useHover } from "@mantine/hooks";
import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { IconVolume, IconVolume2, IconVolumeOff } from "@tabler/icons-react";
import { usePreference } from "../../../api/pref/Preferences";

export const VolumeControls = () => {
    const {
        videoElement,
        muted,
        volume,
        setMuted,
        setVolume,
    } = useContext(VideoPlayerContext);
    const [isChanging, setIsChanging] = useState(false);
    const keepVolumeShown = usePreference("keepVolumeShown");
    const { hovered, ref } = useHover();
    
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
                mounted={keepVolumeShown || isChanging || hovered}
                transition={"scale-x"}
            >
                {(styles) => (
                    <Group align="center" style={styles}>
                        <Slider
                            w="5em"
                            min={0}
                            max={1}
                            step={0.05}
                            value={volume}
                            label={(v) => `${Math.round(v * 100)}%`}
                            onChange={(v) => {
                                setIsChanging(true);
                                setVolume(v);
                            }}
                            onChangeEnd={() => setIsChanging(false)}
                            onWheel={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (muted && e.deltaY < 0) {
                                    setMuted(false);
                                };
                                setVolume(clamp(0, videoElement.volume + (e.deltaY / -700), 1));
                            }}
                            color="violet"
                        />
                    </Group>
                )}
            </Transition>
        </Group>
    );
};
