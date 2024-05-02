import { Accordion, Button, Group, List, Space, Stack, Text, Title } from "@mantine/core";
import { ChangeInstanceButton } from "../../components/options/links/ChangeInstanceButton";
import { IconExternalLink } from "@tabler/icons-react";

export const HomePage = () => {
    return (
        <Stack align="center" w="100%" h="100%" justify="center">
            <Space h="5em" />
            <Stack py="xl" align="center">
                <Title>
                    NekoTube
                </Title>
                <Group>
                    <Text>alternative YouTube video player by</Text>
                    <Button
                        variant="light"
                        color="violet"
                        rightSection={<IconExternalLink />}
                        size="compact-sm"
                        component="a"
                        href="https://deniz.blue/"
                    >
                        dennis
                    </Button>
                </Group>
            </Stack>
            <Stack>
                <Accordion defaultValue="getting-started" w={{ base: "100vw", md: "80vw" }}>
                    <Accordion.Item value="getting-started">
                        <Accordion.Control>
                            Getting Started
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack>
                                <Title order={3}>
                                    Welcome to NekoTube
                                </Title>

                                <Text>
                                    First, select an instance:
                                </Text>

                                <ChangeInstanceButton />
                                
                                <Text>
                                    Some instances might be blocked due to CORS
                                    <br />
                                    NekoTube is still in active development, so be aware of any bugs!
                                </Text>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="changelog">
                        <Accordion.Control>
                            Changelogs
                        </Accordion.Control>
                        <Accordion.Panel>
                            <List>
                                <List.Item>
                                    0.1.1
                                    <List withPadding>
                                        <List.Item>Added WatchPage animations</List.Item>
                                        <List.Item>Added changelogs and improved homepage</List.Item>
                                        <List.Item>Chapters based on comments</List.Item>
                                        <List.Item>Comments copy button</List.Item>
                                        <List.Item>Jump to current chapter button</List.Item>
                                        <List.Item>New cool font "borrowed" from Sharkey</List.Item>
                                    </List>
                                </List.Item>
                            </List>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Stack>
            <Space h="10em" />
        </Stack>
    );
};
