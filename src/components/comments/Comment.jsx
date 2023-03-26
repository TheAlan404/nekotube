import { Avatar, Collapse, Grid, Group, Paper, Stack, Text, TypographyStylesProvider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import React from 'react'
import useFormatter from '../../hooks/useFormatter';
import useOverflow from '../../hooks/useOverflow'

const Comment = (props) => {
    let { ref, overflown } = useOverflow([ props.content ]);
    let [opened, { close, open }] = useDisclosure();
    let format = useFormatter();

    let content = <Text>
        {/* <div dangerouslySetInnerHTML={{ __html: props.content }} /> */}
        {format(props.content)}
    </Text>;

    return (
        <>
            <Paper p="sm" withBorder>
                <Grid columns={2} align="flex-start">
                    <Grid.Col span="content">
                        <Avatar size="md" radius="xl" src={props.owner?.avatar} />
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Stack spacing={0}>
                            <Group position='apart'>
                                <Group>
                                    <Text fw="bold">
                                        {props.owner?.title}
                                    </Text>
                                    <Text c="dimmed">
                                        {props.publishedTimeText}
                                    </Text>
                                </Group>
                                {/* ... */}
                            </Group>
                            <div>
                                {overflown && <Collapse in={opened}>
                                    {content}
                                    <Text style={{ cursor: "pointer" }} mt="md" underline c="dimmed" onClick={close}>
                                        Show less
                                    </Text>
                                </Collapse>}
                                {(!opened && <>
                                    <Text lineClamp={4} ref={ref}>
                                        {content}
                                    </Text>
                                    {overflown && <Text fz="sm" mt="md" underline c="dimmed" style={{ cursor: "pointer" }} onClick={open}>Show more</Text>}
                                </>)}
                            </div>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Paper>
        </>
    )
}

export default Comment
