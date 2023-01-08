import { ReversibleData } from "../gameplay/SceneTransitions";

export interface SceneWithReversibleTransitions<T = {}, R = {}> {
    create(t: ReversibleData<T, R>): void;
}
