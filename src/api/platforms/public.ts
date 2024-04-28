import { Instance } from "../types/instances";

// --- lighttube ---

const LT_PUBLIC_INSTANCES = "https://raw.githubusercontent.com/kuylar/lighttube/master/public_instances.json";

export const fetchLightTubePublicInstances = async () => {
    const res = await fetch(LT_PUBLIC_INSTANCES);
    const list: { host: string; api: boolean }[] = await res.json();

    return list.filter(i => i.api).map(i => ({
        type: "lighttube",
        name: i.host.replace("https://", ""),
        url: i.host,
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
        } as Instance));
};
