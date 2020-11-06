import { ActionTree } from 'vuex'
import { SearchQuery } from 'storefront-query-builder'
import RootState from '@vue-storefront/core/types/RootState'
import { KEY } from '../index'
import Story from '../types/Story'
import { StoryblokDataResolver } from '../types/StoryblokDataResolver'
import { StoryblokService } from '../data-resolver/StoryblokService'
import { setRequestCacheTags } from '../helpers'

const actions: ActionTree<any, RootState> = {
  /**
   * Search ElasticSearch catalog of stories using simple text query
   * Use bodybuilder to build the query, aggregations etc: http://bodybuilder.js.org/
   * @param {SearchQuery} query is the object of searchQuery class
   * @param {Int} [start=0] start index
   * @param {Int} [size=50] page size
   * @param {String} [sort] results sort
   * @param {Array} [excludeFields] list of fields excluded from resulting entities
   * @param {Array} [includeFields] list of fields included in resulting entities
   * @param {Object} [options] additional options
   * @return {Promise<StoryblokDataResolver.StoriesListResponse>}
   */
  async findStories (context, {
    query,
    start = 0,
    size = 50,
    sort = '',
    excludeFields = null,
    includeFields = null,
    options: {
      populateRequestCacheTags = false
    } = {}
  } = {}): Promise<StoryblokDataResolver.StoriesListResponse> {
    const { items, ...restResponseData } = await StoryblokService.getStories({
      query,
      start,
      size,
      sort,
      excludeFields,
      includeFields
    })

    if (populateRequestCacheTags) {
      setRequestCacheTags({ stories: items })
    }

    return { ...restResponseData, items }
  },
  /**
   * Search single story by specific field
   * @param {String} [key=full_slug] search key
   * @param {String | Number} value search value
   * @param {Boolean} [skipCache] skip localstorage cache
   * @return {Promise<Story>}
   */
  async single (context, {
    key = 'full_slug',
    value,
    skipCache = false
  } = {}): Promise<Story> {
    if (!value) {
      throw new Error(`Please provide the value for ${KEY}/single action!`)
    }
    return StoryblokService.getStoryByKey({
      key,
      value,
      skipCache
    })
  },
  /**
   * Search ElasticSearch catalog of stories using folder slug
   * Use bodybuilder to build the query, aggregations etc: http://bodybuilder.js.org/
   * @param {String} folder folder name for stories
   * @param {SearchQuery} [query] is the object of searchQuery class
   * @param {Int} [start=0] start index
   * @param {Int} [size=50] page size
   * @param {String} [sort] results sort
   * @param {Array} [excludeFields] list of fields excluded from resulting entities
   * @param {Array} [includeFields] list of fields included in resulting entities
   * @param {Object} [options] additional options
   * @return {Promise<StoryblokDataResolver.StoriesListResponse>}
   */
  async findStoriesInFolder ({ dispatch }, {
    folder,
    query = null,
    start = 0,
    size = 50,
    sort = '',
    excludeFields = null,
    includeFields = null,
    options: {
      populateRequestCacheTags = false
    } = {}
  } = {}): Promise<StoryblokDataResolver.StoriesListResponse> {
    let resultQuery: SearchQuery

    if (query) {
      resultQuery = query
    } else {
      resultQuery = new SearchQuery()
    }

    resultQuery = resultQuery.applyFilter({ key: 'folder', value: { 'eq': folder } })

    return dispatch('findStories', {
      query: resultQuery,
      start,
      size,
      sort,
      excludeFields,
      includeFields,
      options: {
        populateRequestCacheTags
      }
    })
  }
}

export default actions
