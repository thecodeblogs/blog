import {Component, Input, OnInit} from '@angular/core';

import {Entry} from '../../data/entry';
import {EntryService} from '../../services/entry.service';

@Component({
    selector: 'app-outline-view',
    templateUrl: './outline-view.component.html',
    styleUrls: ['./outline-view.component.scss']
})
export class OutlineViewComponent implements OnInit {

    entry: Entry = new Entry();
    Math = Math;

    constructor(
        private entryService: EntryService
    ) {
    }

    ngOnInit() {
        this.entryService.currentlyEditedEntry.subscribe((entry) => {
            this.entry = entry;
        });
    }

    sectionDrop(e) {
        const entry = this.entry;
        const diff = e.currentIndex - e.previousIndex;
        entry.sections[e.previousIndex].order = e.currentIndex * 10 + (diff > 0 ? 1 : -1);
        entry.sort();
        this.entryService.currentlyEditedEntry.next(this.entry);
    }

    contentDrop(e, section) {
        const entry = this.entry;
        const diff = e.currentIndex - e.previousIndex;
        section.contents[e.previousIndex].order = e.currentIndex * 10 + (diff > 0 ? 1 : -1);
        entry.sort();
        this.entryService.currentlyEditedEntry.next(this.entry);
    }
}
