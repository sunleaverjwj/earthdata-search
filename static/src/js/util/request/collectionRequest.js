import Request from './request'
import { getApplicationConfig, getEarthdataConfig, getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { hasTag } from '../../../../../sharedUtils/tags'
import unavailableImg from '../../../assets/images/image-unavailable.svg'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'
import { getUmmCollectionVersionHeader } from '../../../../../sharedUtils/ummVersionHeader'

/**
 * Base Request object for collection specific requests
 */
export default class CollectionRequest extends Request {
  constructor(authToken) {
    const cmrEnvironment = cmrEnv()

    if (authToken && authToken !== '') {
      super(getEnvironmentConfig().apiHost)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'collections'
    } else {
      super(getEarthdataConfig(cmrEnvironment).cmrHost)

      // We do not define an extension here. It will be added in the search method.
      this.searchPath = 'search/collections'
    }
  }

  permittedCmrKeys(ext) {
    if (ext === 'umm_json') {
      return [
        'concept_id'
      ]
    }

    return [
      'params',
      'bounding_box',
      'collection_data_type',
      'concept_id',
      'data_center_h',
      'data_center',
      'echo_collection_id',
      'format',
      'facets_size',
      'granule_data_format',
      'granule_data_format_h',
      'has_granules',
      'has_granules_or_cwic',
      'include_facets',
      'include_granule_counts',
      'include_has_granules',
      'include_tags',
      'include_tags',
      'instrument',
      'instrument_h',
      'keyword',
      'line',
      'options',
      'page_num',
      'page_size',
      'platform',
      'platform_h',
      'point',
      'polygon',
      'processing_level_id_h',
      'project_h',
      'project',
      'provider',
      'science_keywords_h',
      'sort_key',
      'spatial_keyword',
      'tag_key',
      'temporal',
      'two_d_coordinate_system'
    ]
  }

  nonIndexedKeys() {
    return [
      'collection_data_type',
      'concept_id',
      'data_center_h',
      'granule_data_format',
      'granule_data_format_h',
      'instrument',
      'instrument_h',
      'platform',
      'platform_h',
      'processing_level_id_h',
      'project_h',
      'provider',
      'sort_key',
      'spatial_keyword',
      'tag_key'
    ]
  }

  search(params, ext = 'json') {
    let urlWithExtension = `${this.searchPath}.${ext}`
    if (this.authToken && this.authToken !== '') {
      urlWithExtension = `${this.searchPath}/${ext}`
    }

    if (params.twoDCoordinateSystem && params.twoDCoordinateSystem.coordinates) {
      // eslint-disable-next-line no-param-reassign
      delete params.twoDCoordinateSystem.coordinates
    }

    return this.post(urlWithExtension, { ...params, ext })
  }

  /**
   * Modifies the payload just before the request is sent.
   * @param {Object} data - An object containing any keys.
   * @param {Object} headers - An object containing headers that will be sent with the request.
   * @return {Object} A modified object.
   */
  transformRequest(data, headers) {
    // eslint-disable-next-line no-param-reassign
    headers.Accept = getUmmCollectionVersionHeader()

    return super.transformRequest(data, headers)
  }

  /**
   * Transform the response before completing the Promise.
   * @param {Object} data - Response object from the object.
   * @return {Object} The object provided
   */
  transformResponse(data) {
    super.transformResponse(data)

    // If the response status code is not 200, return unaltered data
    // If the status code is 200, it doesn't exist in the response
    const { errors = [] } = data
    if (errors.length > 0) return data

    if (!data || Object.keys(data).length === 0) return data

    let entry

    if (data.items) {
      entry = data.items
    } else {
      const { feed = {} } = data
      // eslint-disable-next-line prefer-destructuring
      entry = feed.entry
    }

    entry.map((collection) => {
      const transformedCollection = collection

      if (collection && collection.tags) {
        transformedCollection.is_cwic = Object.keys(collection.tags).includes('org.ceos.wgiss.cwic.granules.prod')
          && collection.has_granules === false
        transformedCollection.has_map_imagery = hasTag(collection, 'gibs')
      }

      if (collection && collection.collection_data_type) {
        transformedCollection.is_nrt = !!(collection.collection_data_type === 'NEAR_REAL_TIME')
      }

      const h = getApplicationConfig().thumbnailSize.height
      const w = getApplicationConfig().thumbnailSize.width

      if (collection.id) {
        transformedCollection.thumbnail = collection.browse_flag
          ? `${getEarthdataConfig(cmrEnv()).cmrHost}/browse-scaler/browse_images/datasets/${collection.id}?h=${h}&w=${w}`
          : unavailableImg
      }

      return transformedCollection
    })

    return data
  }
}
