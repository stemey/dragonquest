import { globalState } from "./utils";

export interface Ref<T> {
    current: T | undefined;
}

export const useRef = <T>(t?: T): Ref<T> => {
    if (!globalState.current) {
        throw new Error("no global state");
    }
    return globalState.current.useRef(t);
};
