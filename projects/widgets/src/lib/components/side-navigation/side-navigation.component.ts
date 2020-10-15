import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Entry} from '@thecodeblogs/blog-core/data/entry';
import {Router} from '@angular/router';
import {filter} from 'lodash';
import {Identity} from '@thecodeblogs/blog-core/data/identity';
import {IdentityService} from '@thecodeblogs/blog-core/services/identity.service';
import {map} from 'lodash';
import {EntryService} from '@thecodeblogs/blog-core/services/entry.service';

@Component({
    selector: 'app-side-navigation',
    templateUrl: './side-navigation.component.html',
    styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent implements OnInit, OnDestroy {

    sourceSub;
    identity: Identity;

    entries: {id: string, entry: Entry}[] = [];
    entriesByMonthAndYear: {month_year: string, month_year_number: number, entries: Entry[]}[] = [];

    constructor(
        private entryService: EntryService,
        private router: Router,
        private identityService: IdentityService,
    ) {
    }

    ngOnInit() {
        this.identityService.getMe().subscribe((identity) => {
            this.identity = identity;
        }, (err) => {
            this.identity = null;
        });

        this.getEntries();

    }

    getEntriesWithUrl(url: string) {
        this.entryService.getListByUrl(url).subscribe((response) => {
            this.entries = this.entries.concat(
                map((response as any).results, (result) => {
                    return { id: result.id, entry: new Entry(result)};
                })
            );
            if ((response as any).next) {
                this.getEntriesWithUrl(response.next);
            } else {
                this.organizeEntries();
            }
        });
    }

    organizeEntries() {
        for (const entryWrapper of this.entries) {
            const entry = entryWrapper.entry;
            const create_date = new Date(entry.create_date);
            const month = create_date.getMonth();
            const year = create_date.getFullYear();
            const key = month + '/' + year;
            const sort_index = (year * 100) + month;
            const containers = filter(this.entriesByMonthAndYear, (entryContainer) => entryContainer.month_year === key);
            if (containers.length > 0) {
                const container = containers[0];
                const entriesWithId = filter(container.entries, (e) => e.id === entryWrapper.entry.id);
                if (entriesWithId.length === 0) {
                    container.entries.push(entry);
                }
            } else {
                const newContainer = {month_year: key, month_year_number: sort_index, entries: [entry]};
                this.entriesByMonthAndYear.push(newContainer);
            }
        }
        this.entriesByMonthAndYear.sort(
            (entry_a, entry_b) => {
                return entry_a.month_year_number - entry_b.month_year_number;
            });
        this.entriesByMonthAndYear.reverse();
    }

    getEntries() {
        this.entryService.get().subscribe((response) => {
            this.entries = map(response.results, (result) => {
                return { id: result.id, entry: new Entry(result)};
            });
            if ((response as any).next) {
                this.getEntriesWithUrl(response.next);
            } else {
                this.organizeEntries();
            }
        });
    }

    render() {
    }

    routeTo(entry) {
        if (!entry) {
            this.router.navigateByUrl('create(left-col:create//right-col:create)').then(() => {

            });
        } else {
            this.router.navigate(['/', 'blog', entry.slug]).then(() => {
                // Noop
            });
        }
    }

    getMonthAndYearFromKey(key: string) {
        let subheading = '';
        const parts = key.split('/');

        switch (Number(parts[0])) {
            case 0:
                subheading += 'January ';
                break;
            case 1:
                subheading += 'February ';
                break;
            case 2:
                subheading += 'March ';
                break;
            case 3:
                subheading += 'April ';
                break;
            case 4:
                subheading += 'May ';
                break;
            case 5:
                subheading += 'June ';
                break;
            case 6:
                subheading += 'July ';
                break;
            case 7:
                subheading += 'August ';
                break;
            case 8:
                subheading += 'September ';
                break;
            case 9:
                subheading += 'October ';
                break;
            case 10:
                subheading += 'November ';
                break;
            case 11:
                subheading += 'December ';
                break;
            default:
                subheading += 'January ';
        }
        subheading += parts[1];

        return subheading;
    }

    ngOnDestroy(): void {
        if (this.sourceSub) {
            this.sourceSub.unsubscribe();
            this.sourceSub = null;
        }
    }
}
