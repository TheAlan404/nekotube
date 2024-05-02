import { Text, TextProps, Tooltip } from "@mantine/core";
import React from "react";
import { useIsShortened } from "../../hooks/useIsShortened";

export const TextWithTooltip = (props: TextProps & React.PropsWithChildren) => {
    const { ref, isShortened } = useIsShortened();
    
    return (
        <Tooltip
            label={props.children}
            withArrow
            disabled={!isShortened}
            multiline
        >
            <Text
                {...props}
                // @ts-ignore
                ref={ref}
            />
        </Tooltip>
    );
};
