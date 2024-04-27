import { ActionIcon, Autocomplete, Box, Group, Highlight, MediaQuery, Paper, Popover, Stack, Text, TextInput, useMantineTheme } from '@mantine/core'
import { useDebouncedValue, useDisclosure, useHotkeys, useMediaQuery } from '@mantine/hooks';
import { IconPencil, IconSearch } from '@tabler/icons'
import React, { Component, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import useIsMobile from '../hooks/useIsMobile';
import { useKeyboardSfx, useSoundEffect } from '../hooks/useSoundEffect';
import APIController from '../lib/APIController';
import { chunkifySearchSuggestions, createQuery } from '../lib/utils';
import { getMeta, isChannelID, isPlaylistID, isUrl, isVideoID, VideoIDRegex } from './util/regexes';
import HorizontalVideoCard from './cards/HorizontalVideoCard';

function SearchBar() {
    let theme = useMantineTheme();
    let navigate = useNavigate();
    let location = useLocation();
    let isMobile = useIsMobile();

    let inputRef = useRef();

    let [query, setQuery] = useState(new URLSearchParams(window.location.search).get("query") || "");
    let [suggestions, setSuggestions] = useState([]);
    let [idRenderer, setIDRenderer] = useState({});
    let [opened, { open, close }] = useDisclosure(false);

    let [queryBefore, setQueryBefore] = useState();
    let [highlightedSuggest, setHighlightedSuggest] = useState(-1);

    let [debouncedQuery] = useDebouncedValue(query, 100, { leading: true });

    useEffect(() => {
        if (highlightedSuggest >= 0 && query != suggestions[highlightedSuggest]) {
            setHighlightedSuggest(-1);
        };
    }, [query, highlightedSuggest]);

    useEffect(() => {
        setIDRenderer({});
        if (!debouncedQuery) {
            setSuggestions([]);
            return;
        }

        if (highlightedSuggest >= 0) return;

        let { video, channel, playlist } = getMeta(debouncedQuery);

        if (video) {
            APIController.video(video).then((data) => {
                if (data && data.id) setIDRenderer({ ...data, type: "video" });
            }).catch(() => { });
        } else if (channel) {

        } else if (playlist) {

        }

        APIController.searchSuggestions(debouncedQuery).then((sugs) => {
            setSuggestions(sugs);
        }).catch(() => 0);
    }, [debouncedQuery, highlightedSuggest]);

    useEffect(() => {
        if (location.pathname != "/results") return;

        setQuery(new URLSearchParams(location.search).get("query") || "");
        setSuggestions([]);
    }, [location.search]);

    useEffect(() => {
        if (highlightedSuggest < 0) {
            setQueryBefore(query);
        };
    }, [highlightedSuggest, query]);

    useHotkeys([
        ["shift+S", () => {
            inputRef.current?.select();
        }],
    ]);

    const handleKeyDownSfx = useKeyboardSfx();

    const highlight = (i) => {
        if (i >= 0) {
            setHighlightedSuggest(i);
            setQuery(suggestions[i]);
        } else {
            setQuery(queryBefore);
            setHighlightedSuggest(-1);
        };
    };

    const handleKeyDown = (e) => {
        handleKeyDownSfx(e);
        switch (e.key) {
            case 'ArrowUp': {
                e.preventDefault();
                if (highlightedSuggest == 0) {
                    highlight(-1);
                } else {
                    highlight(highlightedSuggest - 1);
                }
                break;
            }

            case 'ArrowDown': {
                e.preventDefault();
                if (highlightedSuggest == suggestions.length - 1) {
                    highlight(-1);
                } else {
                    highlight(highlightedSuggest + 1);
                }
                break;
            }

            case 'Enter': {
                close();

                let { video, channel, playlist } = getMeta(query);
                if (video) navigate("/lighttube-react/watch?" + createQuery({ v: video }));
                else if (channel) navigate("/lighttube-react/channel/" + channel);
                else if (playlist) navigate("/lighttube-react/playlist?" + createQuery({ list: playlist }));

                else navigate("/lighttube-react/results?" + createQuery({ query }));
                break;
            }

            case 'Escape': {
                if (opened) {
                    e.preventDefault();
                    close();
                }
            }
        };
    };

    // TODO make autocomplete better (down arrow etc)
    return (
        <Box mx="auto">
            <Popover
                opened={opened}
                position="bottom"
                width={isMobile ? "100vw" : "target"}>
                <Popover.Target>
                    <Box>
                        <TextInput
                            placeholder='Search...'
                            rightSection={<ActionIcon disabled={!query} component={Link} to={"/results?" + createQuery({ query })}>
                                <IconSearch />
                            </ActionIcon>}
                            aria-label="search"
                            autoFocus={location.pathname === "/"}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => open()}
                            onBlur={() => close()}
                            onKeyDown={handleKeyDown}
                            ref={inputRef}
                        />
                    </Box>
                </Popover.Target>
                <Popover.Dropdown p={0}>
                    <Box>
                        {(suggestions.length == 0) && !(idRenderer?.id) && (<Box my="lg">
                            <Text>Start typing to search</Text>
                            <Text fz="sm" c="dimmed">Suggestions will appear here</Text>
                        </Box>)}
                        {idRenderer?.id && <Stack spacing="md" p="md" onClick={() => handleKeyDown({ key: "Enter" })}>
                            <Text align='left'>
                                Press enter to watch:
                                <HorizontalVideoCard {...idRenderer} />
                            </Text>
                        </Stack>}
                        {suggestions.map((s, i) =>
                            <Box
                                key={i}
                                sx={(theme) => ({
                                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor:
                                            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                                    },
                                })}
                                /* TODO hacky way because i couldnt get sx to work */
                                style={(highlightedSuggest === i) ? {
                                    backgroundColor:
                                        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                                } : {}}
                                onClick={() => {
                                    navigate("/lighttube-react/results?" + (new URLSearchParams({ query: s }).toString()));
                                    setQuery(s);
                                }}
                                p={isMobile ? "sm" : 0}>
                                <Group position='apart'>
                                    <Text align='start'>
                                        {chunkifySearchSuggestions(queryBefore, s).map(({ includes, text }, i) => (
                                            <Text span c={includes && "dimmed"} key={i}>
                                                {text}
                                            </Text>
                                        ))}
                                    </Text>
                                    <Group>
                                        {isMobile && <ActionIcon onClick={(e) => {
                                            e.stopPropagation();
                                            setQuery(s);
                                            inputRef.current?.select();
                                        }}>
                                            <IconPencil />
                                        </ActionIcon>}
                                    </Group>
                                </Group>
                            </Box>)}
                    </Box>
                </Popover.Dropdown>
            </Popover>
        </Box >
    )
}

export default SearchBar;
