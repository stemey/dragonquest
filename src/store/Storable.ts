export interface Storable<T> {
    serialize(): T;
    deserialize(serializedData: T): void;
}
