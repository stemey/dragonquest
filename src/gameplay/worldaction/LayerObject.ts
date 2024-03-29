export interface LayerProperties {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    properties: Property[];
}
export interface Property {
    name: string;
    value: number | string | boolean;
}

export function getProp(key: string, properties: Property[]) {
    if (!properties) {
        return null;
    }
    const props = properties.filter((prop) => prop.name === key);
    if (props.length > 0) {
        const prop = props[0];

        return prop.value;
    }
    return null;
}

export class LayerObject<T> {
    public props: T;
    constructor(private readonly obj: LayerProperties) {
        if (obj.properties) {
            this.props = obj.properties.reduce((value, prop) => {
                value[prop.name] = prop.value;
                return value;
            }, {} as any);
        } else {
            // to not have to relax the props to optional
            this.props = {} as T;
        }
    }

    getProp(key: string) {
        if (!this.obj.properties) {
            return null;
        }
        const props = this.obj.properties.filter((prop) => prop.name === key);
        if (props.length > 0) {
            const prop = props[0];

            return prop.value;
        }
        return null;
    }

    getKeys() {
        return this.obj.properties.map((prop) => prop.name);
    }

    getListProp(key: string) {
        const prop = this.getProp(key);
        if (prop !== null && typeof prop === "string") {
            return prop.split(",").map((el) => el.trim());
        }
        return null;
    }

    toItemJson() {
        const item: { [key: string]: any } = { name: this.obj.name };
        this.getKeys().forEach((key) => {
            item[key] = this.getProp(key);
        });
        return item;
    }

    get x() {
        return this.obj.x;
    }

    get name() {
        return this.obj.name;
    }

    get y() {
        return this.obj.y;
    }

    get width() {
        return this.obj.width;
    }

    get height() {
        return this.obj.height;
    }
}
