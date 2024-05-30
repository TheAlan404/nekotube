import { VideoInfo } from "./video";

export type ActivePlaylist = {
    videos: VideoInfo[];
} & ({
    type: "yt";
    playlistId: string;
} | {
    type: "user";
} | {
    type: "lt";
    playlistId: string;
});
