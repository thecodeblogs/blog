import {Component, Input, OnInit} from '@angular/core';
import {Entry} from '@thecodeblogs/blog/core/data/entry';
import {ContentType} from '@thecodeblogs/blog/core/data/content-type';
import {Router} from '@angular/router';

@Component({
    selector: 'app-entry-summary',
    templateUrl: './entry-summary.component.html',
    styleUrls: ['./entry-summary.component.scss']
})
export class EntrySummaryComponent implements OnInit {

    ContentType = ContentType;

    @Input() entry: Entry;


    constructor(
        private router: Router,
    ) {
    }

    ngOnInit(): void {
    }

    routeTo(entry) {
        this.router.navigate(['/', 'blog', entry.slug]).then(() => {

        });
    }
}
