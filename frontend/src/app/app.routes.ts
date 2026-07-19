import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: {
      seo: {
        title: 'Universal Accessibility Intelligence Platform',
        description:
          'AccessOS AI is one orchestration layer for scene understanding, OCR, simplification, speech, and sign-language assistance, plus a full accessibility-as-a-service developer platform.',
      },
    },
  },
  {
    path: 'features',
    loadComponent: () => import('./pages/features/features.component').then((m) => m.FeaturesComponent),
    data: {
      seo: {
        title: 'Features',
        description: 'Every End-User App capability, tagged LIVE, BUILT, or PLANNED to match exactly what the code does today.',
      },
    },
  },
  {
    path: 'companion',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/companion/companion.component').then((m) => m.CompanionComponent),
    data: {
      seo: {
        title: 'AI Companion',
        description: 'Describe an image or ask a question and get a fused accessibility response tailored to your preferences.',
      },
    },
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
    data: {
      seo: {
        title: 'Accessibility Settings',
        description: 'Set your primary disability or support need, reading level, and preferred output modalities.',
      },
    },
  },
  {
    path: 'developer-portal',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/developer-portal/developer-portal.component').then((m) => m.DeveloperPortalComponent),
    data: {
      seo: {
        title: 'Developer Portal',
        description: 'Manage applications, generate API keys, monitor usage, and view estimated billing for the AccessOS AI platform.',
      },
    },
  },
  {
    path: 'architecture',
    loadComponent: () => import('./pages/architecture/architecture.component').then((m) => m.ArchitectureComponent),
    data: {
      seo: {
        title: 'Architecture',
        description: 'The real system architecture behind AccessOS AI today: what actually runs versus what is still planned.',
      },
    },
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing.component').then((m) => m.PricingComponent),
    data: {
      seo: {
        title: 'Pricing',
        description: 'Plans and estimated usage-based costs for the AccessOS AI developer platform.',
      },
    },
  },
  {
    path: 'roadmap',
    loadComponent: () => import('./pages/roadmap/roadmap.component').then((m) => m.RoadmapComponent),
    data: {
      seo: {
        title: 'Roadmap',
        description: 'What has shipped so far and what is planned next for AccessOS AI, regenerated after every phase lands.',
      },
    },
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
    data: { seo: { title: 'Sign in', description: 'Sign in to your AccessOS AI account.' } },
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup/signup.component').then((m) => m.SignupComponent),
    data: { seo: { title: 'Create account', description: 'Create an AccessOS AI end-user or developer account.' } },
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    data: { seo: { title: 'Page not found', description: 'The page you were looking for does not exist.' } },
  },
  { path: '**', redirectTo: '404' },
];
