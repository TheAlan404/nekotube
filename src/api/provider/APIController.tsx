import { createContext, useEffect, useMemo, useState } from "react";
import { Instance } from "../types/instances";
import { APIProvider } from "../types/api";
import { LTAPIProvider } from "../platforms/ltv2/lighttube";
import { fetchInvidiousPublicInstances, fetchLightTubePublicInstances, fetchPoketubePublicInstances } from "../platforms/public";
import { InvidiousAPIProvider } from "../platforms/invid/invidious";
import { useLocalStorage } from "@mantine/hooks";
import { DislikeAPI } from "../platforms/ryd/dislikeapi";
import { SponsorBlockAPI } from "../platforms/sponsorblock/sponsorblock";
import { LTAPIProviderV3 } from "../platforms/ltv3/lighttube";

const CUSTOM_INSTANCES: Instance[] = [
    {
        type: "lighttube",
        name: "LT nightly",
        url: "https://tube-nightly.kuylar.dev",
        version: "3",
        supportsProxy: true,
    }
];

const DEFAULT_INSTANCE: Instance = {
    type: "invidious",
    name: "invidious.fdn.fr",
    url: "https://invidious.fdn.fr",
    region: "FR",
    supportsProxy: true,
};

export interface APIController {
    currentInstance: Instance;
    availableInstances: Instance[];
    isRefreshing: boolean;
    refreshAvailableInstances: () => void;
    setInstance: (instance: Instance) => void;
    customInstance: boolean;
    setCustomInstance: (custom: boolean) => void;
    favourited: Instance[];
    addFavourite: (i: Instance) => void;
    removeFavourite: (i: Instance) => void;

    api: APIProvider;
    dislikesApi: DislikeAPI;
    sponsorBlockApi: SponsorBlockAPI;
};

export const APIContext = createContext<APIController>({
    api: new InvidiousAPIProvider(DEFAULT_INSTANCE!),
    addFavourite: () => {},
    removeFavourite: () => {},
    refreshAvailableInstances: () => {},
    setCustomInstance: () => {},
    setInstance: () => {},
    availableInstances: [],
    currentInstance: DEFAULT_INSTANCE,
    customInstance: false,
    favourited: [],
    isRefreshing: false,

    dislikesApi: new DislikeAPI(),
    sponsorBlockApi: new SponsorBlockAPI(),
});

export const APIControllerProvider = ({ children }: React.PropsWithChildren) => {
    const [currentInstance, setCurrentInstance] = useLocalStorage<Instance>({
        key: "nekotube:instance",
        defaultValue: DEFAULT_INSTANCE,
    });
    const [customInstance, setCustomInstance] = useLocalStorage<boolean>({
        key: "nekotube:isCustomInstance",
        defaultValue: false,
    });
    const [favourited, setFavourited] = useLocalStorage<Instance[]>({
        key: "nekotube:favouritedInstances",
        defaultValue: [],
    });
    const [isRefreshing, setIsRefreshing] = useState(true);
    const [availableInstances, setAvailableInstances] = useState<Instance[]>([
        DEFAULT_INSTANCE,
        ...CUSTOM_INSTANCES,
    ]);

    const refreshAvailableInstances = async () => {
        setIsRefreshing(true);
        setAvailableInstances([
            ...await fetchLightTubePublicInstances(),
            ...await fetchInvidiousPublicInstances(),
            ...await fetchPoketubePublicInstances(),
            ...CUSTOM_INSTANCES,
        ]);
        setIsRefreshing(false);
    };

    useEffect(() => {
        refreshAvailableInstances();
    }, []);

    const api = useMemo(() => {
        if(currentInstance.type == "lighttube") {
            if(currentInstance.version == "3") {
                return new LTAPIProviderV3(currentInstance);
            } else {
                return new LTAPIProvider(currentInstance);
            }
        } else if (currentInstance.type == "invidious") {
            return new InvidiousAPIProvider(currentInstance);
        } else {
            throw new Error("uhhh");
        }
    }, [currentInstance]);

    const dislikesApi = useMemo(() => new DislikeAPI(), []);
    const sponsorBlockApi = useMemo(() => new SponsorBlockAPI(), []);
    
    return (
        <APIContext.Provider
            value={{
                currentInstance,
                availableInstances,
                setInstance: setCurrentInstance,
                isRefreshing,
                refreshAvailableInstances,
                customInstance,
                setCustomInstance,
                favourited,
                addFavourite: (i) => {
                    setFavourited(v => v.some(x => x.url == i.url) ? v : [...v, i]);
                },
                removeFavourite: (i) => {
                    setFavourited(v => v.filter(x => x.url !== i.url));
                },
                api,
                dislikesApi,
                sponsorBlockApi,
            }}
        >
            {children}
        </APIContext.Provider>
    );
};
