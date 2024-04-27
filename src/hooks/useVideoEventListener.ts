import { useEffect } from "react";

export function useVideoEventListener<E extends HTMLVideoElement, K extends keyof HTMLVideoElementEventMap, T extends HTMLElement = any>(
    el: E,
    type: K,
    listener: (this: HTMLVideoElement, ev: HTMLVideoElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
) {
    useEffect(() => {
        el.addEventListener(type, listener, options);

        return () => el.removeEventListener(type, listener, options);
    }, [listener, options]);
}
