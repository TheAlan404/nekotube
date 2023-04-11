import { Box, Grid, Stack } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import WatchPageRightside from './WatchPageRightside'
import Player from '../player/Player'
import SingleTabs from '../tabs/SingleTabs'
import VideoInfo from '../videos/VideoInfo'
import WatchPageComments from './WatchPageComments'
import useIsMobile from '../../hooks/useIsMobile'

const WatchPageLayout = ({ isLoading }) => {
    const isMobile = useIsMobile();
    let [offst, setOffst] = useState(0);
    let ref = useRef();

    useEffect(() => {
        if(!ref.current) return;

        setOffst(ref.current.getBoundingClientRect().top);
    }, [ref]);

    return (
        <>
            <Grid columns={3} my="md" /* style={isMobile ? {
                display: "flex",
                flexFlow: "column",
                minHeight: "100vh",
            } : {}} */ h={isMobile && "100%"}>
                <Grid.Col sm={3} md={2} h={isMobile && "100%"}>
                    <Stack w="100%" style={isMobile ? {
                        maxHeight: "98%",
                    } : {}}>
                        <Player />
                        {/* really bad */}
                        {isMobile ? <Box ref={ref} style={{
                            height: `calc(100vh - ${offst}px - 2rem)`,
                            width: "100%",
                        }}>
                            <SingleTabs />
                        </Box> : <>
                            <VideoInfo />
                            <WatchPageComments />
                        </>}
                    </Stack>
                </Grid.Col>
                {!isMobile && <Grid.Col sm={3} md={1}>
                    <WatchPageRightside isLoading={isLoading} />
                </Grid.Col>}
            </Grid>
        </>
    )
}

export default WatchPageLayout
