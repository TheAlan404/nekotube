import { useEffect, useRef, useState } from "react";

export default function useOverflow(deps = [], w = true, h = true) {
    let ref = useRef();
    let [overflown, setOverflown] = useState(false);

    useEffect(() => {
        setOverflown(
            (w ? ref.current?.offsetWidth < ref.current?.scrollWidth : false)
            ||
            (h ? ref.current?.offsetHeight < ref.current?.scrollHeight : false)
        );
    }, [ref, ...deps]);

    return { ref, overflown };
};