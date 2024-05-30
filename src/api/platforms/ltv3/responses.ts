import { LTFormat, LTPlayerDetails } from "./base";
import { LTComment, LTRenderer } from "./renderers";

export interface LTSearchResponse {
    searchResults: LTRenderer[];
    estimatedResults: number;
    searchParams: any;
    continuation: string;
};

export interface LTPlayerResponse {
    details: LTPlayerDetails;
    formats: LTFormat[];
    adaptiveFormats: LTFormat[];
}

export interface LTCommentsResponse {
    continuationToken?: string;
    results: {
        type: "comment";
        originalType: "commentThreadRenderer";
        data: LTComment;
    }[];
};

