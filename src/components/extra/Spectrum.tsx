// yippieee

import { Box, BoxProps } from "@mantine/core";
import { useCanvas } from "../../utils/useCanvas";
import { useContext, useEffect, useMemo, useRef } from "react";
import { VideoPlayerContext } from "../../api/player/VideoPlayerContext";

const RAINBOW = [ "#ef5350", "#f48fb1", "#7e57c2", "#2196f3", "#26c6da", "#43a047", "#eeff41", "#f9a825", "#ff5722" ];

export const Spectrum = (props: BoxProps) => {
    const { videoElement } = useContext(VideoPlayerContext);

    const audioContextRef = useRef<AudioContext>();
    const analyserRef = useRef<AnalyserNode>();

    useEffect(() => {
        (async () => {
            if(audioContextRef.current) {
                await audioContextRef.current.close();
            }

            audioContextRef.current = new AudioContext();
            let source = audioContextRef.current.createMediaElementSource(videoElement);
            let analyser = audioContextRef.current.createAnalyser();
    
            analyser.fftSize = 2048 * 2;
    
            source.connect(analyser);
            source.connect(audioContextRef.current.destination);
    
            analyserRef.current = analyser;
        })();
    }, [videoElement]);

    const bufferLength = analyserRef.current?.frequencyBinCount || 0;
    const dataArray = new Uint8Array(bufferLength);
    let gradientOffset = 0;

    const ref = useCanvas((ctx, dt) => {
        if(!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        if(gradientOffset > ctx.canvas.width / 2) gradientOffset = 0;

        const gradient = ctx.createLinearGradient(
            (ctx.canvas.width * -0.5) + gradientOffset,
            0,
            (ctx.canvas.width * 1.5) + gradientOffset,
            0
        );
        RAINBOW.forEach((c, i, a) => gradient.addColorStop((i / (a.length-1)) / 2, c));
        RAINBOW.forEach((c, i, a) => gradient.addColorStop((i / (a.length-1) / 2 + 0.5), c));

        gradientOffset += 15;

        ctx.fillStyle = "black";
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(0, ctx.canvas.height);

        let scale = (Math.log(bufferLength) / ctx.canvas.width);
        for (let i = 1; i < bufferLength; i++) {
            let x = Math.log(i) / scale;
            const v = dataArray[i] / 256;
            const y = v * v * v* (ctx.canvas.height);

            ctx.lineTo(x, ctx.canvas.height - y);
        }

        ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
        ctx.stroke();
    }, [analyserRef.current]);
    
    return (
        <Box {...props}>
            <canvas
                style={{
                    width: "100%",
                    height: "100%",
                }}
                ref={ref}
            />
        </Box>
    );
};
