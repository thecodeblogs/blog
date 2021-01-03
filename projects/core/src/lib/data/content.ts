import {Base} from './base';
import {ContentType} from './content-type';

export class Content extends Base {
    static KEY_MIMETYPE = 'mimeType';

    order: number;
    type: ContentType;
    value: string;
    title: string;
    source: string;
    description: string;
    additional: Array<{key: string, value: string}>;
}
