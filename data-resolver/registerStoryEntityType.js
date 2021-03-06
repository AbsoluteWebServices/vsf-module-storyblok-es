import { getElasticHost, getEntityType } from '../helpers'

export default function registerStoryEntityType (searchAdapter) {
  searchAdapter.registerEntityType(getEntityType(), {
    queryProcessor: (query) => {
      // function that can modify the query each time before it's being executed
      return query
    },
    resultProcessor: (resp, start, size) => {
      return searchAdapter.handleResult(resp, getEntityType(), start, size)
    },
    url: getElasticHost()
  })
}
