interface StorePoint {
    date: number;
    inventory: any;
    game: any;
    player: any;
    name: string;
    id?: number;
}

interface StorePointRef {
    name: string;
    id: number;
}

export class Store {
    private _db: Promise<IDBDatabase>;

    constructor() {
        if (typeof window.indexedDB === "undefined") {
            this._db = {} as any;
            return;
        }
        this._db = new Promise((resolve, reject) => {
            const dbOpenRequest = window.indexedDB.open("dragonquest", 1);
            // Register two event handlers to act on the database being opened successfully, or not
            dbOpenRequest.onerror = (event) => {
                reject("cannot open db");
            };

            dbOpenRequest.onsuccess = (event) => {
                resolve(dbOpenRequest.result);
            };

            dbOpenRequest.onupgradeneeded = (event) => {
                // Save the IDBDatabase interface
                const db = dbOpenRequest.result;

                // Create an objectStore for this database
                db.createObjectStore("savepoints", {
                    keyPath: "id",
                    autoIncrement: true,
                });
            };
        });
    }

    async getDb() {
        return this._db;
    }

    public async store(storePoint: StorePoint, id?: number): Promise<number> {
        const db = await this.getDb();
        const objectStore = db
            .transaction("savepoints", "readwrite")
            .objectStore("savepoints");

        const putRequest = objectStore.put(storePoint, id);
        return new Promise((resolve, reject) => {
            putRequest.onerror = (event) => {
                reject("cannot open db");
            };

            putRequest.onsuccess = (event) => {
                resolve(putRequest.result as number);
            };
        });
    }

    public async load(id: number): Promise<StorePoint> {
        const db = await this.getDb();
        const objectStore = db
            .transaction("savepoints")
            .objectStore("savepoints");

        const request = objectStore.get(id);
        return new Promise((resolve, reject) => {
            request.onerror = (event) => {
                reject("cannot open db");
            };

            request.onsuccess = (event) => {
                const save = request.result as StorePoint;

                resolve(save);
            };
        });
    }

    public async list(): Promise<StorePointRef[]> {
        const storePoints: StorePointRef[] = [];
        const db = await this.getDb();
        const objectStore = db
            .transaction("savepoints")
            .objectStore("savepoints");
        const cursorRequest = objectStore.openCursor();
        return new Promise((resolve, reject) => {
            cursorRequest.onsuccess = (event) => {
                const cursor = cursorRequest.result;

                if (!cursor || cursor == null) {
                    resolve(storePoints);
                } else {
                    const element = cursor.value as StorePoint;
                    if (element.id) {
                        storePoints.push({
                            id: element.id,
                            name: element.name,
                        });
                    }
                    cursor.continue();
                }
            };
        });
    }
}
