import { globalState } from "./utils";

export const useEffect = (cb: () => (() => void) | void) => {
    const state = globalState.current?.currentElementState;
    if (!state) {
        throw new Error("no state for element");
    }
    if (!state.initialized) {
        const dispose = cb();
        if (dispose) {
            state.onDestroy(() => dispose());
        }
    }
};
