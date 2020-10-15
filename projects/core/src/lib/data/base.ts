import {Guid} from './guid';

export class Base {
    id: string;

    constructor() {
        this.id = Guid.newGuid();
    }
}
