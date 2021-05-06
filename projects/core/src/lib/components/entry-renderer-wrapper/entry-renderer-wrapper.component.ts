import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {InteractionService} from '../../services/analytics/interaction.service';
import {ViewService} from '../../services/analytics/view.service';
import {EntryService} from '../../services/entry.service';
import {Interaction} from '../../services/interaction';
import {View} from '../../services/view';

@Component({
  selector: 'lib-entry-renderer-wrapper',
  templateUrl: './entry-renderer-wrapper.component.html',
  styleUrls: ['./entry-renderer-wrapper.component.css']
})
export class EntryRendererWrapperComponent implements OnInit, OnDestroy {
    entries;
    currentEntry;
    seeAllEntries = false;
    routerSub;

    seeAll(toggle: boolean) {
        this.seeAllEntries = toggle;
    }

    constructor(
        private entryService: EntryService,
        private router: Router,
        private route: ActivatedRoute,
        private viewService: ViewService,
        private interactionService: InteractionService
    ) {
    }

    getEntry() {
        const slug = this.route.snapshot.paramMap.get('slug');
        if (slug) {
            this.entryService.getBySlug(slug).subscribe((response) => {
                this.currentEntry = response;
                const view = new View();
                view.entry = this.currentEntry.id;

                this.viewService.create(view).subscribe((viewResponse) => {
                    // Noop
                });
            });
        }

        this.route.queryParams.subscribe(params => {
            const campaign = params['campaign'];
            if (campaign && campaign !== '') {

                const interaction = new Interaction();
                interaction.content = {'campaign': campaign, slug};
                this.interactionService.create(interaction).subscribe((response) => {

                });
                setTimeout(() => {
                    const urlMinsCampaign = this.router.url.replace(new RegExp('.campaign=' + campaign), '');
                    this.router.navigateByUrl(urlMinsCampaign);
                }, 0);
            }
        });
    }

    ngOnInit() {
        this.routerSub = this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd) {
                this.currentEntry = null;
                this.seeAll(false);
                setTimeout(() => {
                    this.getEntry();
                }, 10);
            }
        });

        this.getEntry();
    }

    ngOnDestroy(): void {
        if (this.routerSub) {
            this.routerSub.complete();
            this.routerSub = null;
        }
    }

}
