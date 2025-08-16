export type Consumer<T> = (item: T) => void;

export interface StorageProvider<T> {
    save(data: unknown): void;
    load(consumer: Consumer<T>): void;
}