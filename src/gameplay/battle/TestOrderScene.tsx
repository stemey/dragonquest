import * as Phaser from "phaser";
import { phaserJsxHelper } from "../../jsx/phaserJsxHelper";
import { Grid, GridItem } from "../../jsx/Grid";
import { Text } from "../../jsx/Text";
import { render, useEffect, useState } from "@dragonquest/jsx/jsx-runtime";
import { Container } from "../../jsx/Container";
import { Div } from "../../jsx/div/Div";
import { HorizontalListV2 } from "../../jsx/HorizontalListV2";

export const SCENE_KEY = "TestOrderScene";

export class TestOrderScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEY });
    }

    ui?: Phaser.GameObjects.GameObject;

    create() {
        let order = true;

        this.ui = render(this, <Test />, phaserJsxHelper);
        (window as any).ui = this.ui;
        if (this.ui) {
            this.add.existing(this.ui);
        }
    }
}

const Test = (props: {}) => {
    const [order, setOrder] = useState(false);
    useEffect(() => {
        (window as any).switchOrder = () => {
            setOrder(!order);
        };
        (window as any).rerender = () => {
            setOrder(order);
        };
    }, [order, setOrder]);

    const children = ["one", "two"]
        .sort((x, y) => (order ? x.localeCompare(y) : y.localeCompare(x)))
        .map((x) => (
            <GridItem area={x} key={x}>
                <Text
                    text={`Hello ${x}`}
                    style={{ color: "red" }}
                    onPointerDown={() => console.log(x)}
                />
            </GridItem>
        ));

    const children2 = ["one", "two"]
        .sort((x, y) => (order ? x.localeCompare(y) : y.localeCompare(x)))
        .map((text) => {
            return (
                <Div
                    name={text}
                  
                    width={100}
                    height={100}
                    fillColor={0x003300}
                >
                    <Text
                        text={`Hello ${text}`}
                        style={{ color: "red" }}
                        onPointerDown={() => console.log(text)}
                    />
                </Div>
            );
        });

    /*return (
        <Grid
            width={400}
            height={300}
            areas="one two"
            columns="50% 50%"
            rows="100%"
        >
            {children2}
        </Grid>
    );*/
    return (
        <HorizontalListV2>
            {children2}
        </HorizontalListV2>
    );
};
