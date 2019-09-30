import { buildURL } from '../util/cmr/buildUrl'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { isWarmUp } from '../util/isWarmup'

/**
 * Perform an authenticated CMR Granule search
 * @param {Object} event Details about the HTTP request that it received
 */
const cmrGranuleSearch = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const { body } = event

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'browse_only',
    'cloud_cover',
    'day_night_flag',
    'echo_collection_id',
    'exclude',
    'online_only',
    'options',
    'page_num',
    'page_size',
    'point',
    'polygon',
    'readable_granule_name',
    'sort_key',
    'temporal',
    'two_d_coordinate_system'
  ]

  const nonIndexedKeys = [
    'exclude',
    'readable_granule_name',
    'sort_key'
  ]

  return doSearchRequest(getJwtToken(event), buildURL({
    body,
    path: '/search/granules.json',
    permittedCmrKeys,
    nonIndexedKeys
  }))
}

export default cmrGranuleSearch