import { observable } from "mobx";
import { DragonQuest } from "../hub/DragonQuest";
import { evaluateExpression } from "../hub/evaluateExpression";
import { Dialog, Message } from "../types/Dialog";
import { executeAction } from "./executeAction";

export class DialogState {
    private state = observable.box("start");
    public selectedOptionIndex = observable.box(0);
    private dialog?: Dialog;
    private dialogId?: string;
    private deltaX: { [actor: string]: number } = {};

    constructor() {}

    stop() {
        if (this.dialogId)
            DragonQuest.instance.gameState.finishedDialog(this.dialogId);
        this.dialog = undefined;
        this.dialogId = undefined;
        this.selectedOptionIndex.set(0);
        this.state.set("");
    }

    chooseOption(idx: number) {
        if (!this.dialog) {
            console.error("not conversing");
            return;
        }
        const currentMessage = this.dialog[this.state.get()];
        if ("options" in currentMessage) {
            const option = currentMessage.options[idx];
            if (option.action) {
                executeAction(option.action);
            }
            this.state.set(option.next);
        }
        this.executeCurrentMessage();
    }

    startDialog(dialog: Dialog, dialogId?: string) {
        this.dialogId = dialogId;
        this.dialog = dialog;
        this.initializeDeltaX(dialog);
        this.state.set("start");
    }

    continueConversation(message?: Message) {
        if (!this.dialog) {
            console.error("not conversing");
            return;
        }
        const currentMessage = message || this.dialog[this.state.get()];

        if ("next" in currentMessage) {
            this.state.set(currentMessage.next);
        }
        this.executeCurrentMessage();
    }

    executeCurrentMessage() {
        if (!this.dialog) {
            console.error("not conversing");
            return;
        }
        const currentMessage = this.dialog[this.state.get()];
        if ("action" in currentMessage && currentMessage.action) {
            executeAction(currentMessage.action);
        }

        const nextMessage = this.dialog[this.state.get()];
        if ("end" in nextMessage) {
            this.stop();
            return;
        }
        if ("test" in nextMessage) {
            const result = evaluateExpression(nextMessage.test);
            if (result) {
                this.state.set(nextMessage.success);
            } else {
                this.state.set(nextMessage.failure);
            }
            this.executeCurrentMessage();
        }
    }

    onArrowUp() {
        if (this.dialog) {
            const currentMessage = this.dialog[this.state.get()];
            if ("options" in currentMessage) {
                this.selectedOptionIndex.set(
                    (this.selectedOptionIndex.get() + 1) %
                        currentMessage.options.length
                );
            }
        }
    }
    onArrowDown() {
        if (this.dialog) {
            const currentMessage = this.dialog[this.state.get()];
            if ("options" in currentMessage) {
                if (this.selectedOptionIndex.get() <= 0) {
                    this.selectedOptionIndex.set(
                        currentMessage.options.length - 1
                    );
                } else {
                    this.selectedOptionIndex.set(
                        this.selectedOptionIndex.get() - 1
                    );
                }
            }
        }
    }
    onSpace() {
        if (this.dialog) {
            const currentMessage = this.dialog[this.state.get()];
            if ("options" in currentMessage) {
                this.chooseOption(this.selectedOptionIndex.get());
            } else {
                this.continueConversation();
            }
        }
    }

    public getState() {
        if (this.dialog) {
            const currentMessage = this.dialog[this.state.get()];
            if ("end" in currentMessage) {
                return undefined;
            }
            if ("test" in currentMessage) {
                return undefined;
            }
            const deltaX = this.getDeltaX(currentMessage.actor);
            const state: MessageState = {
                selectedIndex: this.selectedOptionIndex.get(),
                text: currentMessage.message,
                actor: currentMessage.actor,
                deltaX,
            };
            if ("options" in currentMessage) {
                state.options = currentMessage.options.map((o, idx) => ({
                    text: o.message,
                    selected: idx === this.selectedOptionIndex.get(),
                }));
            }
            return state;
        }
        return undefined;
    }
    getDeltaX(actor: string | undefined) {
        if (!actor) {
            return 0;
        }
        let deltaX = this.deltaX[actor];
        if (!deltaX) {
            deltaX = Object.keys(this.deltaX).length * 10 - 10;
            this.deltaX[actor] = deltaX;
        }
        return deltaX;
    }
    public get conversing() {
        return !!this.dialog;
    }
    initializeDeltaX(dialog: Dialog) {
        this.deltaX = {};
        const actors = new Set<string>();
        let noActorPresent = false;
        Object.values(dialog).forEach((m) => {
            if ("end" in m) {
                return;
            }
            const theActor = m.actor || "";
            if (!theActor) {
                noActorPresent = true;
                this.deltaX[theActor] = 0;
            } else {
                actors.add(theActor);
            }
        });

        let x = -((actors.size - 1) / 2);
        Array.from(actors).forEach((actor, index) => {
            if (noActorPresent && x == 0) {
                x += 1;
            }
            this.deltaX[actor] = x;
            x += 1;
        });
    }
}

export interface MessageState {
    text: string;
    actor?: string;
    deltaX: number;
    selectedIndex: number;
    options?: { text: string; selected: boolean }[];
}
