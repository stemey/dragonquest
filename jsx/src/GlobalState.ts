import { Ref } from "./useRef";
import { UseStateReturnType } from "./useState";

export class GlobalState {
    _currentElementId: string = "";
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
    useRef<T>(t?: T): Ref<T> {
        if (!this.currentElementState) {
            throw new Error("no current element");
        }
        return this.currentElementState.useRef(t);
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
        this.currentElementState = this.stateMap.get(this.currentElementId);
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
    destroyListeners: (() => void)[] = [];
    stateIdx = 0;
    refIdx = 0;
    states: State[] = [];
    refs: Ref<any>[] = [];
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
    useRef<T>(t?: T): Ref<T> {
        if (!this.initialized) {
            this.refs.push({ current: t });
        }
        const ref = this.refs[this.refIdx];
        this.refIdx++;
        return ref;
    }
    reset() {
        this.stateIdx = 0;
        this.refIdx = 0;
    }
    onCreated() {
        this.initialized = true;
    }
    destroy() {
        this.destroyListeners.forEach((d) => d());
    }
    onDestroy(listener: () => void) {
        this.destroyListeners.push(listener);
    }
}

export interface State {
    value: any;
}
