import { LTInstance } from "../types/instances";
import { APIProvider } from "../types/api"
import { SearchSuggestions } from "../types/video";

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

    searchSuggestions = async (query: string) => {
        let res: { autocomplete: SearchSuggestions } = await this.request("searchSuggestions", { query: { query } });
        return res.autocomplete;
    };
};
