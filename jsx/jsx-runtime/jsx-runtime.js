export const jsx = (tag, props) => {
    const { children } = props;
    const newProps = { ...props };
    let childrenArray = !!props.children ? props.children : [];
    if (!Array.isArray(childrenArray)) {
        childrenArray = [children];
    }
    childrenArray = childrenArray.filter((c) => !!c);
    const flattenedChildren = [];
    childrenArray.forEach((c) => {
        if (Array.isArray(c)) {
            c.forEach(cc => flattenedChildren.push(cc));
        }
        else {
            flattenedChildren.push(c);
        }
    });
    newProps.children = flattenedChildren;
    return { children: flattenedChildren, props: newProps, tag };
};
export const jsxs = jsx;
//# sourceMappingURL=jsx-runtime.js.map