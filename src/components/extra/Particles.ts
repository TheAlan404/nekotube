export interface Coord {
    x: number;
    y: number;
}

export type Particle = Coord & {
    d: number[];
};

export interface ParticleHandler {
    generate: (ctx: CanvasRenderingContext2D) => Particle;
    move: (ctx: CanvasRenderingContext2D, particle: Particle, dt: number) => Particle | null;
    draw: (ctx: CanvasRenderingContext2D, particle: Particle) => void;
};

const identity = <T>(x: T) => x; 

export const store: Record<string, ParticleHandler> = {
    bass: {
        generate: (ctx) => ({
            d: [],
            x: 0,
            y: ctx.canvas.height,
        }),

        draw(ctx, { y }) {
            //ctx.filter = "invert(1)";
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.globalAlpha = (y / ctx.canvas.height) * 0.5;
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
            ctx.stroke();
            ctx.globalAlpha = 1;
            //ctx.filter = "";
        },

        move: (ctx, {
            d,
            x,
            y,
        }, dt) => (y < 0) ? null : ({
            d,
            x,
            y: y - (1 * dt),
        }),
    },
} as const;
