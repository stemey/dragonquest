export const createModelProxy = <I,T extends object>(
    t: T,
    mapping: { text: string; selected: string }
): I => {
    return new Proxy(t, {
        get(target, name) {
            if (name in mapping) {
                const field: any = (mapping as any)[name];
                if (field) {
                    return (t as any)[field];
                }
            }
            return (t as any)[name];
        },
    }) as any;
};