import { Element } from "@dragonquest/jsx/src/Element";
import { Grid, GridItem } from "../../../jsx/Grid";
import { BattleModel } from "../model/BattleModel";
import { Unit } from "./Unit";

export const Gui = (props: { battleModel: BattleModel }): Element<any> => {
    const { battleModel } = props;
    const heroes = battleModel.heroes.map((u, idx) => {
        const area = `hero_${idx + 1}`;
        return (
            <GridItem area={area}>
                <Unit unit={u}></Unit>
            </GridItem>
        );
    });
    const enemies = battleModel.enemies.map((u, idx) => {
        const area = `enemy_${idx + 1}`;

        return (
            <GridItem area={area}>
                <Unit unit={u}></Unit>
            </GridItem>
        );
    });
    const areas = `
    hero_3 hero_1 nomansland enemy_1 enemy_3
    hero_4 hero_2 nomansland enemy_2 enemy_4
    `;
    return (
        <Grid areas={areas} columns="150 150 20 150 150" rows="200 200">
            {heroes.concat(enemies)}
        </Grid>
    );
};
