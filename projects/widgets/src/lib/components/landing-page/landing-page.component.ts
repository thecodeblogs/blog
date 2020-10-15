import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {map} from 'lodash';
import {Entry, EntryService} from '@thecodeblogs/blog/core';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {

    JSON = JSON;

    entries;
    source;
    sourceSub;

    constructor(
        private router: Router,
        private entryService: EntryService,
    ) {

    }

    ngOnInit() {
        this.entryService.get().subscribe((response) => {
            this.entries = map((response as any).results.slice(0, 3), (result) => {
                return { id: result.id, entry: new Entry(result)};
            });
        });
    }

    ngOnDestroy(): void {
        if (this.sourceSub) {
            this.sourceSub.unsubscribe();
            this.sourceSub = null;
        }
    }

}
