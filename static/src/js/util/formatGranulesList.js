import { eventEmitter } from '../events/events'
import { createDataLinks } from './granules'

/**
 * @typedef {Object} GranuleListInfo
 * @property {Array} granulesList - An array of formatted granule info
 * @property {Boolean} hasBrowseImagery - Flag to detirmine if any of the granules have browse imagery defined
 */

/**
 * Formats granule results
 * @param {Object} granules - The granules from the redux store.
 * @param {Array} granuleIds - Granule IDs to return in the list.
 * @param {String} focusedGranule - The focused granule.
 * @returns {GranuleListInfo} - The return object
 */
export const formatGranulesList = (granules, granuleIds, focusedGranule) => {
  let hasBrowseImagery = false

  const granulesList = granuleIds.map((granuleId) => {
    const granule = granules.byId[granuleId]

    const original = granule

    const isFocused = focusedGranule === granuleId

    const {
      browse_flag: browseFlag,
      browse_url: browseUrl,
      day_night_flag: dayNightFlag,
      formatted_temporal: formattedTemporal,
      id,
      links,
      online_access_flag: onlineAccessFlag,
      original_format: originalFormat,
      producer_granule_id: producerGranuleId,
      thumbnail: granuleThumbnail,
      title: granuleTitle
    } = granule

    if (browseFlag && !hasBrowseImagery) hasBrowseImagery = true

    const title = producerGranuleId || granuleTitle
    const temporal = formattedTemporal
    const [timeStart, timeEnd] = temporal
    const thumbnail = browseFlag ? granuleThumbnail : false

    const dataLinks = createDataLinks(links)
    const isFocusedGranule = isFocused || focusedGranule === id

    const handleClick = () => {
      let stickyGranule = original
      if (id === focusedGranule) stickyGranule = null
      eventEmitter.emit('map.stickygranule', { granule: stickyGranule })
    }

    const handleMouseEnter = () => {
      eventEmitter.emit('map.focusgranule', { granule: original })
    }

    const handleMouseLeave = () => {
      eventEmitter.emit('map.focusgranule', { granule: null })
    }

    return {
      browseFlag,
      browseUrl,
      dataLinks,
      dayNightFlag,
      formattedTemporal,
      id,
      links,
      onlineAccessFlag,
      original,
      originalFormat,
      producerGranuleId,
      granuleThumbnail,
      title,
      temporal,
      timeStart,
      timeEnd,
      thumbnail,
      isFocusedGranule,
      handleClick,
      handleMouseEnter,
      handleMouseLeave
    }
  })

  return {
    granulesList,
    hasBrowseImagery
  }
}
