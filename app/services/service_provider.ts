type LazyService<T = any> = () => Promise<{ default: T }>

// Register services that should be available in the container here
export const ServiceProviders = {
  post_service: () => import('./post_service.js'),
} satisfies Record<string, LazyService>
