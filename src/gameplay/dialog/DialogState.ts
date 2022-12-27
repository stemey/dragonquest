import { Dialog, Message } from "./Dialog";

export class DialogState {
    private state = "start";
    private conversing = false;

    constructor(private readonly dialog: Dialog) {
        if (!this.dialog.start) {
            console.error("dialog has no start note");
        }
    }

    stop() {
        this.conversing = false;
    }

    chooseOption(idx: number) {
        const currentMessage = this.dialog[this.state];
        if ("options" in currentMessage) {
            const option = currentMessage.options[idx];
            console.log("you choose: " + option.message);
            this.state = option.next;
            this.resumeConversation();
        }
    }

    resume() {
        (window as any).gameDialog = this;
        if (!this.conversing) {
            this.conversing = true;
            this.resumeConversation();
        }
    }

    resumeConversation() {
        const currentMessage = this.dialog[this.state];
        if (!currentMessage) {
            console.error("cannot find state " + this.state);
            return;
        }
        if ("message" in currentMessage) {
            console.log(currentMessage.actor + ":" + currentMessage.message);
            this.state = currentMessage.next;

            if (this.conversing) {
                this.resumeConversation();
            }
            if (currentMessage.end) {
                console.log("end conversation");
                this.conversing = false;
            }
        }

        if ("options" in currentMessage) {
            console.log("choose one of: ");
            currentMessage.options.forEach((opt, idx) => {
                console.log(idx + " : " + opt.message);
            });
        }
    }
}
