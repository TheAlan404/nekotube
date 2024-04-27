import { ActionIcon, Group, Slider, Stack, Transition } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { IconVolume, IconVolume2, IconVolumeOff } from "@tabler/icons-react";

export const VolumeControls = () => {
    const {
        muted,
        volume,
        setMuted,
        setVolume,
    } = useContext(VideoPlayerContext);
    const { hovered, ref } = useHover();
    
    return (
        <Group ref={ref} wrap="nowrap">
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
            <Transition
                mounted={hovered}
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
                            onChange={(v) => setVolume(v)}
                            color="violet"
                        />
                    </Group>
                )}
            </Transition>
        </Group>
    );
};
