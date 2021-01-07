import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ListResponse} from '../data/list-response';
import {Tag} from '../data/tag';
import {DjangoRestFrameworkEndpointService} from './django-rest-framework-endpoint.service';

@Injectable({
    providedIn: 'root'
})
export class TagService extends DjangoRestFrameworkEndpointService<Tag> {
    endpoint = '/blog_api/tags/';

    handleResponse(obj: Tag): Tag{
        return new Tag(obj);
    }

    handleListResponse(obj: ListResponse<Tag>): ListResponse<Tag> {
        const response = obj;
        const results = [];
        for (let i = 0; i < response.results.length; i++) {
            results.push(new Tag(response.results[i]));
        }
        response.results = results;
        return response;
    }

    constructor(
        protected http: HttpClient,
    ) {
        super(http);
    }
}
