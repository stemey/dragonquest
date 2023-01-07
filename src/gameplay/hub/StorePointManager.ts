import { Store } from "../../store/Store";
import { DragonQuestType } from "./DragonQuest";

export class StorePointManager {
    private store = new Store();
    public loadedStorePoint?: number;

    constructor(private readonly hub: DragonQuestType) {}

    async loadLastStorePoint() {
        const storePoints = await this.list();
        if (storePoints.length == 0) {
            return;
        }
        await this.load(storePoints[storePoints.length - 1].id);
    }
    async list() {
        return await this.store.list();
    }
    async load(id: number) {
        this.loadedStorePoint = id;
        const storePoint = await this.store.load(id);
        const { x, y } = storePoint.player;
        this.hub.inventory.deserialize(storePoint.inventory);
        this.hub.gameState.deserialize(storePoint.game);
        this.hub.emitGameEvent("LoadGame", {
            scene: this.hub.gameState.levelKey,
            x,
            y,
        });
    }
    async autoSave() {
        this.save();
    }

    async save(name?: string) {
        const spName =
            name ||
            this.hub.gameState.levelKey +
                " " +
                new Date().toLocaleDateString() +
                " " +
                new Date().toLocaleTimeString();
        await this.store.store({
            game: this.hub.gameState.serialize(),
            inventory: this.hub.inventory.serialize(),
            player: { x: this.hub.playerState.x, y: this.hub.playerState.y },
            date: Date.now(),
            name: spName,
        });
    }

    addActionState(type: string, data: any) {
        this.hub.gameState.addActionState(type, data);
    }
    getActionStates(type: string) {
        return this.hub.gameState.getActionStates(type);
    }
}
