import { SearchSuggestions } from "./video";


export interface APIProvider {
    searchSuggestions: (query: string) => Promise<SearchSuggestions>;
};
