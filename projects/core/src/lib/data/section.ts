import {Content} from './content';
import {Base} from './base';

export class Section extends Base {
    subheading: string;
    order: number;
    contents: Content[];
    constructor() {
        super();
        if (!this.order) {
            this.order = -1;
        }
        this.contents = [];
    }
}
