import { globalState } from "./utils";

export const useState = <T>(t: T): [T, (t: T) => void] => {
    if (!globalState.current) {
        throw new Error("no global state");
    }
    return globalState.current.useState(t);
};

export type UseStateReturnType<T> = [T, (t: T) => void];