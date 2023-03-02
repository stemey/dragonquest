import { useRef, useState, useEffect } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects } from "phaser";
import { Container } from "./Container";
import { Rectangle } from "./Rectangle";

export const RectangleBorder = (props: { width: number; height: number }) => {
    const size=4;
    const points = new Phaser.Geom.Rectangle(
        0,
        0,
        props.width - size,
        props.height - size
    ).getPoints(0, size);
    const ref = useRef<GameObjects.Container>();
    const [time, setTime] = useState(0);


    const distance = points.length / 4;

    useEffect(() => {
        ref.current?.scene.events.on(
            "preupdate",
            (newTime: number, delta: number) => {
                const timeStep = Math.trunc(newTime / 50);
                if (timeStep !== time) {
                    setTime(timeStep);
                }
            }
        );
    }, [ref.current]);

    const rects = points.map((p, idx) => {
        const length = 10;
        const numberOfSwooshes = 4;

        //const alpha = 1 - ((time + idx) % pointsInBatch) / pointsInBatch;
        //const pos = (time + idx) % points.length;
        let alpha = 0;
        for (let i = 0; i < numberOfSwooshes; i++) {
            const pos =
                (time + (i * points.length) / numberOfSwooshes) % points.length;

            //const distance = pos-idx
            const x = pos - idx;
            const visible = x >= 0 && x < length;
            if (visible) {
                alpha = 1 - x / length;
            }
        }

        //const alpha = pos===idx?1:0;//(pos % pointsInBatch) % 4 == 0;

        return (
            <Rectangle
                x={p.x}
                y={p.y}
                width={size}
                height={size}
                fillColor={0xaaaaaa}
                fillAlpha={alpha}
            />
        );
    });
    return <Container ref={ref}>{rects}</Container>;
};
