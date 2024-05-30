import { LTInstance } from "../../types/instances";
import { APIProvider } from "../../types/api"
import { Renderer, SearchSuggestions, Thumbnail, VideoData, VideoInfo } from "../../types/video";
import { parseChapters } from "../../../utils/parseChapters";
import { LTChannel, LTVideoResponse } from "./base";
import { LTCommentsResponse, LTPlayerResponse, LTSearchResponse } from "./responses";
import { VideoFormat } from "../../types/format";
import { LTRenderer } from "./renderers";
import { Comment } from "../../types/comment";
import { Channel } from "../../types/channel";

interface LTResult<T> {
    status: string;
    error?: string;
    data: T;
};

export class LTAPIProviderV3 implements APIProvider {
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
            if(v) url.searchParams.set(k, v);
        
        let res = await fetch(url, {
            signal: opts?.signal,
            headers: {
                //"Content-Type": "application/json; utf-8",
                //"Accept": "application/json; utf-8",
            },
        });

        let json: LTResult<T> = await res.json();
        
        if(json.error) {
            throw new Error(json.error);
        };

        return json.data;
    }

    convertChannel = (channel: LTChannel) => {
        return {
            id: channel.id,
            title: channel.title,
            thumbnails: channel.avatar,
        } as Channel;
    }

    convertRenderer = (d: LTRenderer): Renderer | null => {
        if(d.type == "video") {
            return {
                type: "video",
                id: d.data.videoId,
                title: d.data.title,
                channel: this.convertChannel(d.data.author),
                ...d.data,
            }
        }

        return null;
    };

    searchSuggestions = async (query: string, signal?: AbortSignal) => {
        let res: { autocomplete: SearchSuggestions } = await this.request("searchSuggestions", { query: { query }, signal });
        return res.autocomplete;
    };

    async search(query: string) {
        let res: LTSearchResponse = await this.request("search", { query: { query } });

        return {
            key: res.continuation,
            results: res.searchResults.filter(x => x.type == "video")
                .map(this.convertRenderer),
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
                title: ltVideo.channel.title,
                thumbnails: ltVideo.channel.avatar,
            },
            chapters: parseChapters(ltVideo.description),
            description: ltVideo.description,
            keywords: ltPlayer.details.keywords,
            published: new Date(ltPlayer.details.publishDate),
            thumbnails: ltPlayer.details.thumbnails,
            recommended: ltVideo.recommended
                .filter(x => x.type == "video")
                .map(this.convertRenderer),

            formats: [
                ...ltPlayer.formats.map((f, i) => ({
                    ...f,
                    type: "basic",
                    id: `basic-${i}`,
                    isProxied: false,
                    mimeType: f.mime,
                } as VideoFormat)),
                ...ltPlayer.adaptiveFormats.map((f, i) => ({
                    ...f,
                    type: "adaptive",
                    id: `adaptive-${i}`,
                    isProxied: false,
                    mimeType: f.mime,
                } as VideoFormat)),

                ...ltPlayer.formats.map((f, i) => ({
                    ...f,
                    type: "basic",
                    id: `proxy-basic-${i}`,
                    url: `${this.instance.url}/proxy/media/${id}/${f.itag}`,
                    mimeType: f.mime,
                    isProxied: true,
                } as VideoFormat)),
                ...ltPlayer.adaptiveFormats.map((f, i) => ({
                    ...f,
                    type: "adaptive",
                    id: `proxy-adaptive-${i}`,
                    url: `${this.instance.url}/proxy/media/${id}/${f.itag}`,
                    isProxied: true,
                    mimeType: f.mime,
                } as VideoFormat)),
            ],
        };
    };

    async getComments(id: string, continuation?: string) {
        let res: LTCommentsResponse = await this.request("comments", { query: {
            id,
            continuation,
        } });

        return {
            key: res.continuationToken,
            results: res.results.map(comment => ({
                channel: this.convertChannel(comment.data.owner),
                content: comment.data.content,
                pinned: comment.data.pinned,
                hearted: !!comment.data.loved,
                replyKey: comment.data.replyContinuation,
                id: comment.data.id,
                //likeCount: comment.data.likeCountText,
                published: new Date(),
            })) as Comment[],
        };
    }
};
