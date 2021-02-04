import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {StaticHtmlService} from '../../services/static-html.service';

@Component({
    selector: 'app-static-html',
    templateUrl: './static-html.component.html',
    styleUrls: ['./static-html.component.css']
})
export class StaticHtmlComponent implements OnInit, OnChanges {

    innerHtml: SafeHtml;
    @Input() value;

    constructor(
        private staticHtmlService: StaticHtmlService,
        private domSanitizer: DomSanitizer
    ) { }

    refreshContent() {
        this.innerHtml = this.domSanitizer.bypassSecurityTrustHtml(this.staticHtmlService.mapStaticHtml(this.value, false));
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.refreshContent();
    }

    ngOnInit(): void {
        this.refreshContent();
    }

}
