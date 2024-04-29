import { SearchResult, SearchSuggestions, VideoData } from "./video";


export interface APIProvider {
    searchSuggestions: (query: string, abort?: AbortSignal) => Promise<SearchSuggestions>;
    search: (query: string) => Promise<{
        key?: string;
        results: SearchResult[];
    }>;
    getVideoInfo: (id: string) => Promise<VideoData>;
};
