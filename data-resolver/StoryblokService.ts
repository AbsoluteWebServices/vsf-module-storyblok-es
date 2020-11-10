import { SearchQuery } from 'storefront-query-builder'
import { quickSearchByQuery, isOnline } from '@vue-storefront/core/lib/search'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { Logger } from '@vue-storefront/core/lib/logger'
import { entityKeyName } from '@vue-storefront/core/lib/store/entities'
import { KEY } from '../index'
import { canCache, getOptimizedFields, storeStoryToCache, getIndexName, getEntityType } from '../helpers'
import { StoryblokDataResolver } from '../types/StoryblokDataResolver'
import Story from '../types/Story'

const getStories = async ({
  query,
  start = 0,
  size = 50,
  sort = '',
  excludeFields = null,
  includeFields = null
}: StoryblokDataResolver.StorySearchOptions): Promise<StoryblokDataResolver.StoriesListResponse> => {
  const isCacheable = canCache({ includeFields, excludeFields })
  const { excluded, included } = getOptimizedFields({ excludeFields, includeFields })
  let {
    items: stories = [],
    aggregations = [],
    total,
    perPage
  } = await quickSearchByQuery({
    query,
    start,
    size,
    entityType: getEntityType(),
    sort,
    index: getIndexName(),
    excludeFields: excluded,
    includeFields: included
  })

  for (let story of stories) {
    if (isCacheable) {
      storeStoryToCache(story, 'full_slug')
    }
  }

  return {
    items: stories,
    perPage,
    start,
    total,
    aggregations
  }
}

const getStory = async (key: string, value: string | number): Promise<Story> => {
  let searchQuery = new SearchQuery()
  searchQuery = searchQuery.applyFilter({ key: key, value: { 'eq': value } })
  const { items = [] } = await getStories({
    query: searchQuery,
    size: 1
  })
  return items[0] || null
}

const getStoryFromCache = async (key: string, value: string | number): Promise<Story> => {
  try {
    const cacheKey = entityKeyName(key, value)
    const cache = StorageManager.get(KEY)
    const result = await cache.getItem(cacheKey)
    if (result !== null) {
      return result
    } else {
      return getStory(key, value)
    }
  } catch (err) {
    // report errors
    if (err) {
      Logger.error(err, 'story')()
    }
    return getStory(key, value)
  }
}

const getStoryByKey = async ({ key, value, skipCache }: StoryblokDataResolver.StoryByKeySearchOptions): Promise<Story> => {
  if (!isOnline()) {
    return getStoryFromCache(key, value)
  }
  const result = skipCache
    ? await getStory(key, value)
    : await getStoryFromCache(key, value)
  return result
}

export const StoryblokService: StoryblokDataResolver.StoryblokService = {
  getStories,
  getStoryByKey
}
