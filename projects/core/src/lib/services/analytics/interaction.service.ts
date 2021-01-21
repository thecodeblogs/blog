import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DjangoRestFrameworkEndpointService} from '../django-rest-framework-endpoint.service';
import {Interaction} from '../interaction';

@Injectable({
    providedIn: 'root'
})
export class InteractionService extends DjangoRestFrameworkEndpointService<Interaction> {
    endpoint = '/blog_api/interactions/';

    constructor(
        public http: HttpClient,
    ) {
        super(http);
    }
}
