export interface BaseMessage {
    actor?: string;
}

export interface SimpleMessage extends BaseMessage {
    message: string;
    next: string;
    end?: boolean;
}
export interface Question extends BaseMessage {
    options: SimpleMessage[];
}
export type Message = Question | SimpleMessage;

export interface Dialog {
    [key: string]: Message;
}
