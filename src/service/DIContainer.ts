import {Closeable, isCloseable, isInitializable} from "./ServiceLifecycle.ts";

type FactoryMethod<T> = (c: DIContainer) => Promise<T>;
type FactoryType = "singleton" | "transient";

interface ServiceRegistration<T> {
    type: FactoryType;
    factory: FactoryMethod<T>;
    instance?: T;
}

export class DIContainer {
    services: Map<string, ServiceRegistration<unknown>> = new Map();
    closable: Closeable[] = [];

    register<T>(key: string, factoryMethod: FactoryMethod<T>, type: FactoryType = "singleton"): void {
        if (this.services.has(type)) {
            throw new Error(`Service of type ${type} already registered`);
        }
        const registration: ServiceRegistration<T> = {
            type,
            factory: factoryMethod,
        };
        this.services.set(key, registration);
    }

    async resolve<T>(key: string): Promise<T> {
        const registration = this.services.get(key);
        if (!registration) {
            throw new Error(`Service of type ${key} not registered`);
        }
        let instance;
        if (registration.instance) {
            instance = registration.instance;
        }
        else {
            instance = registration.factory(this);
            if (isInitializable(instance)) {
                await instance.init();
            }
            if (isCloseable(instance)) {
                this.closable.push(instance);
            }
            if (registration.type === "singleton") {
                registration.instance = instance;
            }
        }
        return instance as T;
    }

    async close(): Promise<void> {
        for (const c of this.closable.reverse()) {
            await c.close();
        }
    }
}