import { createContext } from 'react';

export const PlayerContext = createContext({
    paused: true,
});

PlayerContext.displayName = "LTRPlayerContext";
