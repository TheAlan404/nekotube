import { ColorPicker, ColorSwatch, LoadingOverlay, SimpleGrid, Stack, Tooltip, useMantineTheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../theme";

export const ThemeSection = () => {
    const { primaryColor, setPrimaryColor } = useContext(ThemeContext);
    const theme = useMantineTheme();
    const shade = 8;

    return (
        <Stack w="100%">
            <SimpleGrid cols={7}>
                {Object.keys(theme.colors).map((color) => (
                    <Tooltip 
                        key={color}
                        withArrow
                        label={(
                            color[0].toUpperCase() + color.slice(1) + (primaryColor == color ? " (Active)" : "")
                        )}>
                        <ColorSwatch
                            color={theme.colors[color][shade]}
                            onClick={() => {
                                setPrimaryColor(color);
                            }}
                        >
                            {primaryColor == color && <IconCheck />}
                        </ColorSwatch>
                    </Tooltip>
                ))}
            </SimpleGrid>
        </Stack>
    );
};
