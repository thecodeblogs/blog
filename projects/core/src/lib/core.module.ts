import { NgModule } from '@angular/core';
import { CommentService } from './services/comment.service';
import { EntryService } from './services/entry.service';
import { UploadService } from './services/upload.service';
import { PrismService } from './services/prism.service';
import { IdentityService } from './services/identity.service';
import { DjangoRestFrameworkEndpointService } from './services/django-rest-framework-endpoint.service';


@NgModule({
    declarations: [
    ],
    imports: [
    ],
    providers: [
        CommentService,
        EntryService,
        UploadService,
        PrismService,
        IdentityService,
        DjangoRestFrameworkEndpointService,
    ],
    exports: [
    ]
})
export class CoreModule { }
