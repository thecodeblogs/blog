import {Injectable} from '@angular/core';
import {DjangoRestFrameworkEndpointService} from '../services/django-rest-framework-endpoint.service';
import {ListResponse} from '../data/list-response';
import {Entry} from '../data/entry';
import {Observable, Subject} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {loMap} from 'lodash';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class EntryService extends DjangoRestFrameworkEndpointService<Entry> {

    endpoint = '/blog_api/entries/';

    _currentlyEditedEntry: Entry;
    currentlyEditedEntry: Subject<Entry> = new Subject<Entry>();
    sub;

    handleResponse(obj: Entry): Entry {
        return new Entry(obj);
    }

    handleListResponse(obj: ListResponse<Entry>): ListResponse<Entry> {
        const response = obj;
        const results = [];
        for (let i = 0; i < response.results.length; i++) {
            results.push(new Entry(response.results[i]));
        }
        response.results = results;
        return response;
    }


    constructor(
        protected http: HttpClient,
    ) {
        super(http);
        this.sub = this.currentlyEditedEntry.pipe(debounceTime(3000)).subscribe((e) => {
            e.edit_date = new Date();
            this.http.patch(this.endpoint + e.id + '/?published=false', e).subscribe((response) => {
                console.log('Synced ' + e.id + '...');
            }, (err) => {
                console.log('Error encountered syncing ' + e.id);
            });
        });
    }

    get(): Observable<ListResponse<Entry>> {
        return this.http.get(this.endpoint + '?published=true').pipe(
            map(this.handleListResponse.bind(this))
        );
    }

    getUnpublishedEntries() {
        return this.http.get(this.endpoint + '?published=false');
    }

    getBySlug(slug: string) {
        return this.http.get(this.endpoint + slug + '/by_slug/').pipe(
            map(this.handleResponse.bind(this))
        );
    }
    getUnpublishedById(id: string): Observable<Entry> {
        return this.http.get<Entry>(this.endpoint + id + '?published=false').pipe(
            map(this.handleResponse.bind(this))
        );
    }
    updateUnpublishedEntry(entry: Entry): Observable<Entry> {
        return this.http.patch<Entry>(this.endpoint + entry.id + '/?published=false', entry).pipe(
            map(this.handleResponse.bind(this))
        );
    }
}
