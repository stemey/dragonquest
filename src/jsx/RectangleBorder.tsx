import {
    useRef,
    useState,
    useEffect,
} from "@dragonquest/jsx/jsx-runtime";
import { GameObjects } from "phaser";
import { Container } from "./Container";
import { Rectangle } from "./Rectangle";

export const RectangleBorder = (props: { points: Phaser.Geom.Point[] }) => {
    const ref = useRef<GameObjects.Container>();
    const [time, setTime] = useState(0);
    console.log("render", time);

    useEffect(() => {
        ref.current?.scene.events.on(
            "preupdate",
            (newTime: number, delta: number) => {
                const timeStep = Math.trunc(newTime / 50);
                if (timeStep !== time) {
                    console.log("trigger");
                    setTime(timeStep);
                }
            }
        );
    }, [ref.current]);

    const points = props.points.map((p, idx) => {
        const alpha = (((idx - time) % 30) + 1) / 30;
        return (
            <Rectangle
                x={p.x}
                y={p.y}
                width={4}
                height={4}
                fillColor={0xaaaaaa}
                fillAlpha={alpha}
            />
        );
    });
    return <Container ref={ref}>{points}</Container>;
};
