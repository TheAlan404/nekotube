import { useEffect } from "react";

export function useVideoEventListener<E extends HTMLVideoElement, K extends keyof HTMLVideoElementEventMap>(
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

export function useElementEventListener<E extends HTMLElement, M extends HTMLElementEventMap, K extends keyof HTMLElementEventMap>(
    el: E,
    type: K,
    listener: (this: E, ev: M[K]) => any,
    options?: boolean | AddEventListenerOptions
) {
    useEffect(() => {
        el.addEventListener<K>(type, listener, options);

        return () => el.removeEventListener(type, listener, options);
    }, [listener, options]);
}
