import { parseChapters } from "../../../utils/parseChapters";
import { APIProvider } from "../../types/api";
import { InvidiousInstance } from "../../types/instances";
import { SearchSuggestions, VideoData } from "../../types/video";
import { VideoFormat } from "../../types/format";
import { InvidiousSearchResult, InvidiousVideo, InvidiousVideoData } from "./types";

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

    searchSuggestions = async (query: string, signal?: AbortSignal) => {
        let data: { suggestions: string[] } = await this.request("search/suggestions", {
            query: { q: query },
            signal,
        });

        return data.suggestions;
    };

    async search(q: string) {
        let data: InvidiousSearchResult[] = await this.request("search", { query: { q } });

        return {
            key: null,
            results: [],
        };
    }

    formatURLProxied(uri: string) {
        let url = new URL(uri);
        url.host = this.instance.url.split("://")[1];
        return url.href;
    }

    getVideoInfo = async (id: string) => {
        let v: InvidiousVideoData = await this.request(`videos/${id}`);

        console.log({ invidiousVideoData: v });

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
                ...v.formatStreams.map((f, i) => ({
                    type: "basic",
                    id: `basic-${i}`,
                    isProxied: false,
                    itag: f.itag,
                    url: f.url,
                    mimeType: f.type,
                    fps: f.fps,
                    width: Number(f.size.split("x")[0]),
                    height: Number(f.size.split("x")[1]),
                    bitrate: Number(f.bitrate),
                } as VideoFormat)),
                ...v.adaptiveFormats.map((f, i) => ({
                    type: "adaptive",
                    id: `adaptive-${i}`,
                    isProxied: false,
                    itag: f.itag,
                    url: f.url,
                    mimeType: f.type,
                    fps: f.fps,
                    bitrate: Number(f.bitrate),
                } as VideoFormat)),
                ...(this.instance.supportsProxy ? [
                    ...v.formatStreams.map((f, i) => ({
                        type: "basic",
                        id: `basic-${i}-proxy`,
                        itag: f.itag,
                        url: this.formatURLProxied(f.url),
                        isProxied: true,
                        mimeType: f.type,
                        fps: f.fps,
                        width: Number(f.size.split("x")[0]),
                        height: Number(f.size.split("x")[1]),
                        bitrate: Number(f.bitrate),
                    } as VideoFormat)),
                    ...v.adaptiveFormats.map((f, i) => ({
                        type: "adaptive",
                        id: `adaptive-${i}-proxy`,
                        itag: f.itag,
                        url: this.formatURLProxied(f.url),
                        isProxied: true,
                        mimeType: f.type,
                        fps: f.fps,
                        bitrate: Number(f.bitrate),
                    } as VideoFormat)),
                ] : []),
            ],
        } as VideoData;
    };
};
