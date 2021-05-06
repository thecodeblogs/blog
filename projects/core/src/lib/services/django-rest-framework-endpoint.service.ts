import {Injectable, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ListResponse} from '../data/list-response';
import {CoreEvent} from '../data/core-event';
import {CoreEventType} from '../data/core-event-type.enum';

@Injectable({
    providedIn: 'root'
})
export class DjangoRestFrameworkEndpointService<T> {
    constructor(
        protected http: HttpClient
    ) {
    }

    events = new EventEmitter<CoreEvent<T>>();
    endpoint = '';

    triggerCoreEvent(obj: T, type: CoreEventType) {
        this.events.next(new CoreEvent(obj, type));
        return obj;
    }

    handleResponse(obj: T) {
        return obj;
    }
    handleListResponse(obj: ListResponse<T>) {
        return obj;
    }

    get(): Observable<ListResponse<T>> {
        return this.http.get<ListResponse<T>>(this.endpoint).pipe(
            map(this.handleListResponse.bind(this))
        );
    }
    getById(id: string): Observable<T> {
        return this.http.get<T>(this.endpoint + id + '/').pipe(
            map(this.handleResponse.bind(this))
        );
    }
    create(entity: T): Observable<T> {
        return this.http.post<T>(this.endpoint, entity + '/').pipe(
            map((val) => this.triggerCoreEvent(val, CoreEventType.CREATE)),
            map(this.handleResponse.bind(this))
        );
    }
    delete(entity: T): Observable<T> {
        return this.http.delete<T>(this.endpoint + (entity as any).id + '/').pipe(
            map((val) => this.triggerCoreEvent(val, CoreEventType.DELETE)),
            map(this.handleResponse.bind(this))
        );
    }
    update(entity: T): Observable<T> {
        return this.http.patch<T>(this.endpoint + (entity as any).id + '/', entity).pipe(
            map((val) => this.triggerCoreEvent(val, CoreEventType.UPDATE)),
            map(this.handleResponse.bind(this))
        );
    }
    getListByUrl(url: string): Observable<ListResponse<T>> {
        return this.http.get<ListResponse<T>>(url).pipe(
            map(this.handleListResponse.bind(this))
        );
    }
}
