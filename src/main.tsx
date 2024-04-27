import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider, createTheme } from "@mantine/core"
import './index.css'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { APIControllerProvider } from "./api/context/APIController.tsx"
import { VideoPlayerProvider } from "./api/context/VideoPlayerProvider.tsx"

const theme = createTheme({
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

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<MantineProvider theme={theme} defaultColorScheme="dark">
			<APIControllerProvider>
				<VideoPlayerProvider>
					<App />
				</VideoPlayerProvider>
			</APIControllerProvider>
		</MantineProvider>
	</React.StrictMode>,
)
