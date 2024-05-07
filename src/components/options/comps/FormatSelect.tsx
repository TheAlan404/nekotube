import { Grid, Select, Stack, Text, UnstyledButton } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { FormatCard } from "../../cards/FormatCard";
import { OptionsContext } from "../OptionsContext";
import { IconArrowRight } from "@tabler/icons-react";

export const FormatSelect = () => {
    const { setView } = useContext(OptionsContext);
    const { activeFormat } = useContext(VideoPlayerContext);

    return (
        <Stack w="100%" gap={0}>
            <Text>
                Selected Format
            </Text>
            <UnstyledButton
                className="hoverable"
                variant="subtle"
                color="violet"
                onClick={() => setView("formatSelect")}
            >
                {activeFormat ? (
                    <FormatCard
                        format={activeFormat}
                        isSelected
                    />
                ) : "Loading..."}
            </UnstyledButton>
        </Stack>
    );
};
