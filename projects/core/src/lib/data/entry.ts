import {Section} from './section';
import {Base} from './base';
import {orderBy} from 'lodash';
const slugify = require('slugify');

export class Entry extends Base {
    __server_generated_properties: any;

    title: string;
    slug: string;
    create_date: Date;
    edit_date: Date;
    sections: Section[];
    version: number;
    published: boolean;
    publish_date: Date;
    tags: string[];
    views: number;

    should_publish_in_future = false;
    future_publish_date: Date;

    _friendly_views: string;

    constructor(init?: Partial<Entry>) {
        super();
        Object.assign(this, init);
        if (!this.create_date) {
            this.create_date = new Date();
        } else {
            this.create_date = new Date(this.create_date);
        }
        if (!this.edit_date) {
            this.edit_date = new Date();
        } else {
            this.edit_date = new Date(this.edit_date);
        }
        if (this.publish_date) {
            this.publish_date = new Date(this.publish_date);
        }
        if (this.future_publish_date) {
            this.future_publish_date = new Date(this.future_publish_date);
        }
        if (!this.version) {
            this.version = 1;
        }
        if (!this.tags) {
            this.tags = [];
        }
        if (this.views) {
            if (this.views < 10) {
                this._friendly_views = 'Less than ten';
            }
            else if (10 < this.views && this.views < 100) {
                this._friendly_views = 'Around one hundred';
            }
            else {
                this._friendly_views = this.views.toString();
            }
        }
        if (!this.sections) {
            this.sections = [];
        }
        // For entries that existed before this variable was introduced, the server will return undefined. If this
        // stays undefined, it will violate the null constraints on the DB, so this code checks for both null
        // and undefined and then populates the value accordingly
        if (typeof(this.should_publish_in_future) === 'undefined' || this.should_publish_in_future === null) {
            this.should_publish_in_future = false;
        }
    }


    sort() {
        this.sections = orderBy(this.sections, ({order}) => Number(order), ['asc']);
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i].order = i * 10;
        }
        for (const section of this.sections) {
            section.contents = orderBy(section.contents, ({order}) => Number(order), ['asc']);
            for (let i = 0; i < section.contents.length; i++) {
                section.contents[i].order = i * 10;
            }
        }
    }

    showEditInformation() {
        // @ts-ignore
        const difference = Math.floor((this.create_date - this.edit_date) / (1000 * 60 * 60 * 24));
        return (difference > 1 || difference < -1);
    }

    getProp(prop: string) {
        if (this.__server_generated_properties) {
            return this.__server_generated_properties[prop];
        } else {
            return '';
        }
    }
}
