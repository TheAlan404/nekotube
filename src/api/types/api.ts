import { Comment } from "./comment";
import { Renderer, SearchSuggestions, VideoData } from "./video";

export interface WithContinuation<T> {
    key?: string;
    results: T[];
}

export interface APIProvider {
    searchSuggestions: (query: string, abort?: AbortSignal) => Promise<SearchSuggestions>;
    search: (query: string, key?: string) => Promise<WithContinuation<Renderer>>;
    getVideoInfo: (id: string) => Promise<VideoData>;
    getComments: (id: string, key?: string, isReplies?: boolean) => Promise<WithContinuation<Comment>>;
};
