import {
    Element,
    useEffect,
    useRef,
    useState,
} from "@dragonquest/jsx/jsx-runtime";
import { IReactionDisposer, reaction, trace } from "mobx";

export const observer = <P>(fn: (props: P) => Element<any>) => {
    const x =  function observing(props: P) {
        
        const [changes, setChanges] = useState(0);
        const trackingRef = useRef(false);
        const disposeRef = useRef<IReactionDisposer>();
        let rendering: any;
        if (!trackingRef.current) {
            disposeRef.current = reaction(
                () => {
                    rendering = fn(props);
                    return rendering;
                },
                () => {
                    setChanges(changes + 1);
                },
                {
                    onError: (e) => {
                        console.error(e);
                    },
                    fireImmediately: true,
                }
            );
            trackingRef.current = true;
        } else {
            rendering = fn(props);
        }

        useEffect(() => {
            return () => {
                if (disposeRef.current) {
                    disposeRef.current();
                }
            };
        });

        return rendering;
    };
    console.log("my name",x.name)
    return x;
};
