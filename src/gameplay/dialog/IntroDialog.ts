import { Dialog } from "./Dialog";

export const IntroDialog: Dialog = {
    start: {
        message:
            "You were sent to your uncle to start your work as apprentice. ",
        next: "chooseClass",
    },

    chooseClass: {
        message: "Which Kind of person would you like to be?",
        options: [
            {
                message: "Wizard?",
                next: "wizard",
            },
            {
                message: "Warrior?",
                next: "warrior",
            },
        ],
    },
    wizard: { message: "You will have to fight your way", next: "end" },
    warrior: { message: "You will be on your road with ....", next: "end" },
    end: { end: true},
};
