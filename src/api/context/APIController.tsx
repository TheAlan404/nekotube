import { createContext, useMemo, useState } from "react";
import { Instance } from "../types/instances";
import { APIProvider } from "../types/api";
import { LTAPIProvider } from "../platforms/lighttube";

export interface APIController {
    currentInstance: Instance;
    availableInstances: Instance[];
    setInstance: (instance: Instance) => void;

    api: APIProvider;
};

// @ts-ignore
export const APIContext = createContext<APIController>();

export const APIControllerProvider = ({ children }: React.PropsWithChildren) => {
    const [currentInstance, setCurrentInstance] = useState<Instance>({
        type: "lighttube",
        name: "tube.kuylar.dev",
        url: "https://tube.kuylar.dev",
    });
    
    const availableInstances = [
        currentInstance,
    ];

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

                api,
            }}
        >
            {children}
        </APIContext.Provider>
    );
};
