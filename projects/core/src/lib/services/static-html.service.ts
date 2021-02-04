import {HttpClient} from '@angular/common/http';
import { Injectable, SecurityContext } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class StaticHtmlService {
    constructor(
        private domSanitizer: DomSanitizer,
    ) { }

    mapStaticHtml(htmlString: string, isTrusted: boolean): string {
        return isTrusted ?
            htmlString :
            this.domSanitizer.sanitize(SecurityContext.HTML, htmlString);
    }
}
