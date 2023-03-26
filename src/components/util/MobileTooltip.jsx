import { Tooltip } from '@mantine/core';
import React from 'react'

const MobileTooltip = (props) => {
    return (
        <Tooltip {...props}>
            {props.children}
        </Tooltip>
    );
}

export default MobileTooltip
