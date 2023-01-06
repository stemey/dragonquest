import { LevelState } from "../GameState";
import { DialogAction } from "./DialogAction";
import { PlayerState } from "./PlayerState";

export interface BaseMessage {
    /**
     * The actor is a string displayed on top of the message
     *
     */
    actor?: string;
}

export interface SimpleMessage extends BaseMessage {
    /**
     * The message text
     *
     */
    message: string;
    /**
     * The next message
     *
     */
    next: string;
    /**
     * actions that will be executed when this message is displayed
     *
     */
    action?: DialogAction;
}
export interface End extends BaseMessage {
    /**
     * marks the end of the dialog
     *
     */
    end: true;
}
/**
 * A junction in a dialog without message
 */
export interface Test extends BaseMessage {
    /**
     * The expression that defines the outcome: success or failure
     */
    test: Expression;
    /**
     * next message if expression is  true
     */
    success: string;
    /**
     * next message if expression is false
     */
    failure: string;
}
export interface Question extends BaseMessage {
    /**
     * message text
     */
    message: string;
    /**
     * the user msut choose one of the options
     */
    options: SimpleMessage[];
}
export type Message = Question | SimpleMessage | End | Test;

export interface Dialog {
    [key: string]: Message;
}

export interface Expression {
    /**
     * true if all of the specfied items are in the inventory
     */
    requiredItems?: string[];
    /**
     * true if all of the specfied state properties are correct
     */
    levelState?: Partial<LevelState>;
    /**
     * true if all of the specfied state properties are correct
     */
    playerState?: Partial<PlayerState>;
}
