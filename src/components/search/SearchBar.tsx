import { ActionIcon, Box, Button, Combobox, Grid, Group, Loader, Stack, Text, TextInput, Tooltip, useCombobox } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import { APIContext } from "../../api/provider/APIController";
import { IconAlertTriangle, IconClock, IconPencil, IconSearch } from "@tabler/icons-react";
import { useLocation, useNavigate, useNavigation, useSearchParams } from "react-router-dom";
import { useKeyboardSfx } from "../../hooks/useSoundEffect";
import { useHotkeys } from "@mantine/hooks";
import { parseSearchShortcut, SearchShortcut, SearchShortcutRenderer, shortcutToLocation } from "./SearchShortcut";
import { useIsMobile } from "../../hooks/useIsMobile";
import { highlightSearch } from "../../utils/highlightSearch";
import { useNekoTubeHistory } from "../../api/pref/History";

interface SearchSuggestion {
    text: string;
    type: "api" | "history";
    index?: number;
}

export const SearchBar = () => {
    const isMobile = useIsMobile();
    const { api } = useContext(APIContext);
    const history = useNekoTubeHistory();
    const navigate = useNavigate();
    const location = useLocation();
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [value, setValue] = useState((location.pathname == "/search" ? (new URLSearchParams(location.search).get("q") || "") : ""));
    const [pickedSuggestion, setPickedSuggestion] = useState("");
    const [shortcut, setShortcut] = useState<SearchShortcut | null>(null);
    const ref = useRef<HTMLInputElement>(null);
    const abortController = useRef<AbortController>();
    const keyboardSfx = useKeyboardSfx();

    useHotkeys([
        ["ctrl + s", () => ref.current.focus()],
    ], [], true);

    const options = (suggestions || []).map(({ text, type }, i) => (
        <Combobox.Option value={text} key={i}>
            <Group justify="space-between" wrap="nowrap">
                <Text>
                    {highlightSearch(value, text).map(({
                        text,
                        highlight,
                    }, i) => (
                        <Text c={highlight ? "dimmed" : undefined} span>
                            {text}
                        </Text>
                    ))}
                </Text>
                {type == "history" && (
                    <Tooltip label="Click to remove">
                        <ActionIcon
                            variant="light"
                            color="gray"
                            onClick={(e) => {
                                e.stopPropagation();
                                history.setHistory(v => v.filter(([t, d]) => t !== "s" && d !== text));
                                fetchSuggestions(value);
                            }}
                        >
                            <IconClock />
                        </ActionIcon>
                    </Tooltip>
                )}
                {isMobile && (
                    <ActionIcon
                        variant="light"
                        color="gray"
                        onClick={(e) => {
                            e.stopPropagation();

                            setValue(text);
                            fetchSuggestions(text);
                        }}
                    >
                        <IconPencil />
                    </ActionIcon>
                )}
            </Group>
        </Combobox.Option>
    ));

    const fetchSuggestions = async (query: string) => {
        abortController.current?.abort();
        abortController.current = new AbortController();

        if (!query.length) {
            setSuggestions([]);
            setLoading(false);
            setErrorMessage(null);
            return;
        }

        setLoading(true);
        setErrorMessage(null);
        try {
            let apiSuggestions = (await api.searchSuggestions(query, abortController.current.signal))
                .map(s => ({ text: s, type: "api" as const }));
            
            let historySuggestions = history.history
                .filter(([t]) => t == "s")
                .sort(([_, __, a], [___, ____, b]) => a - b)
                .map(([_, text]) => text)
                .filter(text => text.toLowerCase().includes(query.toLowerCase()))
                .map(text => ({ text, type: "history" as const }));
            
            setSuggestions([
                ...historySuggestions,
                ...apiSuggestions,
            ]);

            abortController.current = null;
            setLoading(false);
        } catch (e) {
            if (e instanceof DOMException && e.name == "AbortError") {
                setErrorMessage(null);
            } else {
                setErrorMessage(e.toString());
                setSuggestions([]);
                setLoading(false);
                console.log(e);
            }
        }
    };

    const search = (q: string) => {
        navigate("/search?" + new URLSearchParams({ q }));
        setValue(q || "");
        ref.current.blur();
        combobox.closeDropdown();
    };

    return (
        <Combobox
            onOptionSubmit={(q) => {
                search(q);
            }}
            withinPortal={false}
            width={isMobile ? "calc(100vw - (var(--mantine-spacing-xs) * 2))" : "target"}
            store={combobox}
        >
            <Combobox.Target>
                <Grid w="100%" gutter="xs">
                    <Grid.Col span="auto">
                        <TextInput
                            placeholder="Search... (Ctrl + S)"
                            ref={ref}
                            value={pickedSuggestion || value || ""}
                            onChange={(e) => {
                                setValue(e.currentTarget.value);
                                setShortcut(parseSearchShortcut(e.currentTarget.value));
                                fetchSuggestions(e.currentTarget.value);
                                combobox.resetSelectedOption();
                                combobox.openDropdown();
                            }}
                            autoFocus={location.pathname == "/"}
                            onClick={() => combobox.openDropdown()}
                            onFocus={() => combobox.openDropdown()}
                            onBlur={() => combobox.closeDropdown()}
                            onKeyDown={(e) => {
                                keyboardSfx(e);
                                if (e.key == "Enter" && combobox.getSelectedOptionIndex() == -1) {
                                    if(shortcut) {
                                        navigate(shortcutToLocation(shortcut));
                                        setValue(e.currentTarget.value || "");
                                        ref.current.blur();
                                        combobox.closeDropdown();
                                    } else {
                                        search(e.currentTarget.value);
                                    }
                                }
                            }}
                            onKeyUp={(e) => {
                                setPickedSuggestion(suggestions[combobox.getSelectedOptionIndex()]?.text)
                            }}
                            rightSection={loading && <Loader size={18} />}
                        />
                    </Grid.Col>
                    <Grid.Col span="content">
                        <ActionIcon
                            variant="light"
                            size="lg"
                            onClick={() => {
                                search(value);
                            }}
                        >
                            <IconSearch />
                        </ActionIcon>
                    </Grid.Col>
                </Grid>
            </Combobox.Target>

            <Combobox.Dropdown>
                {errorMessage && (
                    <Stack w="100%" align="center" py="md">
                        <IconAlertTriangle />
                        <Stack align="center" gap={0}>
                            <Text fw="bold" c="yellow">Error</Text>
                            <Text>{errorMessage}</Text>
                        </Stack>
                    </Stack>
                )}
                {shortcut && (
                    <Stack w="100%">
                        <SearchShortcutRenderer
                            shortcut={shortcut}
                        />
                    </Stack>
                )}
                {loading && (
                    <Stack w="100%" align="center" py="md">
                        <Loader />
                    </Stack>
                )}
                <Combobox.Options>
                    {options}
                    {!loading && !errorMessage && !suggestions.length && (
                        <Stack py="md" align="center">
                            {value ? (
                                shortcut ? "" : "No results found"
                            ) : (
                                <Stack gap={0} align="center">
                                    <Text c="var(--mantine-color-text)">Start typing to search</Text>
                                    <Text fz="sm" c="dimmed">Suggestions will appear here</Text>
                                </Stack>
                            )}
                        </Stack>
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};
