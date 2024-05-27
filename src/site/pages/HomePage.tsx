import { Accordion, Button, Group, List, Space, Stack, Text, Title } from "@mantine/core";
import { ChangeInstanceButton } from "../../components/options/links/ChangeInstanceButton";
import { IconExternalLink } from "@tabler/icons-react";

const CHANGELOGS = `
0.1.2
- DeArrow support
- SearchBar shortcuts for video IDs and URLs
- Implemented the "Open With" section
- Added PokeTube public instances listing
- Aspect ratio is now automatic
- Chapters now can be grouped
- Current chapter now has a progress bar on the chapters tab
- Improved tabs performance
- Improved progress bar performance


0.1.1
- Added WatchPage animations
- Added changelogs and improved homepage
- Chapters based on comments
- Comments copy button
- Jump to current chapter button
- New cool font "borrowed" from Sharkey
`
    .split("\n")
    .map(x => x.trim())
    .filter(x => x)
    .reduce<{ version: string; items: string[]; }[]>((prev, cur) => {
        if(cur.startsWith("-")) {
            return [
                ...prev.filter((v, i, a) => i !== a.length - 1),
                {
                    version: prev[prev.length - 1].version,
                    items: [
                        ...prev[prev.length - 1].items,
                        cur.replace("-", "").trim(),
                    ],
                }
            ]
        } else {
            return [
                ...prev,
                {
                    version: cur,
                    items: [],
                }
            ]
        }
    }, []);

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
                                {CHANGELOGS.map((ver, i) => (
                                    <List.Item key={i}>
                                        {ver.version}
                                        <List withPadding>
                                            {ver.items.map((item, i) => (
                                                <List.Item key={i}>
                                                    {item}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </List.Item>
                                ))}
                            </List>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Stack>
            <Space h="10em" />
        </Stack>
    );
};
