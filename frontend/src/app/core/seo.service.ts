import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
}

const SITE_NAME = 'AccessOS AI';
const SITE_URL = 'https://accessos.ai';

/**
 * Per-route SEO (Section 09 production polish). Each route in
 * app.routes.ts carries a `data.seo` object; app.component.ts subscribes
 * to router NavigationEnd and calls `apply()` with the active route's data.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  apply(seo: SeoData, path = '') {
    const fullTitle = `${seo.title} · ${SITE_NAME}`;
    this.title.setTitle(fullTitle);

    this.setTag('name', 'description', seo.description);
    this.setTag('property', 'og:title', fullTitle);
    this.setTag('property', 'og:description', seo.description);
    this.setTag('property', 'og:type', 'website');
    this.setTag('property', 'og:url', `${SITE_URL}${path}`);
    this.setTag('property', 'og:site_name', SITE_NAME);
    this.setTag('name', 'twitter:card', 'summary_large_image');
    this.setTag('name', 'twitter:title', fullTitle);
    this.setTag('name', 'twitter:description', seo.description);
  }

  private setTag(attr: 'name' | 'property', key: string, content: string) {
    if (this.meta.getTag(`${attr}="${key}"`)) {
      this.meta.updateTag({ [attr]: key, content });
    } else {
      this.meta.addTag({ [attr]: key, content });
    }
  }
}
