import { Element } from "./Element";
import { GameObjectFactory } from "./gameObjectFactory";
export type Props = {
    [key: string]: any;
};
export type Tag<P extends Props> = (props: P) => Element<P> | GameObjectFactory<P, any, any>;
export declare const jsx: <P extends Props>(tag: Tag<P>, props: P) => Element<P>;
export declare const jsxs: <P extends Props>(tag: Tag<P>, props: P) => Element<P>;
