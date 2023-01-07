import { Entry } from "../../../generated/tiled-types/Entry";
import { Action } from "./Action";

export const EntryAction: Action<Entry> = (layerObject, world) => {
    world.addEntry(layerObject);
};
