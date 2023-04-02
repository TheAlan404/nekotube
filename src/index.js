import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';
import { SettingsContext } from './contexts/SettingsContext';
import { useListState, useSetState } from '@mantine/hooks';
import { UIContext } from './contexts/UIContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
            colorScheme: 'dark',
            components: {
                Tooltip: {
                    defaultProps: {
                        color: "gray",
                    },
                },
            },
        }}>
        <Notifications />
        <ModalsProvider>
            <LightTubeReact />
        </ModalsProvider>
    </MantineProvider>
);

function LightTubeReact() {
    let [settings, setSettings] = useSetState({
        useProxy: true,
    });
    let [uiContext, setUIContext] = useSetState({});
    let [tabs, tabHandlers] = useListState();

    return (<SettingsContext.Provider value={[settings, setSettings]}>
        <UIContext.Provider value={[
            uiContext,
            setUIContext,
            tabs,
            {
                ...tabHandlers,
                open: (x) => !tabs.includes(x) && tabHandlers.prepend(x),
                close: (x) => tabs.includes(x) && tabHandlers.filter(y => y != x),
                toggle: (x) => tabs.includes(x) ? tabHandlers.filter(y => y != x) : tabHandlers.prepend(x),
            },
        ]}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route index element={<HomePage />} />
                        <Route path="results" element={<SearchPage />} />
                        <Route path="watch" element={<WatchPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </UIContext.Provider>
    </SettingsContext.Provider>);
}
