import { Box, Button, Center, Collapse, Grid, Text, Tooltip, TypographyStylesProvider } from '@mantine/core';
import { useDisclosure, useScrollIntoView } from '@mantine/hooks';
import React, { useEffect } from 'react';
import useFormatter from '../../hooks/useFormatter';
import useOverflow from '../../hooks/useOverflow';

export default function DescriptionRenderer({ description }) {
    let [opened, { open, close }] = useDisclosure(false);
    let { scrollIntoView, targetRef } = useScrollIntoView();
    let { ref, overflown } = useOverflow([ description ]);
    let format = useFormatter();

    useEffect(() => {
        if (!opened) setTimeout(() => scrollIntoView({ alignment: "center" }), 50);
    }, [opened]);

    useEffect(() => {
        close();
    }, [description]);

    if (!description) return <Text italic c="dimmed">no description</Text>;

    let desc = <Text>
        {format(description)}
    </Text>

    return (<Box onClick={() => (!opened && overflown) && open()} ref={targetRef}>
        {overflown && <Collapse in={opened}>
            <Grid>
                <Grid.Col span="auto">
                    {desc}
                    <Center>
                        <Button mt="md" variant='outline' color="gray" compact onClick={close}>
                            Collapse Description
                        </Button>
                    </Center>
                </Grid.Col>
                <Grid.Col span="content">
                    <Tooltip.Floating c="gray" label="Click to collapse description">
                        <Box h="100%" bg="dark" w="sm" onClick={close} style={{ cursor: "pointer" }} />
                    </Tooltip.Floating>
                </Grid.Col>
            </Grid>
        </Collapse>}
        {(!opened && <>
            <Text lineClamp={2} ref={ref}>
                {desc}
            </Text>
            {overflown && <Center>
                <Text fz="sm" italic>(click to expand)</Text>
            </Center>}
        </>)}
    </Box>);
}
