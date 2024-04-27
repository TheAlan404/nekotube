import { Text, Tooltip } from '@mantine/core'
import { useMergedRef } from '@mantine/hooks';
import React from 'react'
import useOverflow from '../../hooks/useOverflow'

const TextWithTooltip = (props) => {
    let { ref, overflown } = useOverflow();

    return (
        <>
            <Tooltip disabled={!overflown} label={props.children}>
                <Text {...props} ref={useMergedRef(ref, props.ref)}>
                    {props.children}
                </Text>                
            </Tooltip>
        </>
    )
}

export default TextWithTooltip
