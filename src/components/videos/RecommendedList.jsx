import { Box, Center, Stack, Switch } from '@mantine/core';
import React, { useContext } from 'react'
import { SettingsContext } from '../../contexts/SettingsContext';
import { VideoContext } from '../../contexts/VideoContext';
import ListRenderer from '../ListRenderer';

const RecommendedList = ({ withAutoplay }) => {
    let [{ autoplay }, set] = useContext(SettingsContext)
    let { recommended } = useContext(VideoContext);

    return (
        <Stack>
            {withAutoplay && <Box>
                <Switch
                    checked={!!autoplay}
                    onChange={(event) => set({
                        autoplay: event.currentTarget.checked,
                    })}
                    label="Autoplay"
                    />
            </Box>}
            <ListRenderer useGrid={false} list={recommended || []} />
        </Stack>
    )
}

export default RecommendedList
