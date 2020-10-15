import {Base} from './base';
import {ContentType} from './content-type';

export class Content extends Base {
    order: number;
    type: ContentType;
    value: string;
    title: string;
    source: string;
    description: string;
}
