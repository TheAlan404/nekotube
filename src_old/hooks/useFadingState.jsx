import { useTimeout } from "@mantine/hooks";
import { useState } from "react";

export default function useFadingState(fadeTime = 2000) {
    let [value, setValue] = useState(false);

    const { start, clear } = useTimeout(() => {
        setValue(false);
    }, fadeTime);

    return [value, { start: () => {
        setValue(true);
        clear();
        start();
    } }];
}