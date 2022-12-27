import { Dialog } from "./Dialog";

export const StrangerDialog: Dialog = {
    start: {
        actor: "player",
        message: "hi",
        next: "hi",
    },
    hi: {
        message: "How are you?",
        next: "question",
    },
    question: {
        options: [
            {
                message: "Where is the secret gem?",
                next: "secretGem",
            },
            {
                message: "Bye",
                next: "end",
            },
        ],
    },
    secretGem: { message: "It is in the northern woods", next: "askAgain" },
    askAgain: {
        options: [
            {
                message: "Can you explain it to me again?",
                next: "secretGem",
            },
            {
                message: "Bye",
                next: "end",
            },
        ],
    },
    end: { message: "bye", end: true, next: "askAgain" },
};
