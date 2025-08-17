export type Factory<T> = (deps: any) => Promise<T>;

export class ServiceRegistry<T> {
    private factories: Map<string, Factory<T>> = new Map();

    constructor(private serviceName: string = "Service") {}

    registerService(key: string, factory: Factory<T>): void {
        if (this.factories.has(key)) {
            throw new Error(`${this.serviceName} ${key} already registered`);
        }
        this.factories.set(key, factory);
    }

    async createService(key: string, deps: any = {}): Promise<T> {
        const factory = this.factories.get(key);
        if (!factory) {
            const list = this.serviceList().join(", ");
            throw new Error(`${this.serviceName} ${key} is not found. Registered services: ${list}`);
        }
        return factory(deps);
    }

    serviceList(): string[] {
        return Array.from(this.factories.keys());
    }
}