import { observable } from "mobx";
import { Dialog } from "../types/Dialog";

export class DialogState {
    private state = observable.box("start");
    public selectedOptionIndex = observable.box(0);
    private dialog?: Dialog;

    constructor() {}

    stop() {
        this.dialog = undefined;
        this.state.set("")
    }

    chooseOption(idx: number) {
        if (!this.dialog) {
            console.error("not conversing");
            return;
        }
        const currentMessage = this.dialog[this.state.get()];
        if ("options" in currentMessage) {
            const option = currentMessage.options[idx];
            console.log("you choose: " + option.message);
            this.state.set(option.next);
            this.resumeConversation();
        }
    }
    startDialog(dialog: Dialog) {
        this.dialog = dialog;
        this.state.set("start");
    }

    continueConversation() {
        if (!this.dialog) {
            console.error("not conversing");
            return;
        }
        const currentMessage = this.dialog[this.state.get()];

        if ("end" in currentMessage) {
            this.stop();
            return;
        }
        if ("next" in currentMessage) {
            this.state.set(currentMessage.next);
        }
    }

    resumeConversation() {
        if (!this.dialog) {
            console.error("not conversing");
            return;
        }
        const currentMessage = this.dialog[this.state.get()];
        if (!currentMessage) {
            console.error("cannot find state " + this.state);
            this.stop();
            return;
        }
        if ("message" in currentMessage) {
            console.log(currentMessage.actor + ":" + currentMessage.message);
        }
        if ("options" in currentMessage) {
            this.selectedOptionIndex.set(0);
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
            const state: MessageState = {
                selectedIndex: this.selectedOptionIndex.get(),
                text: currentMessage.message,
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
    public get conversing() {
        return !!this.dialog;
    }
}

export interface MessageState {
    text: string;
    selectedIndex: number;
    options?: { text: string; selected: boolean }[];
}
