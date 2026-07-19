import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { IconRailComponent } from './shared/icon-rail/icon-rail.component';
import { ToastHostComponent } from './shared/toast-host/toast-host.component';
import { SeoService } from './core/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, IconRailComponent, ToastHostComponent],
  template: `
    <app-navbar></app-navbar>
    <app-icon-rail></app-icon-rail>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
    <app-toast-host></app-toast-host>
  `,
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private seo: SeoService) {}

  ngOnInit(): void {
    // Section 09: apply the active route's `data.seo` (title, meta
    // description, Open Graph tags) on every navigation, including lazy
    // route changes handled entirely client-side.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        if (data['seo']) {
          this.seo.apply(data['seo'], this.router.url);
        }
      });
  }
}
