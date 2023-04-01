import {
    Element,
    useEffect,
    useRef,
    useState,
} from "@dragonquest/jsx/jsx-runtime";
import { IReactionDisposer, Reaction, reaction, trace } from "mobx";

export const observer = <P>(fn: (props: P) => Element<any>) => {
    const x = function observing(props: P) {
        const [changes, setChanges] = useState(0);
        const reactionRef = useRef<Reaction>();
        const disposeRef = useRef<() => void>();

        let rendering: any;
        useEffect(() => {
            return () => {
                if (disposeRef.current) {
                    disposeRef.current();
                }
            };
        });
        if (!reactionRef.current) {
            const reaction = new Reaction("my observer", () => {
                setChanges(changes + 1);
            });

            reactionRef.current = reaction;

            disposeRef.current = () => reaction.dispose();
        }

        reactionRef.current.track(() => {
            rendering = fn(props);
        });

        return rendering;
    };
    console.log("my name", x.name);
    return x;
};
