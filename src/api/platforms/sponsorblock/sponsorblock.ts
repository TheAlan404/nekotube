export interface DeArrowEntry {
    title: string,
    original: boolean,
    votes: number,
    locked: boolean,
    UUID: string,
}

export interface DeArrowThumbnail {
    // null if original is true
    timestamp?: number,
    original: boolean,
    votes: number,
    locked: boolean,
    UUID: string,
}

export interface DeArrowResponse {
    titles: DeArrowEntry[];
    thumbnails: DeArrowThumbnail[];
    randomTime: number;
    videoDuration?: number;
};

export type SponsorBlockActionType = "skip" | "mute" | "full" | "poi" | "chapter";
export type SponsorBlockCategory = "sponsor"
    | "selfpromo"
    | "interaction"
    | "intro"
    | "outro"
    | "preview"
    | "music_offtopic"
    | "filler"
    | "poi_highlight" // actionType: "poi"
    | "exclusive_access" // actionType: "full"
    | "chapter" // actionType: "chapter"

export interface SponsorBlockSegment {
    segment: [number, number];
    UUID: string;
    category: SponsorBlockCategory;
    videoDuration: number;
    actionType: SponsorBlockActionType;
    locked: number;
    votes: number;
    description: string;
};

export const SPONSORBLOCK_API_URL = "https://sponsor.ajay.app";

export class SponsorBlockAPI {
    url: string;

    constructor(url = SPONSORBLOCK_API_URL) {
        this.url = url;
    }

    request = async <T>(path: string, opts?: {
        query: Record<string, string>;
        signal?: AbortSignal;
    }) => {
        let url = new URL(this.url + "/api/" + path);

        for(let [k,v] of Object.entries(opts?.query || {}))
            url.searchParams.set(k, v);
        
        let res = await fetch(url, {
            signal: opts?.signal,
        });

        return await res.json() as T;
    }

    async deArrow(videoID: string) {
        let data: DeArrowResponse = await this.request("branding", { query: { videoID } });
        return data;
    }

    async fetchSegments(videoID: string) {
        let data: SponsorBlockSegment[] = await this.request("skipSegments", { query: {
            videoID,
            categories: JSON.stringify(['sponsor', 'intro', 'outro', 'interaction', 'selfpromo', 'music_offtopic', 'preview', 'filler']),
        } });
        return data;
    }
};
