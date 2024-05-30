import { LTFormat, LTPlayerDetails } from "./base";
import { LTRenderer } from "./renderers";

export interface LTSearchResponse {
    searchResults: LTRenderer[];
    estimatedResultCount: number;
    searchParams: any;
    continuationKey: string;
};

export interface LTPlayerResponse {
    details: LTPlayerDetails;
    formats: LTFormat[];
    adaptiveFormats: LTFormat[];
}
