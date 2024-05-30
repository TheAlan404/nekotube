import { parseChapters } from "../../../utils/parseChapters";
import { APIProvider } from "../../types/api";
import { InvidiousInstance } from "../../types/instances";
import { Renderer, SearchSuggestions, Thumbnail, VideoData } from "../../types/video";
import { VideoFormat } from "../../types/format";
import { InvidiousCommentsResponse, InvidiousRenderer, InvidiousVideo, InvidiousVideoData } from "./types";
import { Comment } from "../../types/comment";

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
            if(v) url.searchParams.set(k, v);
        
        let res = await fetch(url, {
            signal: opts?.signal,
        });

        return await res.json() as T;
    }

    convertVideoInfo = (d: InvidiousVideo): Renderer => {
        return {
            type: "video",
            id: d.videoId,
            title: d.title,
            description: d.descriptionHtml,
            thumbnails: d.videoThumbnails as Thumbnail[],
            channel: {
                id: d.authorId,
                title: d.author,
            },
            viewCount: d.viewCount,
            length: d.lengthSeconds,
        } as Renderer;
    };

    searchSuggestions = async (query: string, signal?: AbortSignal) => {
        let data: { suggestions: string[] } = await this.request("search/suggestions", {
            query: { q: query },
            signal,
        });

        return data.suggestions;
    };

    async search(q: string) {
        let data: InvidiousRenderer[] = await this.request("search", { query: { q } });

        return {
            key: null,
            results: data.filter(x => x.type == "video")
                .map(this.convertVideoInfo),
        };
    }

    formatURLProxied(uri: string) {
        let url = new URL(uri);
        url.host = this.instance.url.split("://")[1];
        return url.href;
    }

    getVideoInfo = async (id: string) => {
        let v: InvidiousVideoData = await this.request(`videos/${id}`);

        return {
            id,
            title: v.title,
            channel: {
                id: v.authorId,
                title: v.author,
                thumbnails: v.authorThumbnails,
            },
            chapters: parseChapters(v.descriptionHtml),
            description: v.descriptionHtml,
            keywords: v.keywords,
            likeCount: v.likeCount,
            viewCount: v.viewCount,
            published: new Date(v.published * 1000),
            thumbnails: v.videoThumbnails,
            length: v.lengthSeconds,
            recommended: v.recommendedVideos
                .map(this.convertVideoInfo),

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

    async getComments(id: string, key?: string, isReplies?: boolean) {
        let data: InvidiousCommentsResponse = await this.request(`comments/${id}`, { query: {
            continuation: key,
            action: isReplies ? "action_get_comment_replies" : undefined,
        } });

        return {
            key: data.continuation,
            results: data.comments.map(c => ({
                content: c.contentHtml,
                edited: c.isEdited,
                pinned: c.isPinned,
                hearted: !!c.creatorHeart,
                likeCount: c.likeCount,
                id: c.commentId,
                published: new Date(c.published * 1000),
                replyCount: c.replies?.replyCount || 0,
                replyKey: c.replies?.continuation,
                channel: {
                    id: c.authorId,
                    title: c.author,
                    thumbnails: c.authorThumbnails,
                },
            } as Comment)),
        };
    }
};
