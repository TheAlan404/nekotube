import { createTheme, DEFAULT_THEME, DefaultMantineColor, mergeMantineTheme } from "@mantine/core";
import { createContext, useState } from "react";

export type ThemeColor = DefaultMantineColor;

export interface ThemeAPI {
    primaryColor: ThemeColor;
    setPrimaryColor: (color: ThemeColor) => void;
};

export const BaseMantineTheme = createTheme({
    fontFamily: "Lexend-VariableFont",
    primaryColor: "violet",
    cursorType: 'pointer',
    colors: {
        dark: [
            '#C1C2C5',
            '#A6A7AB',
            '#909296',
            '#5c5f66',
            '#373A40',
            '#2C2E33',
            '#25262b',
            '#1A1B1E',
            '#141517',
            '#101113',
        ],
    },
    components: {
        Tooltip: {
            defaultProps: {
                color: "dark",
            },
            styles: {
                color: "var(--mantine-color-text)"
            }
        }
    }
});


export const ThemeContext = createContext<ThemeAPI>({
    primaryColor: "violet",
    setPrimaryColor: () => {},
});
