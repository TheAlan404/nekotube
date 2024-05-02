import { useIntersection, useMergedRef, useScrollIntoView } from "@mantine/hooks";
import { useRef } from "react";

export const useScrollIntoObstructed = () => {
    const intersectionContainerRef = useRef<HTMLDivElement>(null);

    const { ref: intersectionTargetRef, entry } = useIntersection({
        root: intersectionContainerRef.current,
        threshold: 1,
    });

    const {
        scrollIntoView,
        targetRef: scrollTargetRef,
        scrollableRef: scrollContainerRef,
    } = useScrollIntoView<HTMLDivElement, HTMLDivElement>({
        duration: 1000,
        onScrollFinish: () => console.log("onScrollFinish"),
        isList: true,
    });

    const containerRef = useMergedRef(
        intersectionContainerRef,
        scrollContainerRef,
    );

    const targetRef = useMergedRef(
        intersectionTargetRef,
        scrollTargetRef,
    );

    return {
        containerRef,
        targetRef,
        isObstructed: !entry?.isIntersecting,
        scrollIntoView,
    };
};
