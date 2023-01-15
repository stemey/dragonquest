
export const useState =<T>(t:T):[T,(t:T)=>void]=> {
    return getCurrentTree().useState(t);
}