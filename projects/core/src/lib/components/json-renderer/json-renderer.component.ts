import {Component, Input, OnInit} from '@angular/core';
import {Entry} from '../../data/entry';
import {EntryService} from '../../services/entry.service';

@Component({
    selector: 'app-json-renderer',
    templateUrl: './json-renderer.component.html',
    styleUrls: ['./json-renderer.component.scss']
})
export class JsonRendererComponent implements OnInit {

    JSON = JSON;
    @Input() entry: Entry = new Entry();

    constructor(
        private entryService: EntryService,
    ) {
    }

    ngOnInit() {
        this.entryService.currentlyEditedEntry.subscribe((entry) => {
            this.entry = entry;
        });
    }

}
