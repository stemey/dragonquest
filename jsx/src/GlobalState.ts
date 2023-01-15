import { UseStateReturnType } from "./useState";

export class GlobalState {
    _currentElementId: string="";
    currentElementState?: ElementState;
    stateMap: Map<string, ElementState> = new Map();
    listener?: () => void;
    useState<T>(t: T): UseStateReturnType<T> {
        if (!this.currentElementState) {
            throw new Error("no current element");
        }
        return this.currentElementState.useState(t, () =>
            this.fireStateChanges()
        );
    }

    onStateChange(cb: () => void) {
        this.listener = cb;
    }

    fireStateChanges() {
        if (this.listener) {
            this.listener();
        }
    }

    set currentElementId(id: string) {
        this._currentElementId = id;
        this.currentElementState = this.stateMap.get(
            this.currentElementId
        );
        if (!this.currentElementState) {
            this.currentElementState = new ElementState();
            this.stateMap.set(this.currentElementId, this.currentElementState);
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
    useState<T>(t: T, fireStateChange: () => void): UseStateReturnType<T> {
        if (!this.initialized) {
            this.states.push({ value: t });
        }
        const state = this.states[this.stateIdx];
        this.stateIdx++;
        return [
            state.value,
            (t: T) => {
                state.value = t;
                fireStateChange();
            },
        ];
    }
    reset() {
        this.stateIdx = 0;
        this.initialized=true;
    }
}

export interface State {
    value: any;
}
