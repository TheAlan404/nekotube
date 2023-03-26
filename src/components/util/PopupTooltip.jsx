import { Tooltip } from '@mantine/core';
import { usePrevious, useTimeout } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';

export default function PopupTooltip({
    label,
    children,
    keepLabel,
    ...other
}) {
    const [isFirstRender, setFirstRender] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const { start } = useTimeout(() => {
        setDisabled(true);
    }, 2000);

    useEffect(() => {
        if(isFirstRender) {
            setFirstRender(false);
            return;
        }
        setDisabled(false);
        start();
    }, [label]);

    return (
        <Tooltip
            label={label}
            disabled={!keepLabel && disabled}
            opened={keepLabel ? undefined : !disabled}
            transitionProps={{ transition: 'slide-up', duration: 300 }}
            {...other}>
            {children}
        </Tooltip>
    );
}
