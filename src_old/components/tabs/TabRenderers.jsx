import { Box } from "@mantine/core";
import CommentsList from "../comments/CommentsList";
import ChaptersList from "../videos/ChaptersList";
import RecommendedList from "../videos/RecommendedList";
import Settings from "../menus/Settings";
import PlaylistList from "../playlists/PlaylistList";
import VideoInfo from "../videos/VideoInfo";
import DescriptionTab from "../videos/DescriptionTab";

const TabRenderers = {
    info: () => (
        <VideoInfo noToggle />
    ),
    mobileFirstTab: () => (
        <Box>
            <VideoInfo noToggle />
            <RecommendedList withAutoplay />
        </Box>
    ),
    description: () => (
        <DescriptionTab />
    ),
    comments: () => (
        <CommentsList />
    ),
    chapters: ({ scrollRef }) => (
        <ChaptersList scrollRef={scrollRef} />
    ),
    recommended: () => (
        <Box w="100%" style={{ overflowX: "hidden" }}>
            <RecommendedList withAutoplay />
        </Box>
    ),
    settings: () => (
        <Settings />
    ),
    playlist: () => (
        <PlaylistList />
    ),
};

export default TabRenderers;