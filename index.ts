import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { getSearchAdapter } from '@vue-storefront/core/lib/search/adapter/searchAdapterFactory'
import { module } from './store'

export const KEY = 'storyblok-es'

export const StoryblokEsModule: StorefrontModule = function ({ store }) {
  StorageManager.init(KEY)

  store.registerModule(KEY, module)
}
