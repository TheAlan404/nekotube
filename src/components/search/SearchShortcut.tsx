import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../api/context/APIController";
import { HorizontalVideoCard } from "../cards/VideoCard";
import { isVideoID, VideoIDLength } from "../../utils/ids";
import { Loader, Stack, Text } from "@mantine/core";

export type SearchShortcut = {
    type: "video" | "channel" | "playlist",
    id: string,
}

export const parseSearchShortcut = (search: string): SearchShortcut | null => {
    if(search.includes("watch?v=")) {
        return {
            type: "video",
            id: search.split("watch?v=")[1].substring(0, VideoIDLength),
        };
    }

    if(isVideoID(search)) {
        return {
            type: "video",
            id: search,
        }
    }

    return null;
};

export const shortcutToLocation = (shortcut: SearchShortcut) => {
    if(shortcut.type == "video") return `/watch?${new URLSearchParams({ v: shortcut.id })}`;
    return "404";
};

export const SearchShortcutRenderer = ({
    shortcut,
}: {
    shortcut?: SearchShortcut,
}) => {
    const { api } = useContext(APIContext);
    const [data, setData] = useState(null);

    useEffect(() => {
        setData(null);
        if(!shortcut) return;

        (async () => {
            if(shortcut.type == "video") {
                setData(await api.getVideoInfo(shortcut.id))
            } else if(shortcut.type == "channel") {
    
            } else {
    
            }
        })()
    }, [shortcut]);

    return (
        <Stack w="100%" align="center" p="sm">
            {shortcut && (
                <>
                    {data ? (
                        <Stack align="center" gap={0}>
                            <Text>
                                Press enter to watch
                            </Text>
                            {shortcut.type == "video" && (
                                <HorizontalVideoCard
                                    video={data}
                                />
                            )}
                        </Stack>
                    ) : (
                        <Stack w="100%" align="center">
                            <Loader />
                            <Text>
                                Loading shotcut preview...
                            </Text>
                        </Stack>
                    )}
                </>
            )}
        </Stack>
    )
}
