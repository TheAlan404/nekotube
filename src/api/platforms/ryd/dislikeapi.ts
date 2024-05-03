const RETURN_YOUTUBE_DISLIKE_API_URL = "https://returnyoutubedislikeapi.com";

export interface DislikeAPIResponse {
        id: string;
        dateCreated: string;
        likes: number;
        dislikes: number;
        rating: number;
        viewCount: number;
        deleted: boolean;
};

export class DislikeAPI {
    url: string;

    constructor(url = RETURN_YOUTUBE_DISLIKE_API_URL) {
        this.url = url;
    }

    request = async <T>(path: string, opts?: {
        query: Record<string, string>;
        signal?: AbortSignal;
    }) => {
        let url = new URL(this.url + "/" + path);

        for(let [k,v] of Object.entries(opts?.query || {}))
            url.searchParams.set(k, v);
        
        let res = await fetch(url, {
            signal: opts?.signal,
        });

        return await res.json() as T;
    }

    async getDislikes(videoId: string) {
        return await this.request("Votes", { query: { videoId } }) as DislikeAPIResponse;
    };
};
