import { LTInstance } from "../types/instances";
import { APIProvider } from "../types/api"
import { SearchSuggestions, VideoInfo } from "../types/video";
import { parseChapters } from "../../utils/parseChapters";

interface LTResult<T> {
    status: string;
    error?: string;
    data: T;
};

interface LTChannel {
    id: string;
    title: string;
    avatar?: string;
    subscribers?: string;
    badges: any[];
}

interface LTVideoResponse {
    id: string;
    title: string;
    description: string;
    dateText: string;
    viewCount: string;
    likeCount: string;
    channel: LTChannel;
    commentsContinuation: string;
    commentCount: string;
    recommended: any[];
}

interface LTPlayerDetails {
    id: string;
    title: string;
    author: LTChannel;
    keywords: string[];
    shortDescription: string;
    category?: string;
    publishDate: string;
    uploadDate: string;
    length: string;
    isLive: boolean;
    allowRatings: boolean;
    isFamilySafe: boolean;
    thumbnails: { width: number; height: number; url: string }[];
}

interface LTFormat {
    itag: string;
    bitrate: number;
    fps: number;
    width: number;
    height: number;
    mimeType: string;
    url: string;
    quality: string;
    qualityLabel: string;
    audioQuality: string;
    audioSampleRate: number;
    audioChannels: number;
    audioTrack?: string;
};

interface LTPlayerResponse {
    details: LTPlayerDetails;
    formats: LTFormat[];
    adaptiveFormats: LTFormat[];
}

export class LTAPIProvider implements APIProvider {
    instance: LTInstance;

    constructor(
        instance: LTInstance,
    ) {
        this.instance = instance;
    }

    request = async <T>(path: string, opts?: {
        query: Record<string, string>;
        signal?: AbortSignal;
    }) => {
        let url = new URL(this.instance.url + "/api/" + path);

        for(let [k,v] of Object.entries(opts?.query || {}))
            url.searchParams.set(k, v);
        
        let res = await fetch(url, {
            signal: opts?.signal,
            headers: {
                "Content-Type": "application/json; utf-8",
            },
        });

        let json: LTResult<T> = await res.json();
        
        if(json.error) {
            throw new Error(json.error);
        };

        return json.data;
    }

    searchSuggestions = async (query: string) => {
        let res: { autocomplete: SearchSuggestions } = await this.request("searchSuggestions", { query: { query } });
        return res.autocomplete;
    };

    async getVideoInfo(id: string): Promise<VideoInfo> {
        let ltVideo: LTVideoResponse = await this.request("video", { query: { id } });
        let ltPlayer: LTPlayerResponse = await this.request("player", { query: { id } });

        return {
            id,
            title: ltVideo.title,
            channel: {
                id: ltVideo.channel.id,
                title: ltVideo.channel.id,
            },
            chapters: parseChapters(ltVideo.description),
            description: ltVideo.description,
            keywords: ltPlayer.details.keywords,
            published: new Date(ltPlayer.details.publishDate),

            formats: [
                ...ltPlayer.formats,
                //...ltPlayer.adaptiveFormats,
                ...ltPlayer.formats.map(f => ({
                    ...f,
                    itag: f.itag+`-proxy`,
                    url: `${this.instance.url}/proxy/media/${id}/${f.itag}`,
                })),
            ],
        };
    };
};
