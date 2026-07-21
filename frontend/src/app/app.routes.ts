import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: {
      seo: {
        title: 'AccessOS AI — Developer-First AI API Platform',
        description: 'Developer-first AI API platform for accessibility intelligence, scene understanding, OCR, and text simplification.',
      },
    },
  },
  {
    path: 'features',
    loadComponent: () => import('./pages/features/features.component').then((m) => m.FeaturesComponent),
    data: {
      seo: {
        title: 'API Features & Demos',
        description: 'Interactive live demos for OCR, Vision, Accessibility Assist, Simplification, and Sign Language APIs.',
      },
    },
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs/docs.component').then((m) => m.DocumentationComponent),
    data: {
      seo: {
        title: 'Documentation',
        description: 'Comprehensive API reference, quickstarts, and SDK guides for AccessOS AI.',
      },
    },
  },
  {
    path: 'playground',
    loadComponent: () => import('./pages/playground/playground.component').then((m) => m.PlaygroundComponent),
    data: {
      seo: {
        title: 'API Playground',
        description: 'Interactive API explorer for AccessOS AI endpoints.',
      },
    },
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
    data: {
      seo: {
        title: 'About AccessOS AI',
        description: 'Learn about our mission to power universal accessibility with enterprise AI infrastructure.',
      },
    },
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/developer-portal/developer-portal.component').then((m) => m.DeveloperPortalComponent),
    data: {
      seo: {
        title: 'Developer Dashboard',
        description: 'Manage projects, API keys, logs, webhooks, and performance metrics.',
      },
    },
  },
  {
    path: 'developer-portal',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'companion',
    redirectTo: 'playground',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
    data: {
      seo: {
        title: 'Developer Settings',
        description: 'Manage profile, security credentials, theme preferences, and API defaults.',
      },
    },
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
    data: { seo: { title: 'Developer Sign In', description: 'Sign in to your AccessOS AI developer account.' } },
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup/signup.component').then((m) => m.SignupComponent),
    data: { seo: { title: 'Get API Key', description: 'Create an AccessOS AI developer account to get your API key.' } },
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    data: { seo: { title: 'Page Not Found', description: 'The requested page could not be found.' } },
  },
  { path: '**', redirectTo: '404' },
];
