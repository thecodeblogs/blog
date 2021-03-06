import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FileUploadModule} from 'ng2-file-upload';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { CommentService } from './services/comment.service';
import { EntryService } from './services/entry.service';
import { UploadService } from './services/upload.service';
import { PrismService } from './services/prism.service';
import { IdentityService } from './services/identity.service';
import { DjangoRestFrameworkEndpointService } from './services/django-rest-framework-endpoint.service';
import {EntryRendererComponent} from './components/entry-renderer/entry-renderer.component';
import {EntryCreatorComponent} from './components/entry-creator/entry-creator.component';
import {OutlineViewComponent} from './components/outline-view/outline-view.component';
import {SideNavigationComponent} from './components/side-navigation/side-navigation.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {JsonRendererComponent} from './components/json-renderer/json-renderer.component';
import {EntrySummaryComponent} from './components/entry-summary/entry-summary.component';
import { MediaUploadModalComponent } from './components/media-upload-modal/media-upload-modal.component';
import { EntrySelectorDialogComponent } from './components/entry-selector-dialog/entry-selector-dialog.component';
import {TimeAgoPipe} from './pipes/TimeAgoPipe';
import {LinkyPipe} from './pipes/LinkyPipe';
import { StaticHtmlComponent } from './components/static-html/static-html.component';
import {TagService} from './services/tag.service';
import { MainComponent } from './components/main/main.component';
import { EntryRendererWrapperComponent } from './components/entry-renderer-wrapper/entry-renderer-wrapper.component';
import {RouterModule} from '@angular/router';
import { SchedulePublishDialogComponent } from './components/schedule-publish-dialog/schedule-publish-dialog.component';


@NgModule({
    declarations: [
        EntryRendererComponent,
        EntryCreatorComponent,
        LandingPageComponent,
        SideNavigationComponent,
        OutlineViewComponent,
        JsonRendererComponent,
        EntrySummaryComponent,
        EntrySelectorDialogComponent,
        MediaUploadModalComponent,
        TimeAgoPipe,
        LinkyPipe,
        StaticHtmlComponent,
        MainComponent,
        EntryRendererWrapperComponent,
        SchedulePublishDialogComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        DragDropModule,
        MatCardModule,
        MatSidenavModule,
        MatButtonModule,
        MatInputModule,
        MatListModule,
        MatRadioModule,
        MatDialogModule,
        MatCheckboxModule,
        MatDividerModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FontAwesomeModule,
        FileUploadModule,
        NgxMaterialTimepickerModule,
    ],
    providers: [
        CommentService,
        EntryService,
        UploadService,
        PrismService,
        IdentityService,
        DjangoRestFrameworkEndpointService,
        TagService,
    ],
    exports: [
        EntryRendererComponent,
        EntryCreatorComponent,
        LandingPageComponent,
        SideNavigationComponent,
        OutlineViewComponent,
        JsonRendererComponent,
        EntrySummaryComponent,
        EntrySelectorDialogComponent,
        MediaUploadModalComponent,
        TimeAgoPipe,
        LinkyPipe,
        StaticHtmlComponent,
        MainComponent,
        EntryRendererWrapperComponent,
    ]
})
export class CoreModule {
    constructor(
        private library: FaIconLibrary
    ) {
        this.library.addIcons(faSpinner);
    }
}
