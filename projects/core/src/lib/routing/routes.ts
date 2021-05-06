import {Routes as AngularRoutes, RouterModule} from '@angular/router';
import {EntryCreatorComponent} from '../components/entry-creator/entry-creator.component';
import {EntryRendererWrapperComponent} from '../components/entry-renderer-wrapper/entry-renderer-wrapper.component';
import {JsonRendererComponent} from '../components/json-renderer/json-renderer.component';
import {MainComponent} from '../components/main/main.component';
import {OutlineViewComponent} from '../components/outline-view/outline-view.component';
import {SideNavigationComponent} from '../components/side-navigation/side-navigation.component';

const routes: AngularRoutes = [
    {path: '', component: SideNavigationComponent, outlet: 'left-col'},
    {
        path: 'landing',
        component: MainComponent
    },
    {path: 'blog/:slug', component: EntryRendererWrapperComponent},
    {path: 'create', component: EntryCreatorComponent},
    {path: 'create', component: OutlineViewComponent, outlet: 'left-col'},
    {path: 'create', component: JsonRendererComponent, outlet: 'right-col'},
    {path: '', redirectTo: '/landing', pathMatch: 'full'},
    {path: '**', redirectTo: '/404error'}
];

export class Routes {
    routes: AngularRoutes = routes;
}
