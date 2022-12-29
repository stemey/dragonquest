export const removeSchemaFromJson = <T>(json: { [key: string]: any }) => {
    return Object.keys(json)
        .filter((key) => key !== "$schema")
        .reduce((agg, key) => {
            agg[key] = json[key];
            return agg;
        }, {} as any);
};
