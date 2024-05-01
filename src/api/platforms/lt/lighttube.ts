import { LTInstance } from "../../types/instances";
import { APIProvider } from "../../types/api"
import { Renderer, SearchSuggestions, Thumbnail, VideoData, VideoInfo } from "../../types/video";
import { parseChapters } from "../../../utils/parseChapters";
import { LTVideoResponse } from "./base";
import { LTPlayerResponse, LTSearchResponse } from "./responses";
import { VideoFormat } from "../../types/format";
import { LTRenderer } from "./renderers";

interface LTResult<T> {
    status: string;
    error?: string;
    data: T;
};

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

    convertRenderer = (d: LTRenderer): Renderer | null => {
        if(d.type == "videoRenderer") {
            return {
                type: "video",
                id: d.id,
                title: d.title,
                channel: {
                    id: d.channel.id,
                    title: d.channel.title,
                },
                description: d.description,
                thumbnails: d.thumbnails,
            } as Renderer;
        } else {
            return null;
        }
    };

    searchSuggestions = async (query: string, signal?: AbortSignal) => {
        let res: { autocomplete: SearchSuggestions } = await this.request("searchSuggestions", { query: { query }, signal });
        return res.autocomplete;
    };

    async search(query: string) {
        let res: LTSearchResponse = await this.request("search", { query: { query } });

        return {
            key: res.continuationKey,
            results: res.searchResults.filter(x => x.type == "videoRenderer")
                .map(v => ({
                    type: "video",
                    id: v.id,
                    title: v.title,
                    description: v.description,
                    thumbnails: v.thumbnails,
                    channel: {
                        id: v.channel.id,
                        title: v.channel.title,
                        thumbnails: [{
                            url: v.channel.avatar,
                            width: 176,
                            height: 176,
                        }]
                    },
                } as VideoInfo & { type: "video" })),
        };
    }

    async getVideoInfo(id: string): Promise<VideoData> {
        let ltVideo: LTVideoResponse = await this.request("video", { query: { id } });
        let ltPlayer: LTPlayerResponse = await this.request("player", { query: { id } });

        return {
            id,
            title: ltVideo.title,
            channel: {
                id: ltVideo.channel.id,
                title: ltVideo.channel.id,
                thumbnails: [{
                    url: ltVideo.channel.avatar,
                    width: 176,
                    height: 176,
                }],
            },
            chapters: parseChapters(ltVideo.description),
            description: ltVideo.description,
            keywords: ltPlayer.details.keywords,
            published: new Date(ltPlayer.details.publishDate),
            thumbnails: ltPlayer.details.thumbnails,
            recommended: ltVideo.recommended
                .filter(x => x.type == "videoRenderer")
                .map(this.convertRenderer),

            formats: [
                ...ltPlayer.formats.map((f, i) => ({
                    ...f,
                    type: "basic",
                    id: `basic-${i}`,
                    isProxied: false,
                } as VideoFormat)),
                ...ltPlayer.adaptiveFormats.map((f, i) => ({
                    ...f,
                    type: "adaptive",
                    id: `adaptive-${i}`,
                    isProxied: false,
                } as VideoFormat)),

                ...ltPlayer.formats.map((f, i) => ({
                    ...f,
                    type: "basic",
                    id: `proxy-basic-${i}`,
                    url: `${this.instance.url}/proxy/media/${id}/${f.itag}`,
                    isProxied: true,
                } as VideoFormat)),
                ...ltPlayer.adaptiveFormats.map((f, i) => ({
                    ...f,
                    type: "adaptive",
                    id: `proxy-adaptive-${i}`,
                    url: `${this.instance.url}/proxy/media/${id}/${f.itag}`,
                    isProxied: true,
                } as VideoFormat)),
            ],
        };
    };

    async getComments(id, key) {
        return {
            key: null,
            results: [],
        };
    }
};
