import { useMediaQuery } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/styles";

export default function useIsMobile() {
    let theme = useMantineTheme();
    return useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
}