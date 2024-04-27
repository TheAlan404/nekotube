import { Text } from '@mantine/core'
import React, { useContext } from 'react'
import { UIContext } from '../../contexts/UIContext';
import { toTimestamp } from '../../lib/utils'

const Timestamp = ({ time, noFunction, color }) => {
    let [{ }, set] = useContext(UIContext);

    return (
        <Text
            span
            sx={(theme) => ({
                ...(!noFunction ? theme.fn.hover() : {}),
                cursor: !noFunction && "pointer",
                padding: "0.1rem",
                background: theme.fn.variant({ variant: "light", color }).background,
                color: theme.fn.variant({ variant: "light", color }).color,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: theme.fn.radius("sm"),
                WebkitTapHighlightColor: 'transparent',
            })}
            onClick={() => !noFunction && set({ jumpTo: time })}
            onMouseEnter={() => !noFunction && set({ hoveredTime: time })}
            onMouseLeave={() => !noFunction && set({ hoveredTime: 0 })}>
            {toTimestamp(time)}
        </Text>
    )
}

export default Timestamp
