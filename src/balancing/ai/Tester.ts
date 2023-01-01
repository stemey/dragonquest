import { Character } from "../../gameplay/types/Character";
import { Weapon } from "../../gameplay/types/Weapon";
import { chooseAttacksRandom } from "../chooseAttacksRandom";
import { fight } from "../fight";
import { Space, Vector } from "./space";


export class Tester {
    private space = new Space(
        [
            {
                min: 5,
                max: 25,
                getValue: (unit) => unit.armor,
                setValue: (unit, value: number) => (unit.armor = value),
            },
            {
                min: 5,
                max: 25,
                getValue: (unit) => unit.maxHp,
                setValue: (unit, value: number) => (unit.maxHp = value),
            },
            {
                min: 5,
                max: 25,
                getValue: (unit) => (unit.attacks[0] as Weapon).damage,
                setValue: (unit, value: number) => ((unit.attacks[0] as Weapon).damage = value),
            },
            {
                min: 5,
                max: 25,
                getValue: (unit) => (unit.attacks[0] as Weapon).strength,
                setValue: (unit, value: number) => ((unit.attacks[0] as Weapon).strength = value),
            },
        ],
        2,
        1
    );

   test(enemy: Character, hero: Character) {
        const vector = this.space.getVector(enemy);
        let count = 0;
        const queue: Vector[] = [vector];
        do {
            count++;
            const current = queue.pop();
            if (!current) {
                return undefined;
            }
            this.space.update(enemy, current);
            const result = fight([enemy], [hero], chooseAttacksRandom);
            let vector = this.space.addMeasurement(enemy, result);
            //console.log(vector.asTupleString());
            //console.log("rounds", result.rounds, result.outcome);
            if (result.outcome === "hero" && result.rounds>2 && result.totalHp/result.totalMaxHp<0.8) {
                console.log("winner",vector.asTupleString(),result.totalHp/result.totalMaxHp, this.space.vectors.length)
                return enemy;
            }
            if (this.space.vectors.length > 2000) {
                return;
            }
            const vectors = this.space.findNextVectors(vector);

            vectors.forEach((v) => {
                queue.splice(0,0,v);
            });
        } while (queue.length > 0);
        console.log(this.space.vectors.map(v => v.vector.asTupleString()).join("\n"));
    }
}
