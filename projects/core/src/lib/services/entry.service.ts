import {Injectable, EventEmitter} from '@angular/core';
import {DjangoRestFrameworkEndpointService} from '../services/django-rest-framework-endpoint.service';
import {ListResponse} from '../data/list-response';
import {Entry} from '../data/entry';
import {Observable, Subject} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {loMap} from 'lodash';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CoreEvent} from '../data/core-event';
import {CoreEventType} from '../data/core-event-type.enum';

@Injectable({
    providedIn: 'root'
})
export class EntryService extends DjangoRestFrameworkEndpointService<Entry> {

    endpoint = '/blog_api/entries/';
    adminEndpoint = '/blog_api/admin/entries/';

    _currentlyEditedEntry: Entry;
    currentlyEditedEntry: Subject<Entry> = new Subject<Entry>();
    sub;

    handleResponse(obj: Entry): Entry {
        return new Entry(obj);
    }

    handleListResponse(obj: ListResponse<Entry>): ListResponse<Entry> {
        const response = obj;
        const results = [];
        for (const result of response.results) {
            results.push(new Entry(result));
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
            const params = new HttpParams().set('published', JSON.stringify(false)).set('defunct', JSON.stringify(false));

            this.http.patch(this.adminEndpoint + e.id + '/', e, {params}).pipe(
                map(this.handleResponse.bind(this))
            ).subscribe((response) => {
                this.triggerCoreEvent((response as Entry), CoreEventType.UPDATE);
                console.log('Synced ' + e.id + '...');
            }, (err) => {
                console.log('Error encountered syncing ' + e.id + ', trying to create...');
                this.http.post(this.adminEndpoint, e).pipe(
                    map(this.handleResponse)
                ).subscribe((response) => {
                    this.triggerCoreEvent((response as Entry), CoreEventType.CREATE);
                    console.log('Created ' + e.id + '...');
                }, (createErr) => {
                    console.log('Error creating ' + e.id);
                });
            });
        });
    }

    get(): Observable<ListResponse<Entry>> {
        return this.http.get(this.endpoint).pipe(
            map(this.handleListResponse.bind(this))
        );
    }

    getUnpublishedEntries() {
        const params = new HttpParams().set('published', JSON.stringify(false)).set('defunct', JSON.stringify(false));
        return this.http.get(this.adminEndpoint, {params});
    }

    getBySlug(slug: string) {
        return this.http.get(this.endpoint + slug + '/by_slug/').pipe(
            map(this.handleResponse.bind(this))
        );
    }
    getUnpublishedById(id: string): Observable<Entry> {
        const params = new HttpParams().set('published', JSON.stringify(false)).set('defunct', JSON.stringify(false));
        return this.http.get<Entry>(this.adminEndpoint + id, {params}).pipe(
            map(this.handleResponse.bind(this))
        );
    }
    updateUnpublishedEntry(entry: Entry): Observable<Entry> {
        const params = new HttpParams().set('published', JSON.stringify(false)).set('defunct', JSON.stringify(false));
        return this.http.patch<Entry>(this.adminEndpoint + entry.id + '/', entry, {params}).pipe(
            map((val) => this.triggerCoreEvent(val, CoreEventType.UPDATE)),
            map(this.handleResponse.bind(this))
        );
    }
}
