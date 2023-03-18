export interface InteractiveSelectable {
    listen(cb: () => void): unknown;
    selected:boolean;
    disabled:boolean;
    confirm():void
    unconfirm():void;
    previous():void
    next():void
}