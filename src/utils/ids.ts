export const VideoIDLength = 11;
export const VideoIDRegex = /[a-zA-Z0-9_-]{11}/;
export const isVideoID = (s: string) => s.length == VideoIDLength && VideoIDRegex.test(s);
export const ChannelIDLength = 24;
export const ChannelIDRegex = /[a-zA-Z0-9_-]{24}/;
export const isChannelID = (s: string) => s.length == ChannelIDLength && ChannelIDRegex.test(s);
export const PlaylistIDRegex = /[a-zA-Z0-9_-]{34}/;
export const PlaylistIDLength = 34;
export const isPlaylistID = (s: string) => s.length == PlaylistIDLength && PlaylistIDRegex.test(s);

export const isUrl = (s: string) => {
    if(s.startsWith("javascript:")) return false;
    try {
        new URL(s);
        return true;
    } catch(e) {
        return false;
    };
};

