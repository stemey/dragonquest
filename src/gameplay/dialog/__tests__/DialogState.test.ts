import { DragonQuest, DragonQuestType } from "../../hub/DragonQuest";
import { evaluateExpression } from "../../hub/evaluateExpression";
import { DropItemRef } from "../../types/DropItemRef";
import { Dialog } from "../../types/Dialog";
import { DialogState } from "../DialogState";
import { Game } from "phaser";

jest.mock("../../hub/evaluateExpression");

const key: DropItemRef = {
    type: "key",
    name: "bronce key",
    description: "",
    image: "",
};

const gameMock = { events: { emit: jest.fn() } } as unknown as Game;

describe("DialogState", () => {
    beforeAll(() => {
        DragonQuest.instance = new DragonQuestType();
        DragonQuest.instance.init(gameMock);
        DragonQuest.instance.levelManager.enterLevel("first", {
            events: {},
            name: "",
            monsters: {},
            dialogs: {},
            loots: {},
        });
    });
    beforeEach(() => {
        DragonQuest.instance.inventory.removeAllItems();
    });

    describe("simple", () => {
        it("just one message", () => {
            const dialog: Dialog = {
                start: {
                    message: "start",
                    next: "end",
                },
                end: {
                    end: true,
                },
            };
            const state = new DialogState();
            state.startDialog(dialog);
            expect(state.getDeltaX(undefined)).toBe(0);
            expect(state.getState()?.text).toBe("start");
            expect(state.getState()?.options).toBeUndefined();
            state.continueConversation();
            expect(state.conversing).toBeFalsy();
        });
    });

    describe("with options", () => {
        const dialog: Dialog = {
            start: {
                message: "start",
                next: "question",
            },
            question: {
                message: "choose",
                options: [
                    { message: "A?", next: "A" },
                    {
                        message: "B?",
                        next: "end",
                        action: {
                            items: [key],
                        },
                    },
                ],
            },
            A: {
                message: "A",
                next: "end",
            },
            end: {
                end: true,
            },
        };
        it("sudden end", () => {
            const state = new DialogState();
            state.startDialog(dialog);
            expect(state.getDeltaX(undefined)).toBe(0);
            expect(state.getState()?.text).toBe("start");
            state.continueConversation();
            expect(state.getState()?.text).toBe("choose");
            const options = state.getState()?.options;
            if (!options || options.length !== 2) {
                fail("expected options");
            }
            expect(options).toHaveLength(2);
            expect(options[0].selected).toBeTruthy();
            state.chooseOption(1);
            expect(state.conversing).toBeFalsy();
            expect(
                DragonQuest.instance.inventory.hasItem(key.name)
            ).toBeTruthy();
        });
        it("different end", () => {
            const state = new DialogState();
            state.startDialog(dialog);
            expect(state.getDeltaX(undefined)).toBe(0);
            expect(state.getState()?.text).toBe("start");
            state.continueConversation();
            expect(state.getState()?.text).toBe("choose");
            const options = state.getState()?.options;
            if (!options || options.length !== 2) {
                fail("expected options");
            }
            expect(options).toHaveLength(2);
            expect(options[0].selected).toBeTruthy();
            state.chooseOption(0);
            expect(state.getState()?.text).toBe("A");
            state.continueConversation();
            expect(state.conversing).toBeFalsy();
            expect(
                DragonQuest.instance.inventory.hasItem(key.name)
            ).toBeFalsy();
        });
    });
    describe("with test", () => {
        const dialog: Dialog = {
            start: {
                message: "start",
                next: "question",
            },
            question: {
                test: {
                    requiredItems: ["dd"],
                },
                success: "A",
                failure: "end",
            },
            A: {
                message: "A",
                next: "end",
                action: {
                    items: [key],
                },
            },
            end: {
                end: true,
            },
        };
        it("failure", () => {
            (evaluateExpression as jest.Mock).mockReturnValue(false);
            const state = new DialogState();
            state.startDialog(dialog);
            expect(state.getDeltaX(undefined)).toBe(0);
            expect(state.getState()?.text).toBe("start");
            state.continueConversation();
            expect(state.getState()?.text).toBeUndefined();
            expect(state.conversing).toBeFalsy();
            expect(
                DragonQuest.instance.inventory.hasItem(key.name)
            ).toBeFalsy();
        });
        it("success", () => {
            (evaluateExpression as jest.Mock).mockReturnValue(true);
            const state = new DialogState();
            state.startDialog(dialog);
            expect(state.getDeltaX(undefined)).toBe(0);
            expect(state.getState()?.text).toBe("start");
            state.continueConversation();
            expect(state.getState()?.text).toBe("A");
            expect(
                DragonQuest.instance.inventory.hasItem(key.name)
            ).toBeTruthy();
        });
    });
});
