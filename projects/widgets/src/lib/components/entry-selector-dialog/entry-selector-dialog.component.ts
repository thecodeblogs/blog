import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EntrySelectorDialogData} from '../../components/entry-selector-dialog/entry-selector-dialog-data';
import {EntryService} from '@thecodeblogs/blog/core';

@Component({
    selector: 'app-entry-selector-dialog',
    templateUrl: './entry-selector-dialog.component.html',
    styleUrls: ['./entry-selector-dialog.component.scss']
})
export class EntrySelectorDialogComponent implements OnInit {

    static CURRENT_ENTRY = 'current_entry';

    entries;
    selectedId: string;

    constructor(
        public dialogRef: MatDialogRef<EntrySelectorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EntrySelectorDialogData,
        private entryService: EntryService,
    ) {
    }

    ngOnInit(): void {
        this.entryService.getUnpublishedEntries().subscribe((next) => {
            this.entries = (next as any).results;
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(): void {
        this.entryService.getUnpublishedById(this.selectedId).subscribe((entry) => {
            localStorage.setItem(EntrySelectorDialogComponent.CURRENT_ENTRY, JSON.stringify(entry));
            entry.sort();
            this.entryService.currentlyEditedEntry.next(entry);
            this.dialogRef.close();
        });
    }
}
