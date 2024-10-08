import EventEmitter from 'typed-ts-events';
import { Adapter, TMessageContent, IOneArgFunction } from '../../src';

class Emitter<T extends Record<string, any>> extends EventEmitter<T> {

    public trigger<K extends keyof T>(eventName: K, params: T[K]): this {
        super.trigger(eventName, params);
        return this;
    }

}


export class MockAdapter extends Adapter {

    public events: Emitter<{ send: TMessageContent; destroy: void }> = new Emitter();
    private listeners: Array<Function> = [];


    public send(data: TMessageContent): this {
        this.events.trigger('send', data);
        return this;
    }

    public addListener(cb: IOneArgFunction<TMessageContent, void>): this {
        this.listeners.push(cb);
        return this;
    }

    public dispatchAdapterEvent(e: TMessageContent): void {
        this.listeners.forEach(cb => cb(e));
    }

    public destroy(): void {
        this.events.trigger('destroy', void 0);
    }

}
