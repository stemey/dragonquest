import { LevelState } from "./GameState";

export function matchesLevelState(
    level: LevelState,
    trigger: Partial<LevelState>
) {
    let matches = true;
    const flags = trigger.flags;
    if (flags) {
        matches =
            matches &&
            Object.keys(flags).every(
                (key) => key in level.flags && flags[key] === level.flags[key]
            );
    }
    const monsters = trigger.monsters;
    if (monsters) {
        matches =
            matches &&
            Object.keys(monsters).every(
                (key) =>
                    key in level.monsters &&
                    monsters[key]?.dead === level.monsters[key]?.dead
            );
    }
    const dialogs = trigger.dialogs;
    if (dialogs) {
        matches =
            matches &&
            Object.keys(dialogs).every(
                (key) =>
                    key in level.dialogs &&
                    dialogs[key]?.finished === level.dialogs[key]?.finished
            );
    }
    return matches;
}
