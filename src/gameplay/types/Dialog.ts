import { LevelState } from "../GameState";
import { DialogAction } from "./DialogAction";

export interface BaseMessage {
    actor?: string;
}

export interface SimpleMessage extends BaseMessage {
    message: string;
    next: string;
    action?: DialogAction;
}
export interface End extends BaseMessage {
    end: true;
}
export interface Test extends BaseMessage {
    test: Expression;
    success: string;
    failure: string;
}
export interface Question extends BaseMessage {
    message: string;
    options: SimpleMessage[];
}
export type Message = Question | SimpleMessage | End;

export interface Dialog {
    [key: string]: Message;
}

export interface Expression {
    requiredItems: string[];
    levelState: LevelState;
}
