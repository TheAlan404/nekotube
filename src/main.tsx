import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { DEFAULT_THEME, MantineProvider, createTheme, mergeMantineTheme } from "@mantine/core"
import './index.css'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import { NavigationProgress } from "@mantine/nprogress"
import { NekoTubeRouter } from "./site/NekoTubeRouter.tsx"
import { BaseMantineTheme, ThemeColor, ThemeContext } from "./theme.tsx";
import { MobileProvider } from "./hooks/useIsMobile.tsx";

export const ThemeContextProvider = ({
    children
}: React.PropsWithChildren) => {
    const [primaryColor, setPrimaryColor] = useState<ThemeColor>("violet");

    const theme = mergeMantineTheme(mergeMantineTheme(DEFAULT_THEME, BaseMantineTheme), {
        primaryColor,
    });

    return (
        <ThemeContext.Provider
            value={{
                primaryColor,
                setPrimaryColor,
            }}
        >
            <MantineProvider theme={theme} defaultColorScheme="dark">
                <NavigationProgress />
                <MobileProvider>
                    {children}
                </MobileProvider>
            </MantineProvider>
        </ThemeContext.Provider>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeContextProvider>
        <NekoTubeRouter />
    </ThemeContextProvider>,
)
