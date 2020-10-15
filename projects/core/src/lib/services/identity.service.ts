import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Identity} from '../data/identity';

@Injectable({
    providedIn: 'root'
})
export class IdentityService {

    constructor(
        protected http: HttpClient
    ) { }
    getMe(): Observable<Identity> {
        throw new Error('You must provide an implementation for this');
    }
}
