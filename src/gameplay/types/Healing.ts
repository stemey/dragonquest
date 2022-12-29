import { BasePower } from "./Power";

export interface Healing extends BasePower {
    type: "healing";
    healing:number;
}
