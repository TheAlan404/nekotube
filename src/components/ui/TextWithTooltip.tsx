import { Stack, Text, TextProps, Tooltip } from "@mantine/core";
import React from "react";
import { useIsShortened } from "../../hooks/useIsShortened";

export const TextWithTooltip = (
    props: TextProps & React.PropsWithChildren & { extra?: string }
) => {
    const { ref, isShortened } = useIsShortened<HTMLParagraphElement>();
    
    return (
        <Tooltip
            label={(
                <Stack>
                    {props.children}
                    <br />
                    {props.extra}
                </Stack>
            )}
            withArrow
            disabled={!props.extra && !isShortened}
            multiline
        >
            <Text
                {...props}
                ref={ref}
            />
        </Tooltip>
    );
};
