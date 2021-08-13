import {COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import {ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input} from '@angular/core';

import {Entry} from '../../data/entry';
import {Section} from '../../data/section';
import {Content} from '../../data/content';
import {ContentType} from '../../data/content-type';
import {Identity} from '../../data/identity';

import {EntryService} from '../../services/entry.service';
import {IdentityService} from '../../services/identity.service';

import {map as loMap, filter} from 'lodash';
import {MatDialog} from '@angular/material/dialog';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {EntrySelectorDialogComponent} from '../../components/entry-selector-dialog/entry-selector-dialog.component';
import {FileUploader} from 'ng2-file-upload';
import {MediaUploadModalComponent} from '../../components/media-upload-modal/media-upload-modal.component';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {TagService} from '../../services/tag.service';
import {SchedulePublishDialogComponent} from '../schedule-publish-dialog/schedule-publish-dialog.component';
const slugify = require('slugify');

@Component({
    selector: 'app-entry-creator',
    templateUrl: './entry-creator.component.html',
    styleUrls: ['./entry-creator.component.scss']
})
export class EntryCreatorComponent implements OnInit {

    static CURRENT_ENTRY = 'current_entry';
    static DEFAULT_NEW_ENTRY_TITLE = 'A New Entry';

    ContentType = ContentType;
    Object = Object;

    entry: Entry = new Entry();
    me: Identity;

    separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
    removable = true;
    tags: string[];
    all_tags: string[] = ['Angular', 'Bash', 'MacOS', 'Typescript', 'NPM', 'Databases'];
    filtered_tags: Observable<string[]>;
    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('tagauto') matAutocomplete: MatAutocomplete;

    tagCtrl = new FormControl();
    publishDateControl = new FormControl();

    tag_to_add: string;
    selectable = false;

    scheduling = false;
    customScheduleTime = '';
    today = new Date();
    hours: number;
    minutes: number;

    @Input() allowedMimeTypes = [
                'image/jpeg',
                'image/gif',
                'image/png',
                'image/jpg',
                'video/mp4',
                'video/webm',
                'video/ogg',
    ];

    @Input() uploadUrlKey = 'path_to_file';

    public uploader: FileUploader = new FileUploader(
        {
            url: '/file_api/uploads/create_image/',
            itemAlias: 'file',
            authToken: '',
            headers: [
                {
                    name: 'X-CSRFToken',
                    value: EntryCreatorComponent.getCookie('csrftoken')
                },
            ],
            additionalParameter: {
                'csrf_token': EntryCreatorComponent.getCookie('csrftoken')
            },
            removeAfterUpload: true,
            allowedMimeType: this.allowedMimeTypes,
        }
    );

    static getCookie(name: string) {
        const ca: Array<string> = document.cookie.split(';');
        const caLen: number = ca.length;
        const cookieName = `${name}=`;
        let c: string;

        for (let i = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) === 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return '';
    }

    constructor(
        private entryService: EntryService,
        private tagService: TagService,
        private identityService: IdentityService,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
    ) {
        const scheduledDate = new Date();
        this.customScheduleTime = scheduledDate.getHours() + ':' + scheduledDate.getMinutes() + ' AM';
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.all_tags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our tag
        if ((value || '').trim()) {
            this.tags.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.tagCtrl.setValue(null);
        this.onChange();
    }

    remove(fruit: string): void {
        const index = this.tags.indexOf(fruit);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
        this.onChange();
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.tags.push(event.option.viewValue);
        this.tagInput.nativeElement.value = '';
        this.tagCtrl.setValue(null);
        this.onChange();
    }

    refreshTags() {
        this.tagService.get().subscribe((response) => {
            this.all_tags = loMap(response.results, (t) => t.label);
            this.filtered_tags = this.tagCtrl.valueChanges.pipe(
                startWith(null),
                map((tag: string | null) => tag ? this._filter(tag) : this.all_tags.slice()));
        });
    }

    createNewEntry() {
        this.entry = new Entry();
        this.entry.title = EntryCreatorComponent.DEFAULT_NEW_ENTRY_TITLE;
        this.entry.published = false;
        this.entry.version = 1;

        this.entryService.create(this.entry).subscribe((response) => {
            this.entry = response;
            this.entry.sort();
            setTimeout(() => {
                this.entryService.currentlyEditedEntry.next(this.entry);
            }, 10);
        });
    }

    ngOnInit() {
        this.refreshTags();
        this.identityService.getMe().subscribe((me) => {
            this.me = me;
        });

        const savedEntry =
            localStorage.getItem(EntryCreatorComponent.CURRENT_ENTRY);

        if (savedEntry) {
            this.entry = new Entry(JSON.parse(savedEntry));

            if (this.entry.should_publish_in_future && this.entry.future_publish_date < new Date()) {
                this.createNewEntry();
            }

            this.entry.sort();
            if (this.entry.should_publish_in_future) {
                // Restore scheduling settings
                this.scheduling = true;
                let hours = this.entry.future_publish_date.getHours();
                let minutes: string | number = this.entry.future_publish_date.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                if (hours >= 12) {
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                }
                minutes = minutes < 10 ? '0' + minutes : minutes;
                this.customScheduleTime = hours + ':' + minutes + ' ' + ampm;
            }
            setTimeout(() => {
                this.entryService.currentlyEditedEntry.next(this.entry);
            }, 10);
        } else {
            this.createNewEntry();
        }

        this.uploader.onCompleteItem = (item, response) => {
            // const responseObj = JSON.parse(response)
            // this.uploadId = responseObj.id;
        };

        this.uploader.onWhenAddingFileFailed = (item, uploadFilter, options) => {
            // this.error = 'This file is not a supported mimetype.'
            // this.uploading = false;
        };

        this.tags = this.entry.tags;
    }

    onFileSelected(e) {
        this.uploader.uploadAll();
    }

    startUploader(content) {
        const dialogRef = this.dialog.open(MediaUploadModalComponent, {
        });
        dialogRef.componentInstance.allowedMimeTypes = this.allowedMimeTypes;
        dialogRef.componentInstance.uploadUrlKey = this.uploadUrlKey;
        dialogRef.afterClosed().subscribe(() => {
            content.value = dialogRef.componentInstance.imgLink;
            content.additional = [];
            content.additional.push({key: Content.KEY_MIMETYPE, value: dialogRef.componentInstance.mimeType});
            this.onChange();
        });
    }

    addSection() {
        this.entry.sections.push(new Section());
        this.onChange();
    }

    removeSection(section) {
        const remove = confirm('Are you sure you want to remove this section?');
        if (remove) {
            this.entry.sections =
                filter(this.entry.sections, (sct) => sct.id !== section.id);
            this.onChange();
        }
    }

    addContent(section) {
        section.contents.push(new Content());
        this.onChange();
    }

    removeContent(content) {
        const remove = confirm('Are you sure you want to remove this content?');

        if (remove) {
            for (const section of this.entry.sections) {
                section.contents = filter(
                    section.contents,
                    (ct) => ct.id !== content.id
                );
            }
            this.onChange();
        }
    }

    onChange() {
        this.entry.slug = slugify(this.entry.title).toLowerCase();
        localStorage.setItem(
            EntryCreatorComponent.CURRENT_ENTRY,
            JSON.stringify(this.entry)
        );
        this.entry.sort();
        this.cdr.detectChanges();
        this.entryService.currentlyEditedEntry.next(this.entry);
        this.entryService._currentlyEditedEntry = this.entry;
    }

    resetDate() {
        this.entry.create_date = new Date();
        this.entry.edit_date = new Date();

        this.onChange();
    }

    startNew() {
        const finish = confirm('Are you sure your finished? The JSON and entry displayed will be removed. Make sure you have already copied it.');
        if (finish) {

            this.entry = new Entry();
            this.entry.title = EntryCreatorComponent.DEFAULT_NEW_ENTRY_TITLE;
            this.entry.published = false;
            this.entry.version = 1;

            this.entryService.currentlyEditedEntry.next(this.entry);
            localStorage.setItem(
                EntryCreatorComponent.CURRENT_ENTRY,
                JSON.stringify(this.entry)
            );
            this.entryService.create(this.entry).subscribe((next) => {
            });
        }
    }

    seeEntries() {
        const dialogRef = this.dialog.open(EntrySelectorDialogComponent, {
            width: '500px',
            data: {name: 'test', animal: 'test'}
        });

        dialogRef.afterClosed().subscribe((id) => {
            if (id) {
                this.entryService.getUnpublishedById(id).subscribe((result) => {
                    const entry = result;
                    this.entryService.currentlyEditedEntry.next(entry);
                    localStorage.setItem(
                        EntryCreatorComponent.CURRENT_ENTRY,
                        JSON.stringify(entry)
                    );
                    this.entry = entry;
                });
            }
        });
    }

    postPublishCallback() {
        this.entry = new Entry();
        this.entry.title = EntryCreatorComponent.DEFAULT_NEW_ENTRY_TITLE;
        this.entry.published = false;
        this.entry.version = 1;
        this.entryService.currentlyEditedEntry.next(this.entry);
        localStorage.setItem(
            EntryCreatorComponent.CURRENT_ENTRY,
            JSON.stringify(this.entry)
        );
        this.entryService.create(this.entry).subscribe((next) => {
            this.tags = [];
            this.refreshTags();
        });
    }

    cancelScheduling() {
        this.entry.future_publish_date = null;
        this.entry.should_publish_in_future = false;
        this.scheduling = false;
        this.onChange();
    }

    exposeScheduling() {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + 1);

        this.entry.future_publish_date = scheduledDate;
        this.setTime(this.customScheduleTime);

        this.entry.should_publish_in_future = true;
        this.scheduling =  true;
        this.onChange();
    }
    publish() {
        const publish = confirm('Are you sure you want to publish? Once an article is published it is available to everyone.');
        if (publish) {
            this.entry.published = true;
            this.entry.publish_date = new Date();
            this.entry.edit_date = new Date();
            this.entryService.updateUnpublishedEntry(this.entry).subscribe(this.postPublishCallback.bind(this));
        }
    }
    delete() {
        const confirmDelete = confirm('Are you sure you want to delete this draft? Once it is deleted it cannot be recovered.');
        if (confirmDelete) {
            this.entryService.delete(this.entry).subscribe(() => {
                this.entry = null;
            });
        }
    }
    onDateChange() {
        this.entry.future_publish_date.setHours(this.hours);
        this.entry.future_publish_date.setMinutes(this.minutes);
        this.onChange();
    }


    setTime(e) {
        const firstTimeSplit = e.split(' ');
        const secondTimeSplit = firstTimeSplit[0].split(':');
        this.hours = Number(secondTimeSplit[0]);
        this.minutes = Number(secondTimeSplit[1]);

        if (firstTimeSplit[1] === 'PM') {
            this.hours = Number(this.hours) + 12;
        }

        this.entry.future_publish_date.setHours(this.hours);
        this.entry.future_publish_date.setMinutes(this.minutes);

        this.onChange();
    }
}
