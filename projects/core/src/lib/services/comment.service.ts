import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    endpoint = '/blog_api/comments/';
    adminEndpoint = '/blog_api/admin/comments/';

    constructor(
        protected http: HttpClient,
    ) {
    }

    getComments(entry) {
        return this.http.get(this.endpoint, {params: {entry}});
    }
    postComment(comment) {
        return this.http.post(this.endpoint, comment, {params: {entry: comment.entry}});
    }
    patchComment(comment) {
        return this.http.patch(this.adminEndpoint + '/' + comment.id + '/', comment);
    }
}
