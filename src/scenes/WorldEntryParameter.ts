export type WorldEntryParameter= BattleEntry | GatewayEntry;

export interface BattleEntry {
    type:"battle",
    win:boolean
}
export interface GatewayEntry {
    type:"gateway",
    entry:string
}