import { useEffect, useRef } from "@dragonquest/jsx/jsx-runtime";
import { Curves, GameObjects } from "phaser";
import { Container } from "./Container";
import { Follower, FollowerProps } from "./Follower";

export const RectangleBorderV2 = (props: { width: number; height: number }) => {
    const { width, height } = props;

    const size = 8;
    const path = createPath(width, height);

    //path.getLength()

    const points = new Phaser.Geom.Rectangle(
        0,
        0,
        props.width - size,
        props.height - size
    ).getPoints(0, size);

    const texture = "knight";

    const followers = points
        .map((p, idx) => {
            const length = 4;
            const numberOfSwooshes = 2;

            //const alpha = 1 - ((time + idx) % pointsInBatch) / pointsInBatch;
            //const pos = (time + idx) % points.length;
            let alpha = 0;
            const segmentLength = points.length / numberOfSwooshes;
            const posInSegment = idx % segmentLength;
            const startAt = idx / points.length;

            //const distance = pos-idx

            const visible = posInSegment >= 0 && posInSegment < length;
            if (visible) {
                alpha = (posInSegment+1) / length;
                return (
                    <SelfStartingFollower
                        path={path}
                        texture={texture}
                        alpha={alpha}
                        scale={0.3}
                        startAt={startAt}
                    ></SelfStartingFollower>
                );
            }

            //const alpha = pos===idx?1:0;//(pos % pointsInBatch) % 4 == 0;
        })
        .filter((r) => !!r);

    return <Container>{followers}</Container>;
};

const SelfStartingFollower = (props: FollowerProps & { startAt?: number }) => {
    const { startAt } = props;
    const ref = useRef<GameObjects.PathFollower>();

    useEffect(() => {
        ref.current?.startFollow({
            duration: 10000,
            positionOnPath: true,
            startAt,
            loop:-1
        });
    }, [ref.current]);

    return <Follower ref={ref} {...props}></Follower>;
};

function createPath(width: number, height: number): Curves.Path {
    const path = new Curves.Path(0, 0);
    path.lineTo(width, 0);
    path.lineTo(width, height);
    path.lineTo(0, height);
    path.closePath();
    return path;
}
