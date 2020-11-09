import config from 'config'
import { processURLAddress } from '@vue-storefront/core/helpers'
import getApiEndpointUrl from '@vue-storefront/core/helpers/getApiEndpointUrl'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default function registerStoryEntityType (searchAdapter) {
  let url = config.storyblok.elasticsearchHost

  if (!url) {
    url = processURLAddress(getApiEndpointUrl(currentStoreView().elasticsearch, 'host'))
  }

  searchAdapter.registerEntityType('story', {
    queryProcessor: (query) => {
      // function that can modify the query each time before it's being executed
      return query
    },
    resultProcessor: (resp, start, size) => {
      return searchAdapter.handleResult(resp, 'story', start, size)
    },
    url
  })
}
