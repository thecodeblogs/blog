import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Entry} from '../../data/entry';
import {ContentType} from '../../data/content-type';

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
