export class GlobalState {
    _currentElementId?: string;
    currentElementState?: ElementState;
    stateMap: Map<string, ElementState> = new Map();
    useState<T>(t: T) {
        if (!this.currentElementId) {
            throw new Error("no current element");
        }
        const elementState = this.stateMap.get(this.currentElementId);
    }

    set currentElementId(id: string | undefined) {
        this._currentElementId = id;
        this.currentElementState = this.stateMap.get(
            this.currentElementId || ""
        );
        if (!this.currentElementState) {
            this.currentElementState = new ElementState();
        } else {
            this.currentElementState.reset();
        }
    }
    get currentElementId() {
        return this._currentElementId;
    }
}

export class ElementState {
    stateIdx = 0;
    states: State[] = [];
    initialized = false;
    useState<T>(t: T) {
        if (!this.initialized) {
            this.states.push({ value: t });
        }
        const state = this.states[this.stateIdx];
        this.stateIdx++;
        return [
            t,
            (t: T) => {
                state.value = t;
            },
        ];
    }
    reset() {
        this.stateIdx = 0;
    }
}

export interface State {
    value: any;
}
