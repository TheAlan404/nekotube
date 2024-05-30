export type VideoFormatType = "basic" | "adaptive" | "dash" | "hls";

export interface VideoFormat {
    type: VideoFormatType;
    id: string;
    isProxied: boolean;
    
    itag: string;
    url: string;
    qualityLabel?: string;
    mimeType: string;
    bitrate: number;
    fps: number;
    width: number;
    height: number;
}
