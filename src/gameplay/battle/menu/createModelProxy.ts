import { Potion } from "../model/Potion";

export const createModelProxy = <I, T extends object>(
    t: T,
    mapping: Record<keyof I, keyof T | ((t: T) => any)>
): I => {
    return new Proxy(t, {
        get(target, name) {
            if (name in mapping) {
                const field: any = (mapping as any)[name];
                if (typeof field == "string") {
                    return (t as any)[field];
                } else if (typeof field == "function") {
                    return field(t);
                }
            }
            return (t as any)[name];
        },
    }) as any;
};
