import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SchedulePublishDialogData} from './schedule-publish-dialog-data';

@Component({
    selector: 'lib-schedule-publish-dialog',
    templateUrl: './schedule-publish-dialog.component.html',
    styleUrls: ['./schedule-publish-dialog.component.css']
})
export class SchedulePublishDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<SchedulePublishDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SchedulePublishDialogData,
    ) { }

    ngOnInit(): void {
    }

    onNoClick(): void {
    }

    onYesClick(): void {
        this.dialogRef.close('test');
    }
}
