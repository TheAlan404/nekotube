import { useEffect, useRef, useState } from "react";

export const isEllipsisActive = (e: HTMLElement) => {
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

export const isLineClampActive = (e: HTMLElement) => e.scrollHeight > e.clientHeight;

export const useIsShortened = () => {
    const [isShortened, setShortened] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if(ref.current) setShortened(isLineClampActive(ref.current));
    }, [ref.current]);

    return {
        ref,
        isShortened,
    };
};
