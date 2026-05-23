import { inject, InjectionToken } from '@angular/core';

export interface ApiEnvironment {
  apiBaseUrl: string;
}

export const API_ENV = new InjectionToken<ApiEnvironment>('API_ENV');

export const defaultApiEnvironment: ApiEnvironment = {
  apiBaseUrl: 'http://localhost:8081/api',
};

declare global {
  interface Window {
    __TRACTOR_API_BASE__?: string;
  }
}

/** URL base de API: DI en shell, fallback global para MFEs (Module Federation duplica el token) */
export function resolveApiBaseUrl(): string {
  const fromToken = inject(API_ENV, { optional: true });
  if (fromToken?.apiBaseUrl) {
    return fromToken.apiBaseUrl;
  }
  if (typeof window !== 'undefined' && window.__TRACTOR_API_BASE__) {
    return window.__TRACTOR_API_BASE__;
  }
  return defaultApiEnvironment.apiBaseUrl;
}
