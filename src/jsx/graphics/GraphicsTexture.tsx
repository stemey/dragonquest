import {
    Element,
    useEffect,
    useRef,
    useState,
} from "@dragonquest/jsx/jsx-runtime";
import { GameObjects } from "phaser";
import { Graphics } from "./Graphics";
import { LineStyle } from "./LwRectangle";

export const GraphicsTexture = (props: {
    name?: string;
    width: number;
    height: number;
    onTexture?: (name: string, texture: Phaser.Textures.Texture) => void;
    lineStyle?: LineStyle;
    children?: Element<{ graphics?: GameObjects.Graphics }>[];
    visible:boolean
}) => {
    const ref = useRef<GameObjects.Graphics>();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (ref.current) {
            if (!ready) {
                // not a good solution. How to wait for children to have painted?
                setReady(true);
            } else {
                const name = props.name || "texture" + Math.random();
                ref.current.generateTexture(name, props.width, props.height);
                const x = ref.current.scene.textures.get(name);
                if (props.onTexture) {
                    props.onTexture(name, x);
                }
            }
        }
    }, [ref.current, ready]);

    return (
        <Graphics ref={ref} lineStyle={props.lineStyle} visible={props.visible}>
            {props.children?.map((c) => ({
                tag: c.tag,
                children: c.children,
                props: { ...c.props, graphics: ref.current },
            }))}
        </Graphics>
    );
};
