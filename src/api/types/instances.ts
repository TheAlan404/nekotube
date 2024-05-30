export interface BaseInstance {
    name: string;
    url: string;
    notes?: string;
    region?: string;
    supportsProxy?: boolean;
};

export interface LTInstance extends BaseInstance {
    type: "lighttube";
    version?: "2" | "3";
};

export interface InvidiousInstance extends BaseInstance {
    type: "invidious";
};

export interface PoketubeInstance extends BaseInstance {
    type: "poketube";
};

export type Instance = LTInstance | InvidiousInstance | PoketubeInstance;
