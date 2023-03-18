import { Props, Tag } from "./jsx-runtime";

export interface Element<P extends Props> {
    props: { [key: string]: any };
    tag: Tag<P>;
    children?: Element<any>[];
}
