import { render, useState } from "@dragonquest/jsx/jsx-runtime";
import { Div } from "./Div";
import { Text } from "./Text";
import { Transform } from "./Transform";
import { VerticalListV2 } from "./VerticalListV2";

export const Example = () => {
    const [renderCount, setRenderCount] = useState(0);

    (window as any).render = () => {
        setRenderCount(renderCount + 1);
    };
    return (
        <VerticalListV2 x={20} y={20}>
            <Div
                width={200}
                height={30}
                margin={{ bottom: 10, top: 10, left: 10, right: 10 }}
                padding={{ bottom: 0, top: 0, left: 0, right: 0 }}
                fillColor={0xff}
            ></Div>
            <Transform mode="in">
                <Div
                    width={200}
                    margin={{ bottom: 10, top: 10, left: 10, right: 10 }}
                    padding={{ bottom: 20, top: 20, left: 40, right: 0 }}
                    fillColor={0xff00}
                >
                    <VerticalListV2>
                        <Text text="hallo" style={{}} />
                        <Text text="Good Bye" style={{}} />
                    </VerticalListV2>
                </Div>
            </Transform>

            <Div
                width={200}
                height={20}
                margin={{ bottom: 30, top: 30, left: 0, right: 70 }}
                padding={{ bottom: 0, top: 0, left: 0, right: 0 }}
                fillColor={0xff0000}
            ></Div>

            <Div
                width={200}
                height={30}
                margin={{ bottom: 0, top: 0, left: 0, right: 10 }}
                padding={{ bottom: 0, top: 0, left: 0, right: 0 }}
                fillColor={0xff00}
            ></Div>
        </VerticalListV2>
    );
};
