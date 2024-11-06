export class BusError extends Error {
    public stack: string;

    constructor(message: string, stack: string) {
        super(message);
        this.stack = stack;

        Object.setPrototypeOf(this, BusError.prototype);
    }

    public serialize(): BusError.SerializedError {
        return {
            message: this.message,
            stack: this.stack
        };
    }

    public static from(error: unknown): BusError {
        if (error instanceof BusError) {
            return error;
        } else if (error instanceof Error) {
            return new BusError(error.message, error.stack ?? '');
        } else if (BusError._isSerializedError(error)) {
            return new BusError(error.message, error.stack);
        } else {
            return new BusError(String(error), '');
        }
    }

    private static _isSerializedError(error: unknown): error is BusError.SerializedError {
        if (typeof error !== 'object' || !error) {
            return false;
        }
        if (!('message' in error) || typeof error['message'] !== 'string') {
            return false;
        }
        if (!('stack' in error) || typeof error['stack'] !== 'string') {
            return false;
        }
        return true;
    }
}

export namespace BusError {
    export type SerializedError = {
        message: string;
        stack: string;
    }
}
