import { Stack, Text, TextProps, Tooltip } from "@mantine/core";
import React from "react";
import { useIsShortened } from "../../hooks/useIsShortened";

export const TextWithTooltip = (
    allProps: TextProps & React.PropsWithChildren & { extra?: string }
) => {
    const { ref, isShortened } = useIsShortened<HTMLParagraphElement>();
    const { children, extra, ...props } = allProps;

    return (
        <Tooltip
            label={(
                <Stack>
                    {children}
                    <br />
                    {extra}
                </Stack>
            )}
            withArrow
            disabled={!extra && !isShortened}
            multiline
        >
            <Text
                {...props}
                ref={ref}
            >
                {children}
            </Text>
        </Tooltip>
    );
};
