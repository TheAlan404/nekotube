import { useInterval } from "@mantine/hooks";
import { useState } from "react";

export default function useCountdown(max, onEnd) {
    let [value, setValue] = useState(max);
    let { start, stop, active } = useInterval(() => {
        setValue(v => v - 1);
    }, 1000);

    const reset = () => {
        stop();
        setValue(max);
    };

    if(value <= 0) {
        stop();
        onEnd();
        setValue(max);
    };

    return [value, reset, start];
}