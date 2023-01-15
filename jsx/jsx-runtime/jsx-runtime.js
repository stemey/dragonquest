export const jsx = (tag, props) => {
    const { children } = props;
    const newProps = { ...props };
    delete newProps.children;
    return { children: children, props: newProps, tag };
};
export const jsxs = jsx;
//# sourceMappingURL=jsx-runtime.js.map