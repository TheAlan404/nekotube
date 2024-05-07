import { ActionIcon, Box, Button, Combobox, Grid, Group, Loader, Stack, Text, TextInput, useCombobox } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import { APIContext } from "../../api/provider/APIController";
import { IconAlertTriangle, IconSearch } from "@tabler/icons-react";
import { useLocation, useNavigate, useNavigation, useSearchParams } from "react-router-dom";
import { useKeyboardSfx } from "../../hooks/useSoundEffect";
import { useHotkeys } from "@mantine/hooks";
import { parseSearchShortcut, SearchShortcut, SearchShortcutRenderer, shortcutToLocation } from "./SearchShortcut";

export const SearchBar = () => {
    const { api } = useContext(APIContext);
    const navigate = useNavigate();
    const location = useLocation();
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
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

    const options = (suggestions || []).map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
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
            let sugs = await api.searchSuggestions(query, abortController.current.signal);
            setSuggestions(sugs);
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
                                setPickedSuggestion(suggestions[combobox.getSelectedOptionIndex()])
                            }}
                            rightSection={loading && <Loader size={18} />}
                        />
                    </Grid.Col>
                    <Grid.Col span="content">
                        <ActionIcon
                            variant="light"
                            color="violet"
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
