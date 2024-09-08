import { ServiceProviders } from '#services/service_provider'
import type { ApplicationService } from '@adonisjs/core/types'

export default class ServiceProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    Object.entries(ServiceProviders).forEach(([key, creator]) => {
      this.app.container.singleton(key as keyof typeof ServiceProviders, async (resolver) => {
        const constructor = await creator()
        return resolver.make(constructor.default)
      })
    })
  }
}

type ProvidedServices = {
  [K in keyof typeof ServiceProviders]: InstanceType<
    Awaited<ReturnType<(typeof ServiceProviders)[K]>>['default']
  >
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings extends ProvidedServices {}
}
