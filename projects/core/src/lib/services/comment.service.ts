import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    endpoint = '/blog_api/comments/';

    constructor(
        private http: HttpClient,
    ) {
    }

    getComments(entry) {
        return this.http.get(this.endpoint, {params: {entry}});
    }
    postComment(comment) {
        return this.http.post(this.endpoint, comment, {params: {entry: comment.entry}});
    }
}
