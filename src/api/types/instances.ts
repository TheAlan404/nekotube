export interface LTInstance {
    type: "lighttube";
    name: string;
    url: string;
    notes?: string;
    region?: string;
};

export interface InvidiousInstance {
    type: "invidious";
    name: string;
    url: string;
    notes?: string;
    region?: string;
};

export type Instance = LTInstance | InvidiousInstance;
