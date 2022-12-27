import { Action } from "./Action";

export const EntryAction: Action = (layerObject, world) => {
    world.addEntry(layerObject);
};

