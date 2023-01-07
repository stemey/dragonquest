export type WorldEntryParameter = BattleEntry | GatewayEntry | LoadEntry;

export interface BattleEntry {
    type: "battle";
    win: boolean;
}
export interface GatewayEntry {
    type: "gateway";
    entry: string;
}

export interface LoadEntry {
    type: "load";
    x: number;
    y: number;
}
