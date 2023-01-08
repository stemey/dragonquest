import { Scene } from "phaser";
import { BattleEntry } from "../scenes/WorldEntryParameter";
import { BattleSceneParameter } from "./battle/BattleScene";

export class Transition<T extends object> {
    constructor(private targetScene: string) {}

    onWake(scene: Scene, cb: (data: T) => void, ctx?: any): void {
        scene.events.on("wake", (scene: Scene, data: T) => {
            if (ctx) {
                cb.bind(ctx)(data);
            } else {
                cb(data);
            }
        });
    }
    transition(scene: Scene, data: T): void {
        if (scene.scene.isSleeping(this.targetScene)) {
            scene.scene.wake(this.targetScene, data);
        } else {
            scene.scene.launch(this.targetScene, data);
        }
    }
}

export class ReversibleTransition<
    T extends object = {},
    R extends object = {}
> {
    constructor(private targetScenes: string[]) {}

    transition(scene: Scene, data: T, onReturn: (data: R) => void) {
        const scenes = scene.scene.manager.getScenes(true);
        scenes.forEach((s) => scene.scene.sleep(s));
        const reverse = (returnData: R) => {
            this.targetScenes.forEach((s) => scene.scene.sleep(s));
            scenes.forEach((s) => scene.scene.wake(s));
            onReturn(returnData);
        };
        this.targetScenes.forEach((s) => {
            if (scene.scene.isSleeping(s)) {
                scene.scene.wake(s, { reverse, data });
            } else {
                scene.scene.launch(s, { reverse, data } as ReversibleData<
                    T,
                    R
                >);
            }
        });
    }
    onWake(
        scene: Scene,
        cb: (data: ReversibleData<T, R>) => void,
        ctx?: any
    ): void {
        scene.events.on("wake", (scene: Scene, data: ReversibleData<T, R>) => {
            if (ctx) {
                cb.bind(ctx)(data);
            } else {
                cb(data);
            }
        });
    }
}

export interface ReversibleData<D = {}, R = {}> {
    data: D;
    reverse: (data: R) => void;
}

export const SceneTransitions = {
    battle: new ReversibleTransition<BattleSceneParameter, BattleEntry>([
        "BattleScene",
        "UIScene",
    ]),
    inventory: new ReversibleTransition(["InventoryScene"]),
};
