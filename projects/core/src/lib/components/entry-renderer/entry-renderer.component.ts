import {AfterViewChecked, Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {orderBy} from 'lodash';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';

import {Entry} from '../../data/entry';
import {ContentType} from '../../data/content-type';
import {Identity} from '../../data/identity';

import {IdentityService} from '../../services/identity.service';
import {EntryService} from '../../services/entry.service';
import {CommentService} from '../../services/comment.service';
import {PrismService} from '../../services/prism.service';


import {EntryCreatorComponent} from '../../components/entry-creator/entry-creator.component';

@Component({
    selector: 'app-entry-renderer',
    templateUrl: './entry-renderer.component.html',
    styleUrls: ['./entry-renderer.component.scss']
})
export class EntryRendererComponent implements OnInit, AfterViewChecked {

    me: Identity;
    @Input() entry: Entry;

    ContentType = ContentType;
    comments = [];
    commentText = '';

    alert = alert;

    @Input() editMode = false;

    constructor(
        private prismService: PrismService,
        private ngZone: NgZone,
        private identityService: IdentityService,
        private commentService: CommentService,
        private router: Router,
        private entryService: EntryService,
    ) {
    }


    ngOnInit() {
        this.identityService.getMe().subscribe((me) => {
            this.me = me;
        });
        this.commentService.getComments(this.entry.id).subscribe((response) => {
            this.comments = (response as any).results;
            for (const comment of this.comments) {
                comment.date_obj = new Date(comment.created_on);
            }
        });
    }

    ngAfterViewChecked(): void {
        if (!this.editMode) {
            this.ngZone.runOutsideAngular(() => {
                try {
                    this.prismService.highlightAll();
                } catch (e) {

                }
            });
        }
    }
    edit(entry: Entry) {
        entry.version++;
        entry.published = false;
        delete entry.publish_date;

        this.entryService.create(entry).subscribe((response) => {
            localStorage.setItem(EntryCreatorComponent.CURRENT_ENTRY, JSON.stringify(response));
            this.router.navigateByUrl('create(left-col:create//right-col:create)').then(() => {

            });
        });
    }
    postComment(e) {
        e.preventDefault();
        if (this.commentText !== '') {
            this.commentService.postComment({entry: this.entry.id, content: this.commentText}).subscribe((comment) => {
                this.comments.push(comment);
            });
            this.commentText = '';
        }
    }
}
