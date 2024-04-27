import { SearchSuggestions, VideoInfo } from "./video";


export interface APIProvider {
    searchSuggestions: (query: string) => Promise<SearchSuggestions>;
    getVideoInfo: (id: string) => Promise<VideoInfo>;
};
