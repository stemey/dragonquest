export const wait = (cb: () => void, time: number) => {
    return new Promise<void>((resolve) => {
        cb();
        setTimeout(() => resolve(), time);
    });
};
