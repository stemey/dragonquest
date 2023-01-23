import { globalState } from "./utils";

export const useEffect = (cb: () => (() => void) | void, dependencies?:any[]) => {
    const state = globalState.current?.currentElementState;
    if (!state) {
        throw new Error("no state for element");
    }
    state.useEffect(cb, dependencies)
    
    
};
