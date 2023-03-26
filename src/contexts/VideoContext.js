import { createContext } from 'react';

export const VideoContext = createContext({
    
    setChapters: () => {},
    descChapters: [],
    chapters: [],
});

VideoContext.displayName = "LTRVideoContext";
