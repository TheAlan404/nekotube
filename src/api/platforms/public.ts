import { Instance } from "../types/instances";

// --- lighttube ---

const LT_PUBLIC_INSTANCES = "https://lighttube.kuylar.dev/instances";

interface PublicLighttubeInstance {
    host: string;
    country: string;
    scheme: "https";
    apiEnabled: boolean;
    accountsEnabled: boolean;
    isCloudflare: boolean;
    proxyEnabled: "all";
    accounts: boolean;
};

export const fetchLightTubePublicInstances = async () => {
    const res = await fetch(LT_PUBLIC_INSTANCES);
    const list: PublicLighttubeInstance[] = await res.json();

    return list.filter(i => i.apiEnabled).map(i => ({
        type: "lighttube",
        name: i.host,
        url: `${i.scheme}://${i.host}`,
        notes: i.country + (i.isCloudflare ? ", cloudflare" : ""),
    } as Instance));
};

// --- invidious ---

const INVIDIOUS_PUBLIC_INSTANCES = "https://api.invidious.io/instances.json";

interface PublicInvidiousInstanceDetails {
    uri: string;
    cors: boolean;
    api: boolean;
    type: "https" | "i2p" | "onion";
    flag: string;
    region: string;
}

type PublicInvidiousInstance = [string, PublicInvidiousInstanceDetails];

export const fetchInvidiousPublicInstances = async () => {
    const res = await fetch(INVIDIOUS_PUBLIC_INSTANCES);
    const li: PublicInvidiousInstance[] = await res.json();

    return li
        .filter(([_, i]) => i.type == "https")
        .filter(([_, i]) => i.cors && i.api)
        .map(([name, i]) => ({
            type: "invidious",
            url: i.uri,
            name,
            notes: i.region,
        } as Instance));
};
