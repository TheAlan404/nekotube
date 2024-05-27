import { useEffect, useRef, useState } from "react";

export const _isEllipsisActive = (e: HTMLElement) => {
    const temp = e.cloneNode(true) as HTMLElement;

    temp.style.position = "fixed";
    temp.style.overflow = "visible";
    temp.style.whiteSpace = "nowrap";
    temp.style.visibility = "hidden";

    e.parentElement.appendChild(temp);

    try {
        const fullWidth = temp.getBoundingClientRect().width;
        const displayWidth = e.getBoundingClientRect().width;

        return fullWidth > displayWidth;
    } finally {
        temp.remove();
    }
}

export const isLineClampActive = <T extends HTMLElement>(e: T) => e.scrollHeight > e.clientHeight;
export const isEllipsisActive = <T extends HTMLElement>(e: T) => e.scrollWidth > e.clientWidth;

export const useIsShortened = <T extends HTMLElement>() => {
    const [isShortened, setShortened] = useState(false);
    const ref = useRef<T>(null);

    useEffect(() => {
        if(ref.current) setShortened(isLineClampActive(ref.current) || isEllipsisActive(ref.current));
    }, [ref.current]);

    return {
        ref,
        isShortened,
    };
};
