import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section not-found">
      <div class="container">
        <span class="eyebrow">404</span>
        <h1>Page not found</h1>
        <p class="lede">The page you were looking for doesn't exist, or may have moved.</p>
        <a routerLink="/" class="btn btn-primary">Back to home</a>
      </div>
    </section>
  `,
  styles: [`
    .not-found { padding: 96px 0; text-align: center; min-height: 50vh; }
    .lede { max-width: 460px; margin-left: auto; margin-right: auto; }
  `],
})
export class NotFoundComponent {}
