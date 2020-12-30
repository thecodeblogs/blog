import {CoreEventType} from './core-event-type.enum';

export class CoreEvent<T> {
    type: CoreEventType;
    data: T;

    constructor(data: T, type: CoreEventType) {
        this.data = data;
        this.type = type;
    }
}
