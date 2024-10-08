import EventEmitter from 'typed-ts-events';
import { WindowProtocol } from '../../src/protocols/WindowProtocol';

class Emitter<T extends Record<string, any>> extends EventEmitter<T> {

    public trigger<K extends keyof T>(eventName: K, params: T[K]): this {
        super.trigger(eventName, params);
        return this;
    }

}


class Win {

    public events: Emitter<{ 'onPostMessageRun': any }> = new Emitter();
    private _handlers: Record<string, Array<Function>> = Object.create(null);


    public postMessage(data: any, origin: string): void {
        this.events.trigger('onPostMessageRun', { data, origin });
    }

    public removeEventListener(event: string, handler: any): void {
        if (!this._handlers[event]) {
            return void 0;
        }
        this._handlers[event] = this._handlers[event].filter(cb => cb !== handler);
    }

    public addEventListener(event: string, handler: Function): void {
        if (!this._handlers[event]) {
            this._handlers[event] = [];
        }
        this._handlers[event].push(handler);
    }

    public runEventListeners(event: string, eventData: any): void {
        if (!this._handlers[event]) {
            return void 0;
        }

        this._handlers[event].forEach(cb => cb(eventData));
    }

}

export function mockWindow<T>(): IMockWindow<T> {
    return new Win() as any;
}

export interface IMockWindow<T> extends WindowProtocol.IWindow {
    events: Emitter<{ 'onPostMessageRun': T }>;
    runEventListeners(event: string, eventData: any): void;
}

export interface IPostMessageEvent<T> {
    data: T;
    origin: string;
}
