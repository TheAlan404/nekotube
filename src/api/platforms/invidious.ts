import { parseChapters } from "../../utils/parseChapters";
import { APIProvider } from "../types/api";
import { InvidiousInstance } from "../types/instances";
import { SearchSuggestions, VideoFormat, VideoInfo } from "../types/video";

interface InvidiousThumbnail {
    quality: string;
    url: string;
    width: number;
    height: number;
};

interface InvidiousVideo {
    type: string;
    title: string;
    videoId: string;
    videoThumbnails: InvidiousThumbnail[];
    description: string;
    descriptionHtml: string;
    published: number;
    publishedText: string;
    keywords: string[];
    viewCount: number;
    likeCount: number;
    dislikeCount: number;
    paid: boolean;
    premium: boolean;
    isFamilyFriendly: boolean;
    allowedRegions: string[];
    genre: string;
    genreUrl: string;
    author: string;    
    authorId: string;    
    authorUrl: string;    
    authorVerified: boolean;    
    authorThumbnails: { url: string; width: number; height: number; }[];
    subCountText: string;
    lengthSeconds: number;
    isListed: boolean;
    liveNow: boolean;
    isPostLiveDvr: boolean;
    isUpcoming: boolean;
    dashUrl: string;
    adaptiveFormats: InvidiousAdaptiveFormat[];
    formatStreams: InvidiousFormat[];
    captions: any[];
    recommendedVideos: any[];
};

interface InvidiousAdaptiveFormat {
    itag: string;
    url: string;
    init: string;
    index: string;
    bitrate: string;
    type: string;
    clen: string;
    lmt: string;
    projectionType: string;
    fps: number;
    container: string;
    encoding: string;
    audioQuality: string;
    audioSampleRate: number;
    audioChannels: number;
}

interface InvidiousFormat {
    url: string;
    itag: string;
    type: string;
    quality: string;
    bitrate: string;
    fps: number;
    container: string;
    encoding: string;
    resolution: string;
    qualityLabel: string;
    size: string;
}

export class InvidiousAPIProvider implements APIProvider {
    instance: InvidiousInstance;

    constructor(
        instance: InvidiousInstance,
    ) {
        this.instance = instance;
    }

    request = async <T>(path: string, opts?: {
        query: Record<string, string>;
        signal?: AbortSignal;
    }) => {
        let url = new URL(this.instance.url + "/api/v1/" + path);

        for(let [k,v] of Object.entries(opts?.query || {}))
            url.searchParams.set(k, v);
        
        let res = await fetch(url, {
            signal: opts?.signal,
            headers: {
                "Content-Type": "application/json; utf-8",
            },
        });

        return await res.json() as T;
    }

    searchSuggestions = async (query: string) => {
        let data: { suggestions: string[] } = await this.request("search/suggestions", {
            query: { q: query }
        });

        return data.suggestions;
    };

    getVideoInfo = async (id: string) => {
        let v: InvidiousVideo = await this.request(`videos/${id}`);

        console.log(v);

        return {
            id,
            title: v.title,
            channel: {
                id: v.authorId,
                title: v.author,
            },
            chapters: parseChapters(v.descriptionHtml),
            description: v.descriptionHtml,
            keywords: v.keywords,
            likeCount: v.likeCount,
            viewCount: v.viewCount,
            published: new Date(v.published),

            formats: [
                ...v.formatStreams.map(f => ({
                    itag: f.itag,
                    url: f.url,
                    mimeType: f.type,
                    fps: f.fps,
                    width: Number(f.size.split("x")[0]),
                    height: Number(f.size.split("x")[1]),
                    bitrate: Number(f.bitrate),
                } as VideoFormat)),
            ],
        } as VideoInfo;
    };
};
