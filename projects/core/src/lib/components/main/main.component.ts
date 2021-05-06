import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'lib-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

    loaded = true;
    subs: Subscription = new Subscription();
    showRightCol: boolean;
    showLeftCol: boolean;

    public innerWidth: any;

    resizeSubject = new Subject<number>();

    constructor(
        private router: Router,
    ) {

    }

    ngOnInit(): void {
        this.subs.add(this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd) {
                if (e.urlAfterRedirects.includes('create')) {
                    this.showLeftCol = true;
                    this.showRightCol = true;
                } else {
                    this.showLeftCol = true;
                    this.showRightCol = false;
                    this.innerWidth = window.innerWidth;
                    this.collapseLeftColIfTooNarrow();
                }
            }
        }));

        this.subs.add(this.resizeSubject.pipe(
            debounceTime(100)
        ).subscribe((width) => {
            this.innerWidth = width;
            this.collapseLeftColIfTooNarrow();
        }));
    }

    collapseLeftColIfTooNarrow() {
        this.showLeftCol = this.innerWidth >= 800;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.resizeSubject.next(window.innerWidth);
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

}
