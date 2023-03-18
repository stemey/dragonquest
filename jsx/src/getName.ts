export const getName = (container: any) => {
    const paths: string[] = [];
    do {
        paths.push(container.name || "none");
        container=container.parentContainer;
    } while (container);
    return paths.join("/");
};