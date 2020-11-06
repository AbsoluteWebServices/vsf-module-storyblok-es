import { SearchQuery } from 'storefront-query-builder'
import Story from './Story'

declare namespace StoryblokDataResolver {

  interface StorySearchOptions {
    query: SearchQuery,
    size?: number,
    start?: number,
    sort?: string,
    includeFields?: string[],
    excludeFields?: string[]
  }

  interface StoryByKeySearchOptions {
    key: string,
    value: string | number,
    skipCache?: boolean
  }

  interface StoriesListResponse {
    items: Story[],
    perPage?: number,
    start?: number,
    total?: number,
    aggregations?: any[]
  }

  interface StoryblokService {
    getStories: (searchRequest: StorySearchOptions) => Promise<StoriesListResponse>,
    getStoryByKey: (searchRequest: StoryByKeySearchOptions) => Promise<Story>
  }

}
