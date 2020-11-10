import Vue from 'vue'
import config from 'config'
import { Logger } from '@vue-storefront/core/lib/logger'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { entityKeyName } from '@vue-storefront/core/lib/store/entities'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { processURLAddress } from '@vue-storefront/core/helpers'
import getApiEndpointUrl from '@vue-storefront/core/helpers/getApiEndpointUrl'
import { KEY } from '../index'

export const canCache = ({ includeFields, excludeFields }) => {
  const isCacheable = includeFields === null && excludeFields === null

  if (isCacheable) {
    Logger.debug('Entity cache is enabled for productList')()
  } else {
    Logger.debug('Entity cache is disabled for productList')()
  }

  return isCacheable
}

const getCacheKey = (entity, cacheByKey) => {
  if (!entity[cacheByKey]) {
    cacheByKey = 'uuid'
  }

  return entityKeyName(
    cacheByKey,
    entity[cacheByKey]
  )
}

export const storeStoryToCache = (entity, cacheByKey) => {
  const cacheKey = getCacheKey(entity, cacheByKey)
  const cache = StorageManager.get(KEY)

  cache.setItem(cacheKey, entity, null, config.storyblok.disablePersistentCache === true)
}

export const getOptimizedFields = ({ excludeFields, includeFields }) => {
  if (config.entities.optimize) {
    if (config.entities.story) {
      return {
        excluded: excludeFields || config.entities.story.excludeFields,
        included: includeFields || config.entities.story.includeFields
      }
    } else {
      return {
        excluded: excludeFields,
        included: includeFields
      }
    }
  }

  return { excluded: excludeFields, included: includeFields }
}

export const setRequestCacheTags = ({ stories = [] }) => {
  if (Vue.prototype.$cacheTags) {
    stories.forEach((story) => {
      Vue.prototype.$cacheTags.add(`SB${story.uuid}`);
    })
  }
}

export const getElasticHost = () => {
  return processURLAddress(config.storyblok.elasticsearchHost) || processURLAddress(getApiEndpointUrl(currentStoreView().elasticsearch, 'host'))
}

export const getIndexName = () => {
  return config.storyblok.index || 'storyblok_stories'
}

export const getEntityType = () => {
  return config.storyblok.entity || 'story'
}
