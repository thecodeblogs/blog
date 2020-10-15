import {AfterViewChecked, Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {orderBy} from 'lodash';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {PrismService} from '@thecodeblogs/blog-core/services/prism.service';
import {Entry} from '@thecodeblogs/blog-core/data/entry';
import {ContentType} from '@thecodeblogs/blog-core/data/content-type';
import {IdentityService} from '@thecodeblogs/blog-core/services/identity.service';
import {Identity} from '@thecodeblogs/blog-core/data/identity';
import {CommentService} from '@thecodeblogs/blog-core/services/comment.service';
import {EntryCreatorComponent} from '@thecodeblogs/blog-widgets/components/entry-creator/entry-creator.component';
import {EntryService} from '@thecodeblogs/blog-core/services/entry.service';

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
