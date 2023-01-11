export interface InteractiveSelectable {
    selected:boolean;
    disabled:boolean;
    confirm():void
    unconfirm():void;
    previous():void
    next():void
}