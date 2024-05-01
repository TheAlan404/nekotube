import { createContext, useEffect, useMemo, useState } from "react";
import { Instance } from "../types/instances";
import { APIProvider } from "../types/api";
import { LTAPIProvider } from "../platforms/lt/lighttube";
import { fetchInvidiousPublicInstances, fetchLightTubePublicInstances } from "../platforms/public";
import { InvidiousAPIProvider } from "../platforms/invid/invidious";
import { useLocalStorage } from "@mantine/hooks";

const CUSTOM_INSTANCES: Instance[] = [
    {
        type: "lighttube",
        name: "lighttube-nightly.kuylar.dev",
        url: "https://lighttube-nightly.kuylar.dev",
    },
    {
        type: "lighttube",
        name: "tube-nocors.kuylar.dev",
        url: "https://tube-nocors.kuylar.dev",
    }
];

const DEFAULT_INSTANCE: Instance = {
    type: "lighttube",
    name: "tube.kuylar.dev",
    url: "https://tube.kuylar.dev",
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
};

export const APIContext = createContext<APIController>({
    api: new LTAPIProvider(DEFAULT_INSTANCE!),
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
            ...CUSTOM_INSTANCES,
        ]);
        setIsRefreshing(false);
    };

    useEffect(() => {
        refreshAvailableInstances();
    }, []);

    const api = useMemo(() => {
        if(currentInstance.type == "lighttube") {
            return new LTAPIProvider(currentInstance);
        } else if (currentInstance.type == "invidious") {
            return new InvidiousAPIProvider(currentInstance);
        } else {
            throw new Error("uhhh");
        }
    }, [currentInstance]);
    
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
            }}
        >
            {children}
        </APIContext.Provider>
    );
};
