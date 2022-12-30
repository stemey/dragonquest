import { Events } from "phaser";

export const eventsMock = {
    emit: () => {},
} as unknown as Events.EventEmitter;
