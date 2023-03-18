import { Element } from "@dragonquest/jsx/src/Element";
import { Div } from "../../../jsx/div/Div";
import { Grid, GridItem } from "../../../jsx/Grid";
import { Text } from "../../../jsx/Text";
import { BattleModel } from "../model/BattleModel";
import { Unit } from "./Unit";
import { UnitShadow } from "./UnitShadow";

export const Battle = (props: { battleModel: BattleModel }): Element<any> => {
    const { battleModel } = props;
    const baseColors = {
        [battleModel.heroes[0].name.get()]: 0xf0f000,
        [battleModel.heroes[1].name.get()]: 0x0000ff,
    };
    const heroAreas: string[] = battleModel.heroes.map(
        (h) => `hero_${h.name.get()}`
    );
    const candidateTargets = battleModel.weaponSelected?.targets;
    const heroes = battleModel.heroes
        .slice()
        .sort((x1, x2) => {
            if (x1.selected) return 1;
            if (x2.selected) return -1;
            return (
                battleModel.heroes.indexOf(x1) - battleModel.heroes.indexOf(x2)
            );
        })
        .map((u) => {
            const area = `hero_${u.name.get()}`;
            const candidate =
                candidateTargets &&
                candidateTargets.some((t) => t.name === u.name.get());
            return (
                <GridItem key={area} area={area}>
                    <Unit
                        unit={u}
                        baseColor={baseColors[u.name.get()]}
                        candidate={candidate}
                    ></Unit>
                </GridItem>
            );
        });
    const enemyAreas: string[] = [];
    const enemies = battleModel.enemies.map((u, idx) => {
        const baseColors = [0xff0000, 0xf0a000, 0x00ffff];
        const area = `enemy_${u.name.get()}`;
        enemyAreas.push(area);
        const candidate =
            candidateTargets &&
            candidateTargets.some((t) => t.name === u.name.get());

        return (
            <GridItem key={area} area={area}>
                <Unit
                    unit={u}
                    baseColor={baseColors[idx]}
                    candidate={candidate}
                ></Unit>
            </GridItem>
        );
    });
    const areas = `
    ${heroAreas[2]} ${heroAreas[0]} nomansland ${enemyAreas[0]} ${enemyAreas[2]}
    ${heroAreas[3]} ${heroAreas[1]} nomansland ${enemyAreas[1]} ${enemyAreas[3]}
    . bar bar bar .
    `;

    const fightCallback = () => {
        battleModel.finishTurn();
    };

    const bar = (
        <GridItem area="bar">
            <Div
                fillColor={0x002200}
                padding={{ top: 2, bottom: 2, left: 0, right: 0 }}
            >
                <Text
                    text="Fight"
                    style={{ align: "center" }}
                    onPointerDown={fightCallback}
                ></Text>
            </Div>
        </GridItem>
    );

    const shadows = battleModel.heroes
        .map((u, idx) => (
            <GridItem key={heroAreas[idx]} area={heroAreas[idx]}>
                <UnitShadow unit={u} />
            </GridItem>
        ))
        .concat(
            battleModel.enemies.map((u, idx) => (
                <GridItem key={enemyAreas[idx]} area={enemyAreas[idx]}>
                    <UnitShadow unit={u} />
                </GridItem>
            ))
        );

    return (
        <Div fillColor={0x556655} width={800} height={400}>
            <Grid
                areas={areas}
                columns="150 150 20 150 150"
                rows="180 180 20"
                gap={{ x: 10, y: 10 }}
                name="shadowGrid"
            >
                {shadows}
            </Grid>
            <Grid
                areas={areas}
                columns="150 150 20 150 150"
                rows="180 180 40"
                gap={{ x: 10, y: 10 }}
                name="unitGrid"
            >
                {heroes.concat(enemies).concat([bar])}
            </Grid>
        </Div>
    );
};
