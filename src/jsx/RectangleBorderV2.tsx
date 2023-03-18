import { Tag, useEffect, useRef, useState } from "@dragonquest/jsx/jsx-runtime";
import { Curves, GameObjects } from "phaser";
import { Container } from "./Container";
import { Follower, FollowerProps } from "./Follower";
import { GraphicsProps } from "./graphics/Graphics";
import { GraphicsTexture } from "./graphics/GraphicsTexture";
import { LwRectangle } from "./graphics/LwRectangle";

export const RectangleBorderV2 = (props: {
    visible?: boolean;
    width: number;
    height: number;
}) => {
    const { width, height } = props;

    const size = 2;
    const length = 4;
    const numberOfSwooshes = 4;

    const path = createPath(width, height);

    const pathLength = path.getLength();

    const [texture, setTexture] = useState("");

    const graphicsRef = useRef<GameObjects.Graphics>();

    const onTexture = (id: string) => {
        if (texture === "") {
            setTexture(id);
        }
    };
    const texture2: Tag<GraphicsProps> = (
        <GraphicsTexture
            width={size}
            height={size}
            onTexture={onTexture}
            visible={!!props.visible}
        >
            <LwRectangle
                x={0}
                y={0}
                width={size}
                height={size}
                fillAlpha={1}
                fillColor={0xaaaaaa}
                graphics={graphicsRef.current}
            />
        </GraphicsTexture>
    );

    if (!texture) {
        return <Container>{texture2}</Container>;
    }

    const followers = new Array(numberOfSwooshes * length)
        .fill("")
        .map((v, idx) => {
            let alpha = 0;
            const segmentLength = pathLength / numberOfSwooshes;
            const segment = Math.trunc(idx / length);
            const posInSegment = idx % length;
            const startAt =
                (segmentLength * segment + size * posInSegment) / pathLength;

            const visible = posInSegment >= 0 && posInSegment < length;
            if (visible) {
                alpha = (posInSegment + 1) / length;
                return (
                    <SelfStartingFollower
                        visible={!!props.visible}
                        path={path}
                        texture={texture}
                        alpha={alpha}
                        startAt={startAt}
                    ></SelfStartingFollower>
                );
            }
        })
        .filter((r) => !!r);

    return <Container>{followers}</Container>;
};

const SelfStartingFollower = (
    props: FollowerProps & { visible: boolean; startAt?: number }
) => {
    const { startAt } = props;
    const ref = useRef<GameObjects.PathFollower>();
    const startedCount = useRef<number>(0);

    useEffect(() => {
        if (props.visible && ref.current) {
            ref.current.startFollow({
                duration: 10000,
                positionOnPath: true,
                startAt,
                loop: -1,
            });
            if (typeof startedCount.current === "number") {
                startedCount.current += 1;
            }
            ref.current.visible = true;
        }
        return () => {
            if (ref.current) {
                ref.current.stopFollow();
                ref.current.visible = false;

                if (typeof startedCount.current === "number") {
                    startedCount.current -= 1;
                }
            }
        };
    }, [props.visible, ref.current]);

    return <Follower ref={ref} {...props}></Follower>;
};

function createPath(width: number, height: number): Curves.Path {
    const path = new Curves.Path(-width / 2, -height / 2);
    path.lineTo(width / 2, -height / 2);
    path.lineTo(width / 2, height / 2);
    path.lineTo(-width / 2, height / 2);
    path.closePath();
    return path;
}
