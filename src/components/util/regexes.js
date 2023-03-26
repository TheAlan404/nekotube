export const VideoIDRegex = /[a-zA-Z0-9_-]{11}/;
export const isVideoID = (s) => s.length == 11 && VideoIDRegex.test(s);
export const ChannelIDRegex = /[a-zA-Z0-9_-]{24}/;
export const isChannelID = (s) => s.length == 24 && ChannelIDRegex.test(s);
export const PlaylistIDRegex = /[a-zA-Z0-9_-]{34}/;
export const isPlaylistID = (s) => s.length == 34 && PlaylistIDRegex.test(s);

export const isUrl = (s) => {
    if(s.startsWith("javascript:")) return false;
    try {
        new URL(s);
        return true;
    } catch(e) {
        return false;
    };
};

export const getMeta = (s) => {
    if(isUrl(s)) return getMetaFromUrl(s);

    if(isVideoID(s)) {
        return { video: s };
    } else if(isChannelID(s)) {
        return { channel: s }
    } else if(isPlaylistID(s)) {
        return { playlist: s };
    }

    return {};
}

export const getMetaFromUrl = (s) => {
    let u = new URL(s);
    if(s.split("/").includes("channel")) {
        let c = u.pathname.replace("/channel/", "").split("/")[0];
        if(!isChannelID(c)) return {};
        return { channel: c };
    };

    if(u.pathname.startsWith("/playlist") && isPlaylistID(u.searchParams.get("list"))) {
        return { playlist: u.searchParams.get("list") };
    };

    if(u.pathname.startsWith("/watch") && isVideoID(u.searchParams.get("v"))) {
        return { video: u.searchParams.get("v") };
    };

    return {};
}
