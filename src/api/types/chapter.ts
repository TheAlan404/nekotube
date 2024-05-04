export type ActiveChapterList = {
    type: "video" | "user";
    chapters: Chapter[];
} | {
    type: "comment";
    chapters: Chapter[];
    id: string;
};

export interface Chapter {
    time: number;
    label: string;
    group?: string;
};

