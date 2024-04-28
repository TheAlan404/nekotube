export interface LTInstance {
    type: "lighttube";
    name: string;
    url: string;
};

export interface InvidiousInstance {
    type: "invidious";
    name: string;
    url: string;
};

export type Instance = LTInstance | InvidiousInstance;
