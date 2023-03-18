import { Element } from "./Element";
import { GameObjectFactory } from "./gameObjectFactory";

export type Props = { key?: string; [key: string]: any };

export type Tag<P extends Props> = (
    props: P
) => Element<P> | GameObjectFactory<P, any, any>;

export const jsx = <P extends Props>(tag: Tag<P>, props: P, key?: string) => {
    const { children } = props;
    const newProps = { ...props, key };
    let childrenArray = !!props.children ? props.children : [];
    if (!Array.isArray(childrenArray)) {
        childrenArray = [children];
    }
    childrenArray = childrenArray.filter((c: any) => !!c);
    const flattenedChildren: Element<any>[] = [];
    childrenArray.forEach((c: any) => {
        if (Array.isArray(c)) {
            c.forEach((cc) => flattenedChildren.push(cc));
        } else {
            flattenedChildren.push(c);
        }
    });
    (newProps as any).children = flattenedChildren;
    return { children: flattenedChildren, props: newProps, tag } as Element<P>;
};

export const jsxs = jsx;
