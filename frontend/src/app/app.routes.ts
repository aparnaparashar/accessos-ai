import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
  { path: 'features', loadComponent: () => import('./pages/features/features.component').then((m) => m.FeaturesComponent) },
  {
    path: 'developer-portal',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/developer-portal/developer-portal.component').then((m) => m.DeveloperPortalComponent),
  },
  { path: 'architecture', loadComponent: () => import('./pages/architecture/architecture.component').then((m) => m.ArchitectureComponent) },
  { path: 'pricing', loadComponent: () => import('./pages/pricing/pricing.component').then((m) => m.PricingComponent) },
  { path: 'roadmap', loadComponent: () => import('./pages/roadmap/roadmap.component').then((m) => m.RoadmapComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./pages/auth/signup/signup.component').then((m) => m.SignupComponent) },
  { path: '**', redirectTo: '' },
];
