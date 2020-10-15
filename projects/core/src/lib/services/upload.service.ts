import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Upload} from '../services/upload';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    static upload_endpoint = '/file_api/uploads/create_image/';
    static status_endpoint = '/file_api/uploads/{pk}/status';

    constructor(
        private http: HttpClient
    ) {
    }

    get(id: string): Observable<Upload> {
        return this.http.get<Upload>(UploadService.status_endpoint.replace('{pk}', id) + '/');
    }
}
