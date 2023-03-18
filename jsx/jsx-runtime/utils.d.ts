import { Element } from "./Element";
import { GlobalState } from "./GlobalState";
export declare const create: <S, T>(scene: S, element: Element<any>, helper: ContainerHelper<T>, currentId?: string) => T | undefined;
export declare const reconcile: <S, G extends object>(scene: S, old: Element<any> | undefined, nu: Element<any>, gameObject: G, helper: ContainerHelper<G>, currentId?: string) => G | undefined;
export declare const render: <S, G extends object>(scene: S, element: Element<any>, helper: ContainerHelper<G>) => G | undefined;
export declare const globalState: {
    current: GlobalState | undefined;
};
export declare const wrapInGlobalState: <T>(g: GlobalState, cb: () => T) => T;
export interface ContainerHelper<G> {
    remove(gameObject: G, idx: number): void;
    move(gameObject: G, oldIdx: number, newIdx: number): void;
    add(parent: G, child: G): void;
    get(parent: G, idx: number): G;
}
