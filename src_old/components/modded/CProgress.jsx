import React, { forwardRef } from 'react';
import {
    useComponentDefaultProps,
} from '@mantine/styles';
import { Box } from '@mantine/core';













import {
    createStyles,
    keyframes,
    rem,
    getSize,
} from '@mantine/styles';

const sizes = {
    xs: rem(3),
    sm: rem(5),
    md: rem(8),
    lg: rem(12),
    xl: rem(16),
};

const stripesAnimation = keyframes({
    from: { backgroundPosition: '0 0' },
    to: { backgroundPosition: `${rem(40)} 0` },
});

const useStyles = createStyles((theme, { color, radius }, { size }) => ({
    root: {
        position: 'relative',
        height: getSize({ size, sizes }),
        borderRadius: theme.fn.radius(radius),
    },

    segment: {
        position: 'absolute',
        height: "100%",
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
        
        overflow: 'hidden',
        opacity: 0.7,

        '&:last-of-type': {
            borderTopRightRadius: theme.fn.radius(radius),
            borderBottomRightRadius: theme.fn.radius(radius),
        },

        '&:first-of-type': {
            borderTopLeftRadius: theme.fn.radius(radius),
            borderBottomLeftRadius: theme.fn.radius(radius),
        },

        /* '&:hover': {
            top: "-50%",
            height: "200%",
        }, */
    },

    bar: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.fn.variant({
            variant: 'filled',
            primaryFallback: false,
            color: color || theme.primaryColor,
        }).background,
        //transition: 'width 50ms linear',

        '@media (prefers-reduced-motion)': {
            transitionDuration: theme.respectReducedMotion ? '0ms' : undefined,
        },

        '&[data-playing="true"]': {
            borderTopRightRadius: theme.fn.radius(radius),
            borderBottomRightRadius: theme.fn.radius(radius),
        },
    },

    label: {
        color: theme.white,
        fontSize: `calc(${getSize({ size, sizes })} * 0.65)`,
        fontWeight: 700,
        userSelect: 'none',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
}));


const defaultProps = {
    size: 'md',
    radius: 'sm',
    striped: false,
    animate: false,
    label: '',
};

export const CProgress = forwardRef((props, ref) => {
    const {
        className,
        value,
        color,
        size,
        radius,
        striped,
        animate,
        label,
        'aria-label': ariaLabel,
        classNames,
        styles,
        sections,
        unstyled,
        variant,
        ...others
    } = useComponentDefaultProps('Progress', defaultProps, props);

    const { classes, cx, theme } = useStyles(
        { color, radius },
        { name: 'Progress', classNames, styles, unstyled, variant, size }
    );

    return (
        <Box className={classes.root} ref={ref} {...others}>
            {props.segments.map(({
                pos,
                value,
            }, i) => (
                <Box key={i} className={classes.segment} style={{
                    left: `calc(${pos[0]}% + 1px)`,
                    width: `calc(${pos[1]}% - 2px)`,
                }} >
                    <div
                        role="progressbar"
                        aria-valuemax={100}
                        aria-valuemin={0}
                        aria-valuenow={value}
                        aria-label={ariaLabel}
                        className={classes.bar}
                        style={{ width: `${value}%` }}
                        data-playing={value < 100}
                    >
                    </div>
                </Box>
            ))}
        </Box>
    );

    /* return (
        <Box className={cx(classes.root, className)} ref={ref} {...others}>
            <div
                role="progressbar"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={value}
                aria-label={ariaLabel}
                className={classes.bar}
                style={{ width: `${value}%` }}
            >
            </div>
            {props.children}
        </Box>
    ); */
});



