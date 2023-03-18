import { globalState } from "./utils";

export const useGlobal = <T>(key: string) => {
    return globalState.current?.globalVariables[key] as T;
};
