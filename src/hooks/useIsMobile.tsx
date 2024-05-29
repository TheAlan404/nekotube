import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { createContext, useContext } from "react";

export const useIsMobile = () => {
    return useContext(MobileContext);
};

export const MobileContext = createContext(false);
export const MobileProvider = ({ children }: React.PropsWithChildren) => {
    const { breakpoints } = useMantineTheme();
    let value = !useMediaQuery(`(min-width: ${breakpoints.sm})`, true);

    return (
        <MobileContext.Provider
            value={value}
        >
            {children}
        </MobileContext.Provider>
    )
};
