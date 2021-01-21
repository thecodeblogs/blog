import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DjangoRestFrameworkEndpointService} from '../django-rest-framework-endpoint.service';
import {View} from '../view';

@Injectable({
    providedIn: 'root'
})
export class ViewService extends DjangoRestFrameworkEndpointService<View> {
    endpoint = '/blog_api/views/';

    constructor(
        public http: HttpClient,
    ) {
        super(http);
    }
}
