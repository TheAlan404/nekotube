import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const useIsMobile = () => {
    const { breakpoints } = useMantineTheme();
    return !useMediaQuery(`(min-width: ${breakpoints.md})`);
};
