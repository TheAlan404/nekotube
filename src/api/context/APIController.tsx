import { createContext, useEffect, useMemo, useState } from "react";
import { Instance } from "../types/instances";
import { APIProvider } from "../types/api";
import { LTAPIProvider } from "../platforms/lighttube";

export interface APIController {
    currentInstance: Instance;
    availableInstances: Instance[];
    isRefreshing: boolean;
    refreshAvailableInstances: () => void;
    setInstance: (instance: Instance) => void;
    customInstance: boolean;
    setCustomInstance: (custom: boolean) => void;

    api: APIProvider;
};

// @ts-ignore
export const APIContext = createContext<APIController>();

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

const LT_PUBLIC_INSTANCES = "https://raw.githubusercontent.com/kuylar/lighttube/master/public_instances.json";

export const APIControllerProvider = ({ children }: React.PropsWithChildren) => {
    const [currentInstance, setCurrentInstance] = useState<Instance>(DEFAULT_INSTANCE);
    const [customInstance, setCustomInstance] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(true);
    const [availableInstances, setAvailableInstances] = useState<Instance[]>([
        DEFAULT_INSTANCE,
        ...CUSTOM_INSTANCES,
    ]);

    const refreshAvailableInstances = async () => {
        setIsRefreshing(true);
        const res = await fetch(LT_PUBLIC_INSTANCES);
        const list: { host: string; api: boolean }[] = await res.json();
        
        setAvailableInstances([
            ...list.filter(i => i.api).map(i => ({
                type: "lighttube",
                name: i.host.replace("https://", ""),
                url: i.host,
            } as Instance)),
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
                api,
            }}
        >
            {children}
        </APIContext.Provider>
    );
};
